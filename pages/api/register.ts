import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '../../util/database';

export type RegisterResponseBody =
  | {
      errors: {
        message: string;
      }[];
    }
  | { user: { id: number } };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponseBody>,
) {
  // check the method post
  if (req.method === 'POST') {
    // hash the password
    const passwordHash = await bcrypt.hash(req.body.password, 12);

    // create the user
    const newUser = await createUser(
      req.body.first_name,
      req.body.last_name,
      req.body.username,
      passwordHash,
    );

    console.log(newUser);

    res.status(200).json({ user: { id: 1 } });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
