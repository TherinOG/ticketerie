import { z } from 'zod';

export const loginValidator = z.object({
  email: z.string().email('Veuillez entrer un email valide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});