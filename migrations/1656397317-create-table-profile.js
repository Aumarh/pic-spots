exports.up = async (sql) => {
  await sql`
    CREATE TABLE profile (
      id SERIAL PRIMARY KEY,
			user_id INT NOT NULL,
			bio VARCHAR(255) NOT NULL
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE profile
  `;
};
