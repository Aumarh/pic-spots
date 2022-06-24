exports.up = async (sql) => {
  await sql`
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
			profile_id INT NOT NULL,
			picture_url INT NOT NULL,
			spot_name VARCHAR(100) NOT NULL,
			location_id INT NOT NULL,
			post_timestamp TIMESTAMP NOT NULL,
			post_description VARCHAR(255) NOT NULL
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE posts
  `;
};
