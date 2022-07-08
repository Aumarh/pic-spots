import { NextApiRequest, NextApiResponse } from 'next';
import { createPostTag } from '../../util/database';

export default async function postTagHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    const createdPostTag = await createPostTag(
      request.body.userId,
      request.body.tagName,
    );
    response.status(201).json({ postTag: createdPostTag });
    return;
  }
}
