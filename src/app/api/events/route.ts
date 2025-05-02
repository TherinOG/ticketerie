
import prisma from '@/app/lib/prisma';
import { tryResponseFunction, catchResponseFunction } from '@/app/lib/response_function';

export async function GET(req: Request) {
  try {
    // Récupérer tous les événements non supprimés
    const events = await prisma.event.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' }, // Optionnel : trier par date de création
    });

    return tryResponseFunction(
      { events, message: 'Events retrieved successfully', success: true },
      200
    );
  } catch (error) {
    return catchResponseFunction(error, 'Error retrieving events');
  }
}