exports.up = async (sql) => {
  await sql`
    CREATE TABLE locations (
      id SERIAL PRIMARY KEY,
			address VARCHAR(200) NOT NULL,
			latitude FLOAT NOT NULL,
			longitude FLOAT NOT NULL
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE locations
  `;
};
