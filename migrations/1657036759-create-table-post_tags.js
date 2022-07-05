exports.up = async (sql) => {
  await sql`
    CREATE TABLE post_tags (
      id SERIAL PRIMARY KEY,
			user_id INT REFERENCES users (id) ON DELETE CASCADE,
			tag_name VARCHAR(100) NOT NULL
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE post_tags
  `;
};
