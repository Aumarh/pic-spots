exports.up = async (sql) => {
  await sql`
    ALTER TABLE posts
    ADD latitude FLOAT,
    ADD longitude FLOAT;
  `;
};

exports.down = async (sql) => {
  await sql`
    ALTER TABLE posts
    DROP COLUMN latitude,
    DROP COLUMN longitude;
  `;
};
