import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createCSRFSecret } from '../../util/auth';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
import {
  createSession,
  createUser,
  getUserByUsername,
  User,
} from '../../util/database';

type RegisterRequestBody = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  csrfToken: string;
  heroImage: string;
  bio: string;
};

type RegisterNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: RegisterRequestBody;
};

export type RegisterResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | { user: User };

export default async function handler(
  req: RegisterNextApiRequest,
  res: NextApiResponse<RegisterResponseBody>,
) {
  // check the method post
  if (req.method === 'POST') {
    console.log('req.body', req.body);
    if (
      typeof req.body.firstName !== 'string' ||
      typeof req.body.lastName !== 'string' ||
      typeof req.body.username !== 'string' ||
      typeof req.body.password !== 'string' ||
      typeof req.body.bio !== 'string' ||
      // typeof req.body.heroImage !== 'string' ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.username ||
      !req.body.password ||
      !req.body.bio
      // !req.body.heroImage
    ) {
      res
        .status(401)
        .json({ errors: [{ message: 'username or password not provided' }] });
      return;
    }

    // adding extra checks and constraints

    if (await getUserByUsername(req.body.username)) {
      res.status(401).json({ errors: [{ message: 'username already taken' }] });
      return;
    }
    // hash the password
    const passwordHash = await bcrypt.hash(req.body.password, 12);

    // create the user
    const user = await createUser(
      req.body.firstName,
      req.body.lastName,
      req.body.username,
      passwordHash,
      req.body.bio,
      req.body.heroImage,
    );

    // create a session token for the user
    const token = crypto.randomBytes(80).toString('base64');

    // create a secret for the user
    const csrfSecret = createCSRFSecret();

    // save the token to the database
    const session = await createSession(token, user.id, csrfSecret);

    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    res
      .status(200)
      // Tells the browser to create the cookie for us
      .setHeader('set-Cookie', serializedCookie)
      .json({ user: user });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
