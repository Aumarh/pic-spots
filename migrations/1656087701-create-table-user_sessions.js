exports.up = async (sql) => {
  await sql`
    CREATE TABLE user_sessions (
      id SERIAL PRIMARY KEY,
			user_id INT NOT NULL,
			token VARCHAR(255) NOT NULL,
			expiry_timestamp TIMESTAMP NOT NULL,
			csrf_seed VARCHAR(255) NOT NULL
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE user_sessions
  `;
};
