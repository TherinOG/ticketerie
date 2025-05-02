import prisma from '@/app/lib/prisma';
import { tryResponseFunction, catchResponseFunction } from '@/app/lib/response_function';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    if (isNaN(eventId)) {
      return tryResponseFunction({ message: 'Invalid event ID', success: false }, 400);
    }

    // Récupérer l'événement
    const event = await prisma.event.findFirst({
      where: { id: eventId, isDeleted: false },
    });

    if (!event) {
      return tryResponseFunction({ message: 'Event not found', success: false }, 404);
    }

    return tryResponseFunction(
      { event, message: 'Event retrieved successfully', success: true },
      200
    );
  } catch (error) {
    return catchResponseFunction(error, 'Error retrieving event');
  }
}