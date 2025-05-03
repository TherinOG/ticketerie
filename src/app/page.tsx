'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { z } from 'zod';

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  status: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  events: Event[];
}

const participantValidator = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
});

type ParticipantFormData = z.infer<typeof participantValidator>;

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [participationError, setParticipationError] = useState<string | null>(null);
  const [participationSuccess, setParticipationSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ParticipantFormData>({
    resolver: zodResolver(participantValidator),
  });

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/public/events');
        if (!response.ok) {
          throw new Error('Échec du chargement des événements');
        }
        const json: ApiResponse = await response.json();
        console.log(json);
        setEvents(json.events);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const onSubmit = async (data: ParticipantFormData) => {
    if (!selectedEvent) return;
    setParticipationError(null);
    setParticipationSuccess(null);

    try {
      const response = await fetch(`/api/events/${selectedEvent.id}/participate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Échec de la participation');
      }

      setParticipationSuccess('Inscription réussie ! Vous êtes inscrit à l\'événement 🎉');
      reset();
      setTimeout(() => setSelectedEvent(null), 2000); // Ferme la modale après 2s
    } catch (err) {
      setParticipationError(err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez !');
    }
  };

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 text-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-primary text-center mb-8">
          Découvrez nos événements ! 🎉
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
          {events.map((event) => (
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
              <Button
                variant="accent"
                className="mt-4 w-full"
                onClick={() => setSelectedEvent(event)}
                disabled={event.status !== 'active'}
              >
                Participer 🚀
              </Button>
            </Card>
          ))}
        </div>

        {!isLoading && events.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            Aucun événement pour le moment. Revenez bientôt ! 😊
          </div>
        )}

        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white p-6 rounded-2xl max-w-md w-full"
              >
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Inscription à {selectedEvent.title}
                </h2>

                {participationSuccess && (
                  <div className="bg-green-100 text-success p-3 rounded-lg mb-4">
                    {participationSuccess}
                  </div>
                )}

                {participationError && (
                  <div className="bg-red-100 text-error p-3 rounded-lg mb-4">
                    {participationError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      <UserIcon className="w-5 h-5 mr-2 text-primary" />
                      Prénom
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      id="firstName"
                      type="text"
                      {...register('firstName')}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                      placeholder="Votre prénom"
                      aria-invalid={errors.firstName ? 'true' : 'false'}
                    />
                    {errors.firstName && (
                      <p className="text-error text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      <UserIcon className="w-5 h-5 mr-2 text-primary" />
                      Nom
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      id="lastName"
                      type="text"
                      {...register('lastName')}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                      placeholder="Votre nom"
                      aria-invalid={errors.lastName ? 'true' : 'false'}
                    />
                    {errors.lastName && (
                      <p className="text-error text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      Email
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      id="email"
                      type="email"
                      {...register('email')}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                      placeholder="Votre email"
                      aria-invalid={errors.email ? 'true' : 'false'}
                    />
                    {errors.email && (
                      <p className="text-error text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? 'Inscription...' : 'Confirmer 🚀'}
                    </Button>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => {
                        setSelectedEvent(null);
                        reset();
                        setParticipationError(null);
                        setParticipationSuccess(null);
                      }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}