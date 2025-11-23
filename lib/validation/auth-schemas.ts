import { z } from 'zod';

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido').trim().toLowerCase(),

  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
});

/**
 * Schema de validação para registro
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .refine((name) => /^[a-zA-ZÀ-ÿ\s]+$/.test(name), 'Nome deve conter apenas letras e espaços'),

  email: z.string().min(1, 'Email é obrigatório').email('Email inválido').trim().toLowerCase(),

  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .refine(
      (password) => /[A-Za-z]/.test(password) && /[0-9]/.test(password),
      'Senha deve conter letras e números'
    ),
});

/**
 * Schema de validação para o formulário de signup (inclui confirmação de senha)
 */
export const signupFormSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres')
      .trim()
      .refine((name) => /^[a-zA-ZÀ-ÿ\s]+$/.test(name), 'Nome deve conter apenas letras e espaços'),

    email: z.string().min(1, 'Email é obrigatório').email('Email inválido').trim().toLowerCase(),

    password: z
      .string()
      .min(6, 'Senha deve ter pelo menos 6 caracteres')
      .max(100, 'Senha deve ter no máximo 100 caracteres')
      .refine(
        (password) => /[A-Za-z]/.test(password) && /[0-9]/.test(password),
        'Senha deve conter letras e números'
      ),

    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'], // Define que o erro é no campo confirmPassword
  });

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type SignupFormInput = z.infer<typeof signupFormSchema>;

/**
 * Helper para formatar erros do Zod de forma user-friendly
 */
export const formatAuthErrors = (errors: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};

  errors.issues.forEach((issue) => {
    const path = issue.path.join('.');
    formattedErrors[path] = issue.message;
  });

  return formattedErrors;
};
