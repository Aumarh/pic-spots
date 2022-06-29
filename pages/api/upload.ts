import { NextApiRequest, NextApiResponse } from 'next';
import { createPost, Post } from '../../util/database';

type UploadRequestBody = {
  id: number;
  image: string;
  spotName: string;
  postDescription: string;
  locationId: number;
  postTimestamp: Date;
  postTags: string[];
};

type UploadNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: UploadRequestBody;
};

export type UploadResponseBody =
  | { errors: { message: string }[] }
  | { post: Post };

export default async function uploadPostHandler(
  request: UploadNextApiRequest,
  response: NextApiResponse<UploadResponseBody>,
) {
  if (request.method === 'POST') {
    console.log('request body', request.body);
    const post = await createPost(
      request.body.id,
      request.body.image,
      request.body.spotName,
      request.body.postDescription,
      request.body.locationId,
      request.body.postTags,
    );

    response.status(201).json({ post: post });
    return;
  }

  response.status(405).json({
    errors: [
      {
        message: 'Method not supported, try POST instead',
      },
    ],
  });
}
