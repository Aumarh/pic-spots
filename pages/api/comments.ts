import { NextApiRequest, NextApiResponse } from 'next';
import { createComment, deleteCommentById } from '../../util/database';

export default async function commentsHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    const createdComment = await createComment(
      request.body.userId,
      request.body.postId,
      request.body.commentText,
      request.body.username,
      request.body.heroImage,
    );
    response.status(201).json({ comment: createdComment });
    return;
  }
  // console.log('this is comment', createComment);

  const commentId = Number(request.query.commentId);
  console.log('this is comment Id', commentId);
  if (request.method === 'DELETE') {
    const deletedComment = await deleteCommentById(request.body.commentId);
    console.log('this is deleted comment', deletedComment);
    response.status(201).json({ comment: deletedComment });
    return;
  }
  response.status(405).json({ errors: 'Method not allowed' });
}
