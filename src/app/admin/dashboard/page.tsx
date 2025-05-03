'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  events: Event[];
  message: string;
  success: boolean;
}

export default function AdminDashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Échec du chargement des événements');
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []); // Dépendance vide : exécuté une seule fois au montage

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-primary text-center mb-8">
          Gérez vos événements avec style ! 🎉
        </h1>

        {isLoading && (
          <div className="text-center text-gray-500">Chargement des événements...</div>
        )}

        {error && (
          <div className="bg-red-100 text-error p-4 rounded-lg text-center mb-6">
            Une erreur est survenue : {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.events?.map((event) => (
            <Card key={event.id}>
              <h2 className="text-xl font-semibold text-primary">{event.title}</h2>
              <p className="text-gray-600 mt-2">{event.description}</p>
              <div className="mt-4 space-y-2">
                <p className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                  {new Date(event.startDate).toLocaleDateString('fr-FR')} -{' '}
                  {new Date(event.endDate).toLocaleDateString('fr-FR')}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-primary" />
                  {event.maxParticipants} places max
                </p>
                <p className="text-sm text-gray-500">
                  Statut :{' '}
                  <span
                    className={
                      event.status === 'active' ? 'text-success' : 'text-error'
                    }
                  >
                    {event.status === 'active' ? 'Actif' : 'Expiré'}
                  </span>
                </p>
              </div>
              <Link href={`/admin/events/${event.id}/participants`} passHref>
                <Button variant="accent" className="mt-4">
                  Voir les participants
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {!isLoading && (!data?.events || data.events.length === 0) && (
          <div className="text-center text-gray-500 mt-8">
            Aucun événement pour le moment. Créez-en un pour commencer ! 🚀
          </div>
        )}
      </motion.div>
    </div>
  );
}