exports.up = async (sql) => {
  await sql`
    CREATE TABLE sessions (
      id SERIAL PRIMARY KEY,
			user_id INT REFERENCES users (id) ON DELETE CASCADE,
			token VARCHAR (110) UNIQUE NOT NULL,
			expiry_timestamp timestamp NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
			-- csrf_seed VARCHAR(100) NOT NULL
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE sessions
  `;
};
