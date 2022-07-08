exports.up = async (sql) => {
  await sql`
    CREATE TABLE profile (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer REFERENCES users (id) ON DELETE CASCADE,
      post_id integer REFERENCES posts (id) ON DELETE CASCADE


    );
  `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE profile
  `;
};
