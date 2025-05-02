import prisma from '@/app/lib/prisma';
import { eventValidator } from '../eventValidator';
import { tryResponseFunction, catchResponseFunction } from '@/app/lib/response_function';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = await eventValidator.parseAsync(body);

    // Créer l'événement
    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        status: validatedData.status,
        maxParticipants: validatedData.maxParticipants,
        isDeleted: false,
      },
    });

    return tryResponseFunction(
      { event, message: 'Event created successfully', success: true },
      201
    );
  } catch (error) {
    return catchResponseFunction(error, 'Error creating event');
  }
}