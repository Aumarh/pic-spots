exports.up = async (sql) => {
  await sql`
    CREATE TABLE locations (
      id SERIAL PRIMARY KEY,
      spot_name VARCHAR(255) REFERENCES posts (spot_name) ON DELETE CASCADE,
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
