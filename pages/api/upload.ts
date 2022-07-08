import { NextApiRequest, NextApiResponse } from 'next';
import { createPost, Post } from '../../util/database';

type UploadRequestBody = {
  userId: number;
  username: string;
  pictureUrl: string;
  spotName: string;
  postDescription: string;
  location: string;
  postTimestamp: Date;
  postTag: string;
};

type UploadNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: UploadRequestBody;
};

export type UploadResponseBody =
  | { errors: { message: string }[] }
  | { post: Post };

export default async function uploadPostHandler(
  req: UploadNextApiRequest,
  res: NextApiResponse<UploadResponseBody>,
) {
  if (req.method === 'POST') {
    console.log('request body', req.body);
    if (
      typeof req.body.userId !== 'number' ||
      typeof req.body.username !== 'string' ||
      typeof req.body.pictureUrl !== 'string' ||
      typeof req.body.spotName !== 'string' ||
      typeof req.body.postDescription !== 'string' ||
      typeof req.body.location !== 'string' ||
      !req.body.userId ||
      !req.body.username ||
      !req.body.pictureUrl ||
      !req.body.spotName ||
      !req.body.postDescription ||
      !req.body.location
    ) {
      res.status(401).json({ errors: [{ message: 'provide upload details' }] });
      return;
    }
    const post = await createPost(
      req.body.userId,
      // req.body.username,
      req.body.pictureUrl,
      req.body.spotName,
      req.body.postDescription,
      req.body.location,
      // req.body.postTag,
    );

    res.status(201).json({ post: post });
    return;
  }

  res.status(405).json({
    errors: [
      {
        message: 'Method not supported, try POST instead',
      },
    ],
  });
}
