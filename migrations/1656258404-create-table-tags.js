exports.up = async (sql) => {
  await sql`
    CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
			tag_name VARCHAR(100) NOT NULL
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE tags
  `;
};
