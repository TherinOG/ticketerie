import prisma from '@/app/lib/prisma';
import { participantValidator } from '../../participantValidator';
import { tryResponseFunction, catchResponseFunction } from '@/app/lib/response_function';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Valider l'ID de l'événement
    const eventId = parseInt(params.id);
    if (isNaN(eventId)) {
      return tryResponseFunction({ message: 'Invalid event ID', success: false }, 400);
    }

    // Vérifier si l'événement existe, est actif et non supprimé
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        isDeleted: false,
        status: 'active',
      },
      include: {
        participants: true, // Pour compter les participants
      },
    });

    if (!event) {
      return tryResponseFunction({ message: 'Event not found or not active', success: false }, 404);
    }

    // Vérifier la limite de participants
    if (event.participants.length >= event.maxParticipants) {
      return tryResponseFunction({ message: 'Event is full', success: false }, 400);
    }

    // Valider les données de l'inscription
    const body = await req.json();
    const validatedData = await participantValidator.parseAsync(body);

    // Vérifier si l'email est déjà inscrit pour cet événement
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        eventId,
        email: validatedData.email,
      },
    });

    if (existingParticipant) {
      return tryResponseFunction({ message: 'Email already registered for this event', success: false }, 400);
    }

    // Générer un ticketCode unique
    const ticketCode = `TICKET-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Créer le participant
    const participant = await prisma.participant.create({
      data: {
        eventId,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        ticketCode,
      },
    });

    return tryResponseFunction(
      {
        participant: {
          id: participant.id,
          firstName: participant.firstName,
          lastName: participant.lastName,
          email: participant.email,
          ticketCode: participant.ticketCode,
          registrationDate: participant.createdAt,
        },
        message: 'Successfully registered for the event',
        success: true,
      },
      201
    );
  } catch (error) {
    return catchResponseFunction(error, 'Error registering for the event');
  }
}