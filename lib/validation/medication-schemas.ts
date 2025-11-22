import { z } from 'zod';

/**
 * Schema de validação para criação de medicamento
 * Segue as regras de negócio definidas em copilot-instructions.md
 */
export const createMedicationSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  dosage: z
    .string()
    .min(1, 'Dosagem é obrigatória')
    .max(50, 'Dosagem deve ter no máximo 50 caracteres')
    .trim(),

  frequency: z.enum(
    ['ONE_TIME', 'TWICE_A_DAY', 'THREE_TIMES_A_DAY', 'FOUR_TIMES_A_DAY', 'WEEKLY', 'MONTHLY'],
    { message: 'Frequência inválida' }
  ),

  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário deve estar no formato HH:MM')
    .trim(),

  intervalHours: z
    .number()
    .int('Intervalo deve ser um número inteiro')
    .positive('Intervalo deve ser positivo'),

  stock: z
    .number()
    .int('Estoque deve ser um número inteiro')
    .min(0, 'Estoque não pode ser negativo')
    .max(9999, 'Estoque deve ser menor que 10.000'),

  expiresAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD')
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      { message: 'Data de validade deve ser futura' }
    )
    .optional(),

  notes: z.string().max(500, 'Observação deve ter no máximo 500 caracteres').trim().optional(),
});

/**
 * Schema de validação para atualização de medicamento
 * Todos os campos são opcionais, mas quando presentes devem ser válidos
 */
export const updateMedicationSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  dosage: z
    .string()
    .min(1, 'Dosagem é obrigatória')
    .max(50, 'Dosagem deve ter no máximo 50 caracteres')
    .trim()
    .optional(),

  frequency: z
    .enum(
      ['ONE_TIME', 'TWICE_A_DAY', 'THREE_TIMES_A_DAY', 'FOUR_TIMES_A_DAY', 'WEEKLY', 'MONTHLY'],
      { message: 'Frequência inválida' }
    )
    .optional(),

  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário deve estar no formato HH:MM')
    .trim()
    .optional(),

  intervalHours: z
    .number()
    .int('Intervalo deve ser um número inteiro')
    .positive('Intervalo deve ser positivo')
    .optional(),

  stock: z
    .number()
    .int('Estoque deve ser um número inteiro')
    .min(0, 'Estoque não pode ser negativo')
    .max(9999, 'Estoque deve ser menor que 10.000')
    .optional(),

  expiresAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD')
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      { message: 'Data de validade deve ser futura' }
    )
    .optional(),

  notes: z.string().max(500, 'Observação deve ter no máximo 500 caracteres').trim().optional(),
});

/**
 * Schema para validação de estoque
 */
export const updateStockSchema = z.object({
  stock: z
    .number()
    .int('Estoque deve ser um número inteiro')
    .min(0, 'Estoque não pode ser negativo')
    .max(9999, 'Estoque deve ser menor que 10.000'),
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type CreateMedicationInput = z.infer<typeof createMedicationSchema>;
export type UpdateMedicationInput = z.infer<typeof updateMedicationSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;

/**
 * Helper para formatar erros do Zod de forma user-friendly
 */
export const formatZodErrors = (errors: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};

  errors.issues.forEach((issue) => {
    const path = issue.path.join('.');
    formattedErrors[path] = issue.message;
  });

  return formattedErrors;
};
