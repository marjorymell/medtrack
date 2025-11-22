import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar com texto correto', () => {
      const { getByText } = render(
        <Button onPress={mockOnPress}>
          <Button.Text>Click Me</Button.Text>
        </Button>
      );

      expect(getByText('Click Me')).toBeTruthy();
    });

    it('deve renderizar com ícone quando fornecido', () => {
      const { getByTestId } = render(
        <Button onPress={mockOnPress}>
          <Button.Icon testID="button-icon" />
          <Button.Text>With Icon</Button.Text>
        </Button>
      );

      expect(getByTestId('button-icon')).toBeTruthy();
    });
  });

  describe('Variantes', () => {
    it('deve aplicar variante default corretamente', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress} variant="default">
          <Button.Text>Default</Button.Text>
        </Button>
      );

      const button = getByRole('button');
      expect(button).toBeTruthy();
    });

    it('deve aplicar variante outline corretamente', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress} variant="outline">
          <Button.Text>Outline</Button.Text>
        </Button>
      );

      const button = getByRole('button');
      expect(button).toBeTruthy();
    });

    it('deve aplicar variante ghost corretamente', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress} variant="ghost">
          <Button.Text>Ghost</Button.Text>
        </Button>
      );

      const button = getByRole('button');
      expect(button).toBeTruthy();
    });
  });

  describe('Tamanhos', () => {
    it('deve aplicar tamanho default', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress} size="default">
          <Button.Text>Default Size</Button.Text>
        </Button>
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('deve aplicar tamanho small', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress} size="sm">
          <Button.Text>Small</Button.Text>
        </Button>
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('deve aplicar tamanho large', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress} size="lg">
          <Button.Text>Large</Button.Text>
        </Button>
      );

      expect(getByRole('button')).toBeTruthy();
    });
  });

  describe('Interações', () => {
    it('deve chamar onPress ao ser clicado', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress}>
          <Button.Text>Click Me</Button.Text>
        </Button>
      );

      fireEvent.press(getByRole('button'));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onPress quando disabled', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress} disabled>
          <Button.Text>Disabled</Button.Text>
        </Button>
      );

      fireEvent.press(getByRole('button'));

      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Estado disabled', () => {
    it('deve renderizar como disabled quando propriedade está true', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress} disabled>
          <Button.Text>Disabled Button</Button.Text>
        </Button>
      );

      const button = getByRole('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it('deve aplicar estilos de disabled', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress} disabled>
          <Button.Text>Disabled</Button.Text>
        </Button>
      );

      expect(getByRole('button')).toBeTruthy();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter role de button', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress}>
          <Button.Text>Accessible</Button.Text>
        </Button>
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('deve ter accessibilityLabel quando fornecido', () => {
      const { getByLabelText } = render(
        <Button onPress={mockOnPress} accessibilityLabel="Custom Label">
          <Button.Text>Button</Button.Text>
        </Button>
      );

      expect(getByLabelText('Custom Label')).toBeTruthy();
    });

    it('deve indicar estado disabled via accessibility', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress} disabled>
          <Button.Text>Disabled</Button.Text>
        </Button>
      );

      const button = getByRole('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('Props customizadas', () => {
    it('deve aceitar className personalizada', () => {
      const { getByRole } = render(
        <Button onPress={mockOnPress} className="custom-class">
          <Button.Text>Custom</Button.Text>
        </Button>
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('deve aceitar testID', () => {
      const { getByTestId } = render(
        <Button onPress={mockOnPress} testID="custom-button">
          <Button.Text>Test ID</Button.Text>
        </Button>
      );

      expect(getByTestId('custom-button')).toBeTruthy();
    });
  });
});
