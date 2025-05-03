'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CalendarIcon, PencilIcon, TagIcon } from '@heroicons/react/24/outline';
import Button from '@/components/Button';
import Card from '@/components/Card';

interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired';
}

export default function CreateEventPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EventFormData>();

  const onSubmit = async (data: EventFormData) => {
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/events/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Échec de la création de l\'événement');
      }

      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez !');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 text-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full"
      >
        <Card>
          <h1 className="text-3xl font-bold text-center text-primary mb-6">
            Créez un nouvel événement ! 🎉
          </h1>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 text-error p-3 rounded-lg mb-4 flex items-center"
            >
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <PencilIcon className="w-5 h-5 mr-2 text-primary" />
                Titre
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="title"
                type="text"
                {...register('title')}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                placeholder="Nom de votre événement"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <PencilIcon className="w-5 h-5 mr-2 text-primary" />
                Description
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                id="description"
                {...register('description')}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition resize-y"
                placeholder="Décrivez votre événement"
                rows={4}
              />
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                Date de début
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="startDate"
                type="datetime-local"
                {...register('startDate')}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                Date de fin
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="endDate"
                type="datetime-local"
                {...register('endDate')}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <TagIcon className="w-5 h-5 mr-2 text-primary" />
                Statut
              </label>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                id="status"
                {...register('status')}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              >
                <option value="active">Actif</option>
                <option value="expired">Expiré</option>
              </motion.select>
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              {isSubmitting ? 'Création en cours...' : 'Créer l\'événement 🚀'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}