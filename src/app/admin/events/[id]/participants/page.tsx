'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { UserIcon, TicketIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Card from '@/components/Card';
import AdminNav from '@/components/AdminNav';
import { useAuth } from '@/hooks/useAuth';

interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  ticketCode: string;
  registrationDate: string;
}

export default function EventParticipantsPage({ params }: { params: { id: string } }) {
  useAuth();
  const router = useRouter();

  const { data, isLoading, error } = useQuery<{
    data: { participants: Participant[] };
  }>({
    queryKey: ['participants', params.id],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/events/${params.id}/participants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Échec du chargement des participants');
      }
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-primary text-center mb-8">
            Participants de l'événement 🎟️
          </h1>

          <button
            onClick={() => router.back()}
            className="mb-6 text-primary hover:text-blue-700 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour
          </button>

          {isLoading && (
            <div className="text-center text-gray-500">Chargement des participants...</div>
          )}

          {error && (
            <div className="bg-red-100 text-error p-4 rounded-lg text-center mb-6">
              Une erreur est survenue : {(error as Error).message}
            </div>
          )}

          <Card>
            {data?.data.participants.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-700">
                      <th className="p-3">Nom</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Code du ticket</th>
                      <th className="p-3">Inscription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.participants.map((participant) => (
                      <tr key={participant.id} className="border-t">
                        <td className="p-3 flex items-center">
                          <UserIcon className="w-5 h-5 mr-2 text-primary" />
                          {participant.firstName} {participant.lastName}
                        </td>
                        <td className="p-3">{participant.email}</td>
                        <td className="p-3 flex items-center">
                          <TicketIcon className="w-5 h-5 mr-2 text-primary" />
                          {participant.ticketCode}
                        </td>
                        <td className="p-3 flex items-center">
                          <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                          {new Date(participant.registrationDate).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Aucun participant pour cet événement. Invitez-en quelques-uns ! 😊
              </p>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}