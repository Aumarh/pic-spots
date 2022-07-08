exports.up = async (sql) => {
  await sql`
    CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
			user_id INT REFERENCES users (id) ON DELETE CASCADE,
			post_id INT REFERENCES posts (id) ON DELETE CASCADE,
      comment_text VARCHAR(255),
      username varchar(30) REFERENCES users(username) ON DELETE CASCADE
      -- hero_image varchar (255) REFERENCES users(hero_image) ON DELETE CASCADE
			-- comment_timestamp TIMESTAMP NOT NULL DEFAULT NOW()
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE comments
  `;
};
