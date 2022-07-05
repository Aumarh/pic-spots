exports.up = async (sql) => {
  await sql`
    CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
			user_id INT REFERENCES users (id) ON DELETE CASCADE,
			comment_text VARCHAR(255),
			post_id INT REFERENCES posts (id) ON DELETE CASCADE,
			comment_timestamp TIMESTAMP NOT NULL,
      username varchar(30) REFERENCES users(username) ON DELETE CASCADE
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE comments
  `;
};
