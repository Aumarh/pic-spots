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
  if (request.method === 'DELETE') {
    const deletedComment = await deleteCommentById(commentId);
    response.status(201).json({ comment: deletedComment });
    return;
  }
}
