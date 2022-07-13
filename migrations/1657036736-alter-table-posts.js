exports.up = async (sql) => {
  await sql`
    ALTER TABLE posts
    ADD latitude FLOAT,
    ADD longitude FLOAT;
  `;
};

exports.down = async (sql) => {
  await sql`
    ALTER TABLE sessions
    DROP COLUMN latitude,
    DROP COLUMN longitude;
  `;
};
