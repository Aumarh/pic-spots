exports.up = async (sql) => {
  await sql`
    CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
			user_id INT NOT NULL,
			content VARCHAR(255) NOT NULL,
			post_id INT NOT NULL,
			post_timestamp TIMESTAMP NOT NULL
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE comments
  `;
};
