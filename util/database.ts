import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';

// import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku';

config();

// Type needed for the connection function below
declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}
// Connect only once to the database
function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }
  return sql;
}

// Connect to PostgreSQL
const sql = connectOneTimeToDatabase();

export type User = {
  id: number;
  username: string;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

type Session = {
  id: number;
  token: string;
  csrfToken: string;
  // expiryTimestamp: Date;
  // userId: number;
};

export type Profile = {
  id: number;
  userId: number;
  image: string;
  bio: string;
};

export type Post = {
  id: number;
  // userId: number;
  image: string;
  spotName: string;
  postDescription: string;
  locationId: number;
  postTimestamp: Date;
  postTags: string[];
};

export type Comment = {
  id: number;
  userId: number;
  postId: number;
  comment: string;
  username: string;
  postTimestamp: Date;
};

export async function createUser(
  firstName: string,
  lastName: string,
  username: string,
  passwordHash: string,
) {
  const [user] = await sql<[User]>`
  INSERT INTO users
    (first_name, last_name, username, password_hash)
  VALUES
    (${firstName}, ${lastName}, ${username}, ${passwordHash})
  RETURNING
    id,
    username
  `;

  return camelcaseKeys(user);
}

export async function getUserByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<[User | undefined]>`
  SELECT
    id,
    username
  FROM
    users
  WHERE
    username = ${username}
  `;

  return user && camelcaseKeys(user);
}

export async function getUserById(userId: number) {
  if (!userId) return undefined;

  const [user] = await sql<[User | undefined]>`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      id = ${userId}
  `;
  return user && camelcaseKeys(user);
}

