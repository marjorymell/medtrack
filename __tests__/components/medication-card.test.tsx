import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MedicationCard } from '@/components/medication-card';
import { TodayMedication } from '@/types/medication';

// Mock do hook de cores
jest.mock('@/hooks/use-theme-colors', () => ({
  useThemeColors: () => ({
    primary: '#05D3DB',
    textPrimary: '#121417',
    textSecondary: '#637387',
  }),
}));

describe('MedicationCard', () => {
  const mockOnConfirm = jest.fn();
  const mockOnPostpone = jest.fn();

  const defaultMedication: TodayMedication = {
    scheduleId: 'schedule-1',
    medicationId: 'med-1',
    name: 'Paracetamol',
    dosage: '750mg',
    time: '08:00',
    taken: false,
    status: 'pending',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar informações do medicamento corretamente', () => {
      const { getByText } = render(
        <MedicationCard
          medication={defaultMedication}
          onConfirm={mockOnConfirm}
          onPostpone={mockOnPostpone}
        />
      );

      expect(getByText('08:00')).toBeTruthy();
      expect(getByText('Paracetamol')).toBeTruthy();
      expect(getByText('750mg')).toBeTruthy();
    });

    it('deve exibir botões de ação quando não tomado', () => {
      const { getByText } = render(
        <MedicationCard
          medication={defaultMedication}
          onConfirm={mockOnConfirm}
          onPostpone={mockOnPostpone}
        />
      );

      expect(getByText('✓ Confirmar')).toBeTruthy();
      expect(getByText('⏰ Adiar')).toBeTruthy();
    });

    it('não deve exibir botões quando medicamento já foi tomado', () => {
      const takenMedication = { ...defaultMedication, taken: true };

      const { queryByText, getByText } = render(
        <MedicationCard
          medication={takenMedication}
          onConfirm={mockOnConfirm}
          onPostpone={mockOnPostpone}
        />
      );

      expect(queryByText('✓ Confirmar')).toBeNull();
      expect(queryByText('⏰ Adiar')).toBeNull();
      expect(getByText('✓ Dose confirmada com sucesso!')).toBeTruthy();
    });
  });

  describe('Status Visual', () => {
    it('deve exibir status "Tomado" quando medicamento foi tomado', () => {
      const takenMedication = { ...defaultMedication, taken: true };

      const { getByText } = render(
        <MedicationCard
          medication={takenMedication}
          onConfirm={mockOnConfirm}
          onPostpone={mockOnPostpone}
        />
      );

      expect(getByText('Tomado')).toBeTruthy();
    });

    it('deve exibir status "Adiado" quando medicamento foi adiado', () => {
      const postponedMedication = { ...defaultMedication, status: 'postponed' as const };

      const { getByText } = render(
        <MedicationCard
          medication={postponedMedication}
          onConfirm={mockOnConfirm}
          onPostpone={mockOnPostpone}
        />
      );

      expect(getByText('Adiado')).toBeTruthy();
    });
  });

  describe('Interações', () => {
    it('deve chamar onConfirm ao clicar em confirmar', () => {
      const { getByText } = render(
        <MedicationCard
          medication={defaultMedication}
          onConfirm={mockOnConfirm}
          onPostpone={mockOnPostpone}
        />
      );

      const confirmButton = getByText('✓ Confirmar');
      fireEvent.press(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledWith('schedule-1');
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPostpone ao clicar em adiar', () => {
      const { getByText } = render(
        <MedicationCard
          medication={defaultMedication}
          onConfirm={mockOnConfirm}
          onPostpone={mockOnPostpone}
        />
      );

      const postponeButton = getByText('⏰ Adiar');
      fireEvent.press(postponeButton);

      expect(mockOnPostpone).toHaveBeenCalledWith('schedule-1');
      expect(mockOnPostpone).toHaveBeenCalledTimes(1);
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter labels de acessibilidade corretos', () => {
      const { getByLabelText } = render(
        <MedicationCard
          medication={defaultMedication}
          onConfirm={mockOnConfirm}
          onPostpone={mockOnPostpone}
        />
      );

      expect(getByLabelText('Confirmar dose de Paracetamol')).toBeTruthy();
      expect(getByLabelText('Adiar dose de Paracetamol')).toBeTruthy();
    });

    it('deve ter roles de acessibilidade corretos', () => {
      const { getAllByRole } = render(
        <MedicationCard
          medication={defaultMedication}
          onConfirm={mockOnConfirm}
          onPostpone={mockOnPostpone}
        />
      );

      const buttons = getAllByRole('button');
      expect(buttons).toHaveLength(2); // Confirmar e Adiar
    });
  });
});
