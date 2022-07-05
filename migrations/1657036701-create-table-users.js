exports.up = async (sql) => {
  await sql`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
			first_name VARCHAR(80) NOT NULL,
			last_name VARCHAR(80) NOT NULL,
      username VARCHAR(80) UNIQUE NOT NULL,
			password_hash VARCHAR (80) NOT NULL,
      bio VARCHAR(255),
      hero_image VARCHAR(255)
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE users
  `;
};
