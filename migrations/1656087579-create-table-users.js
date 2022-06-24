exports.up = async (sql) => {
  await sql`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
			first_name VARCHAR(80) NOT NULL,
			last_name VARCHAR(80) NOT NULL,
      username VARCHAR(80) NOT NULL,
			password_hash CHAR(56) NOT NULL
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE users
  `;
};

// description VARCHAR(280) NOT NULL,
// latitude FLOAT NOT NULL,
// longitude FLOAT NOT NULL,
// created_at TIMESTAMP NOT NULL DEFAULT NOW(),
// updated_at TIMESTAMP NOT NULL DEFAULT NOW()
