import prisma from '@/app/lib/prisma';
import { eventValidator } from '../../eventValidator';
import { tryResponseFunction, catchResponseFunction } from '@/app/lib/response_function';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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
      return tryResponseFunction({ message: 'Event not found', success: false }, 404);
    }

    const body = await req.json();
    const validatedData = await eventValidator.parseAsync(body);

    // Mettre à jour l'événement
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        status: validatedData.status,
        maxParticipants: validatedData.maxParticipants,
      },
    });

    return tryResponseFunction(
      { event: updatedEvent, message: 'Event updated successfully', success: true },
      200
    );
  } catch (error) {
    return catchResponseFunction(error, 'Error updating event');
  }
}