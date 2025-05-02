import prisma from '@/app/lib/prisma';
import { tryResponseFunction, catchResponseFunction } from '@/app/lib/response_function';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Valider l'ID de l'événement
    const eventId = parseInt(params.id);
    if (isNaN(eventId)) {
      return tryResponseFunction({ message: 'Invalid event ID', success: false }, 400);
    }

    // Vérifier si l'événement existe et n'est pas supprimé
    const event = await prisma.event.findFirst({
      where: { id: eventId, isDeleted: false },
      include: {
        participants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            ticketCode: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'asc' }, // Trier par date d'inscription
        },
      },
    });

    if (!event) {
      return tryResponseFunction({ message: 'Event not found', success: false }, 404);
    }

    // Formatter la réponse
    const participants = event.participants.map((participant) => ({
      id: participant.id,
      firstName: participant.firstName,
      lastName: participant.lastName,
      email: participant.email,
      ticketCode: participant.ticketCode,
      registrationDate: participant.createdAt, // Utiliser createdAt comme date d'inscription
    }));

    return tryResponseFunction(
      {
        participants,
        message: 'Participants retrieved successfully',
        success: true,
      },
      200
    );
  } catch (error) {
    return catchResponseFunction(error, 'Error retrieving participants');
  }
}