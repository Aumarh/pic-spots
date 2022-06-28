exports.up = async (sql) => {
  await sql`
    CREATE TABLE post_tags (
      id SERIAL PRIMARY KEY,
			post_id INT NOT NULL,
			tag_id INT NOT NULL
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE post_tags
  `;
};
