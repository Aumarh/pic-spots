import { NextApiRequest, NextApiResponse } from 'next';
import { createComment, deleteCommentById } from '../../util/database';

// type CommentRequestBody = {
//   userId: number;
//   postId: number;
//   comment: string;
//   username: string;
//   image: string;
// };

// type CommentNextApiRequest = Omit<NextApiRequest, 'body'> & {
//   body: CommentRequestBody;
// };

// export type CommentResponseBody =
//   | { errors: { message: string }[] }
//   | { comment: Comment };

export default async function commentsHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    const createdComment = await createComment(
      request.body.userId,
      request.body.postId,
      request.body.commentFromUser,
      request.body.username,
    );
    response.status(201).json({ comment: createdComment });
    return;
  }
  const commentId = Number(request.query.commentId);
  if (request.method === 'DELETE') {
    const deletedComment = await deleteCommentById(commentId);
    response.status(201).json({ comment: deletedComment });
    return;
  }
}
