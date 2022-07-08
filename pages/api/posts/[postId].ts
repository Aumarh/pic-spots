import { NextApiRequest, NextApiResponse } from 'next';
import {
  deletePostByPostId,
  Post,
  updatePostById,
} from '../../../util/database';

type PostRequestBody = {
  post: Post;
};

// type DeletePostResponseBody =
//   | { errors: { message: string }[] }
//   | { post: Post };

type PostNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: PostRequestBody;
};

export type PostResponseBody = { errors: string } | { post: Post };

export default async function postHandler(
  request: PostNextApiRequest,
  response: NextApiResponse<PostResponseBody>,
) {
  console.log('this is the id', request.body.post.id);

  // check that the id is passed as a number
  const postId = Number(request.query.postId);
  console.log(postId);

  // check if postId is not a number
  if (!postId) {
    response.status(400).json({ errors: 'PostId must be a number' });
    return;
  } else if (request.method === 'POST') {
    // Access the post from the request body
    const postFromRequest = request.body.post;
    const updatedPost = await updatePostById(
      postId,
      postFromRequest.pictureUrl,
      postFromRequest.spotName,
      postFromRequest.postDescription,
      postFromRequest.location,
      postFromRequest.postTags,
    );

    // if (!updatedPost) {
    //   response.status(404).json({ errors: 'Post not found' });
    //   return;
    // }

    response.status(200).json({ post: updatedPost });
    return;
  } else if (request.method === 'DELETE') {
    const deletedPost = await deletePostByPostId(postId);

    if (!deletedPost) {
      response.status(404).json({ errors: 'Post not found' });
      return;
    }

    response.status(200).json({ post: deletedPost });
    return;
  }
  response.status(405).json({ errors: 'Method not allowed' });
}
