import prisma from '@/app/lib/prisma';
import { tryResponseFunction, catchResponseFunction } from '@/app/lib/response_function';

export async function GET(req: Request) {
  try {
    // Récupérer les événements actifs et non supprimés
    const events = await prisma.event.findMany({
      where: {
        isDeleted: false,
        status: 'active',
      },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        maxParticipants: true,
        createdAt: true,
        updatedAt: true,
        status: true,
      },
      orderBy: { startDate: 'asc' }, // Trier par date de début
    });

    return tryResponseFunction(
      {
        events,
        message: 'Events retrieved successfully',
        success: true,
      },
      200
    );
  } catch (error) {
    return catchResponseFunction(error, 'Error retrieving events');
  }
}