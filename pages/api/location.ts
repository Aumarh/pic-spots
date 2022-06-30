import { NextApiRequest, NextApiResponse } from 'next';
import { createLocation } from '../../util/database';

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

export default async function locationHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    const createdLocation = await createLocation(
      request.body.userId,
      request.body.spotName,
      request.body.longitude,
      request.body.latitude,
    );
    response.status(201).json({ locationId: createdLocation });
    return;
  }
  // const commentId = Number(request.query.commentId);
  // if (request.method === 'DELETE') {
  //   const deletedComment = await deleteCommentById(commentId);
  //   response.status(201).json({ comment: deletedComment });
  //   return;
  // }
}