export async function getUserWithPasswordHashByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<[UserWithPasswordHash | undefined]>`
    SELECT
     *
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user && camelcaseKeys(user);
}

export async function createSession(
  token: string,
  userId: User['id'],
  CSRFSecret: string,
) {
  const [session] = await sql<[Session]>`
  INSERT INTO sessions
    (token, user_id, csrf_seed)
  VALUES
    (${token}, ${userId} , ${CSRFSecret})
  RETURNING
    id,
    token
  `;

  await deleteExpiredSessions();

  return camelcaseKeys(session);
}

type SessionWithCSRFSecret = Session & { csrfSecret: string };

export async function getValidSessionByToken(token: string) {
  if (!token) return undefined;

  const [session] = await sql<[SessionWithCSRFSecret | undefined]>`
  SELECT
    sessions.id,
    sessions.token,
    sessions.csrf_seed
  FROM
    sessions
  WHERE
    sessions.token = ${token} AND
    sessions.expiry_timestamp > now();
  `;

  await deleteExpiredSessions();

  return session && camelcaseKeys(session);
}

export async function getUserByValidSessionToken(token: string) {
  if (!token) return undefined;

  const [user] = await sql<[User | undefined]>`
  SELECT
    users.id,
    users.username
  FROM
    users,
    sessions
  WHERE
    sessions.token = ${token} AND
    sessions.user_id = users.id AND
    sessions.expiry_timestamp > now();
  `;

  await deleteExpiredSessions();

  return user && camelcaseKeys(user);
}

export async function deleteSessionByToken(token: string) {
  const [session] = await sql<[Session | undefined]>`
  DELETE FROM
    sessions
  WHERE
    sessions.token = ${token}
  RETURNING *
  `;

  return session && camelcaseKeys(session);
}

export async function deleteExpiredSessions() {
  const sessions = await sql<[Session[]]>`
  DELETE FROM
    sessions
  WHERE
    expiry_timestamp < now()
  RETURNING *
  `;

  return sessions.map((session) => camelcaseKeys(session));
}

export async function createPost(
  userId: number,
  image: string,
  spotName: string,
  postDescription: string,
  locationId: number,
  postTags: string[],
) {
  const [post] = await sql<[Post]>`
  INSERT INTO posts
    (user_id, image, spot_name, post_description, location_id, post_tags)
  VALUES
    (${userId}, ${image}, ${spotName}, ${postDescription}, ${locationId}, ${postTags})
  RETURNING
    id,
    image,
    spot_name,
    post_description,
    location_id,
    post_tags,
    post_timestamp
  `;

  return camelcaseKeys(post);
}

export async function createLocation(
  userId: number,
  spotName: string,
  latitude: number,
  longitude: number,
) {
  const [location] = await sql<[Post]>`
  INSERT INTO locations
    (user_id, spot_name, latitude, longitude)
  VALUES
    (${userId},  ${spotName}, ${longitude}, ${latitude})
  RETURNING
    id,
    latitude,
    longitude
  `;

  return camelcaseKeys(location);
}

// GET ALL POSTS
export async function getPosts() {
  const posts = await sql<[Post[]]>`
  SELECT
    *
  FROM
    posts
  `;

  return posts.map((post) => camelcaseKeys(post));
}

// GET POST BY ID
export async function getPostById(postId: number) {
  const [post] = await sql<[Post | undefined]>`
  SELECT
    id,
    image,
    spot_name,
    post_description,
    location_id,
    post_tags
   FROM
    posts
   WHERE
    id = ${postId}
   `;

  return post && camelcaseKeys(post);
}

export async function getPostsByUserId(userId: number) {
  const posts = await sql<[Post[]]>`
  SELECT
    *
  FROM
    posts
  WHERE
    user_id = ${userId}
  `;

  return posts.map((post) => camelcaseKeys(post));
}

export async function getPostsByLocationId(locationId: number) {
  const posts = await sql<[Post[]]>`
  SELECT
    *
  FROM
    posts
  WHERE
    location_id = ${locationId}
  `;

  return posts.map((post) => camelcaseKeys(post));
}

export async function getPostsByTag(tag: string) {
  const posts = await sql<[Post[]]>`
  SELECT
    *
  FROM
    posts
  WHERE
    post_tags @> ARRAY[${tag}]
  `;

  return posts.map((post) => camelcaseKeys(post));
}

export async function updatePostById(
  postId: number,
  image: string,
  spotName: string,
  postDescription: string,
  locationId: number,
  postTags: string[],
) {
  const [post] = await sql<[Post]>`
  UPDATE
    posts
  SET
    image = ${image},
    spot_name = ${spotName},
    post_description = ${postDescription},
    location_id = ${locationId},
    post_tags = ${postTags}
  WHERE
    id = ${postId}
  RETURNING
    id,
    image,
    spot_name,
    post_description,
    location_id,
    post_tags,
    post_timestamp
  `;

  return camelcaseKeys(post);
}

// Delete post by id
export async function deletePostByPostId(postId: number) {
  const [post] = await sql<[Post | undefined]>`
  DELETE FROM
    posts
  WHERE
    id = ${postId}
  RETURNING
   *
  `;

  return post && camelcaseKeys(post);
}

// Create comments
export async function createComment(
  userId: number,
  postId: number,
  commentText: string,
  username: string,
) {
  const [comment] = await sql<[Comment]>`
  INSERT INTO comments
    (user_id, post_id, comment_text, username)
  VALUES
    (${userId}, ${postId}, ${commentText}, ${username})
  RETURNING
    id,
    user_id,
    post_id,
    comment_text,
    username,
    comment_timestamp
  `;

  return camelcaseKeys(comment);
}

// Get comments by post id
export async function getCommentsByPostId(postId: number) {
  const comments = await sql<[Comment[]]>`
  SELECT
    *
  FROM
    comments
  WHERE
    post_id = ${postId}
  `;

  return comments.map((comment) => camelcaseKeys(comment));
}

// Delete comment by id
export async function deleteCommentById(commentId: number) {
  const [comment] = await sql<[Comment | undefined]>`
  DELETE FROM
    comments
  WHERE
    id = ${commentId}
  RETURNING
   *
  `;

  return comment && camelcaseKeys(comment);
}
