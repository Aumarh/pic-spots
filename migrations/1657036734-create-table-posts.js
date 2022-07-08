exports.up = async (sql) => {
  await sql`
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
			user_id INT REFERENCES users (id) ON DELETE CASCADE,
			picture_url VARCHAR (255) NOT NULL,
			spot_name VARCHAR(100) NOT NULL,
			post_description VARCHAR(255) NOT NULL,
      location VARCHAR(100) NOT NULL
			-- post_timestamp TIMESTAMP NOT NULL DEFAULT NOW()
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE posts
  `;
};
