import prisma from '@/app/lib/prisma';
import { tryResponseFunction, catchResponseFunction } from '@/app/lib/response_function';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = parseInt(params.id);
    if (isNaN(eventId)) {
      return tryResponseFunction({ message: 'Invalid event ID', success: false }, 400);
    }

    // Vérifier si l'événement existe
    const existingEvent = await prisma.event.findFirst({
      where: { id: eventId, isDeleted: false },
    });

    if (!existingEvent) {
      return tryResponseFunction({ message: 'Event not found or already deleted', success: false }, 404);
    }

    // Effectuer la suppression logique
    await prisma.event.update({
      where: { id: eventId },
      data: { isDeleted: true, status: 'expired' },
    });

    return tryResponseFunction(
      { message: 'Event deleted successfully', success: true },
      200
    );
  } catch (error) {
    return catchResponseFunction(error, 'Error deleting event');
  }
}