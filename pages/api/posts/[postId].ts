import { NextApiRequest, NextApiResponse } from 'next';
import { deletePostByPostId, Post } from '../../../util/database';

type PostRequestBody = {
  post: Post;
  postId: number;
};

export type DeletePostResponseBody =
  | { errors: { message: string }[] }
  | { post: Post };

type PostNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: PostRequestBody;
};

export type PostResponseBody = { errors: string } | { post: Post };

export default async function postHandler(
  request: PostNextApiRequest,
  response: NextApiResponse<PostResponseBody>,
) {
  if (request.method === 'DELETE') {
    const deletedPost = await deletePostByPostId(request.body.postId);
    console.log('this is deleted post', deletedPost);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!deletedPost) {
      response.status(404).json({ errors: 'Post not found' });
      return;
    }

    response.status(200).json({ post: deletedPost });
    return;
  }

  response.status(405).json({ errors: 'Method not allowed' });
}
