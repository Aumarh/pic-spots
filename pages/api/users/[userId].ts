import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../../util/auth';
import { getUserById, getValidSessionByToken } from '../../../util/database';

export default async function profileHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = Number(req.query.userId);

  if (!userId) {
    return res.status(400).json({ error: 'User id is must be valid' });
  }
  // set up profile
  // if (req.method === 'POST') {
  // }

  if (req.method === 'GET') {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User id is must be valid' });
    }

    return res.status(200).json(user);
  }
  // check for the csrfToken
  if (!req.body.csrfToken) {
    return res.status(400).json({
      error: 'no csrf token Found',
    });
  }
  // 1. we get the csrfToken from the body
  const csrfToken = req.body.csrfToken;

  // 2. we get the sessionToken from the cookies
  const sessionToken = req.cookies.sessionToken;

  // 3. we get the session for this session Token
  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    return res.status(403).json({
      error: 'unauthorized user',
    });
  }
  // 4 we validate the csrf token against the seed we have in the database
  if (!verifyCsrfToken(session.csrfSecret, csrfToken)) {
    return res.status(403).json({
      error: 'csrf is not valid',
    });
  }

  res.status(405).json({
    error: 'method not allowed',
  });
}
