import { NextApiRequest, NextApiResponse } from 'next';
import { createLocation } from '../../util/database';

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
}
