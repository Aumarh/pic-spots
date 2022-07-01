exports.up = async (sql) => {
  await sql`
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
			user_id INT NOT NULL,
      username VARCHAR(80) UNIQUE NOT NULL,
			picture_url VARCHAR (255) NOT NULL,
			spot_name VARCHAR(100) NOT NULL,
			post_description VARCHAR(255) NOT NULL,
      location_id INT NOT NULL,
      post_tags INT NOT NULL,
			post_timestamp TIMESTAMP NOT NULL
    )
		`;
};

exports.down = async (sql) => {
  await sql`
  DROP TABLE posts
  `;
};
