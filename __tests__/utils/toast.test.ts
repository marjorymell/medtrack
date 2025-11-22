import { showToast } from '@/utils/toast';
import { Alert } from 'react-native';

// Mock do Alert
jest.spyOn(Alert, 'alert');

describe('Toast Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showToast', () => {
    it('deve exibir toast de sucesso', () => {
      showToast('Operação realizada com sucesso', 'success');

      expect(Alert.alert).toHaveBeenCalledWith(
        'Sucesso',
        'Operação realizada com sucesso',
        expect.any(Array)
      );
    });

    it('deve exibir toast de erro', () => {
      showToast('Erro ao realizar operação', 'error');

      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        'Erro ao realizar operação',
        expect.any(Array)
      );
    });

    it('deve exibir toast de aviso', () => {
      showToast('Atenção necessária', 'warning');

      expect(Alert.alert).toHaveBeenCalledWith(
        'Aviso',
        'Atenção necessária',
        expect.any(Array)
      );
    });

    it('deve exibir toast de informação', () => {
      showToast('Informação importante', 'info');

      expect(Alert.alert).toHaveBeenCalledWith(
        'Informação',
        'Informação importante',
        expect.any(Array)
      );
    });

    it('deve usar tipo default quando não especificado', () => {
      showToast('Mensagem padrão');

      expect(Alert.alert).toHaveBeenCalledWith(
        expect.any(String),
        'Mensagem padrão',
        expect.any(Array)
      );
    });
  });

  describe('Formatação de mensagem', () => {
    it('deve aceitar mensagens curtas', () => {
      showToast('OK', 'success');

      expect(Alert.alert).toHaveBeenCalledWith(
        'Sucesso',
        'OK',
        expect.any(Array)
      );
    });

    it('deve aceitar mensagens longas', () => {
      const longMessage = 'Esta é uma mensagem muito longa que pode conter múltiplas linhas e informações detalhadas sobre o que aconteceu na operação';
      
      showToast(longMessage, 'error');

      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        longMessage,
        expect.any(Array)
      );
    });

    it('deve aceitar mensagens com caracteres especiais', () => {
      showToast('Erro: não foi possível salvar! @#$%', 'error');

      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        'Erro: não foi possível salvar! @#$%',
        expect.any(Array)
      );
    });
  });

  describe('Múltiplas chamadas', () => {
    it('deve permitir múltiplas chamadas consecutivas', () => {
      showToast('Primeira mensagem', 'success');
      showToast('Segunda mensagem', 'error');
      showToast('Terceira mensagem', 'info');

      expect(Alert.alert).toHaveBeenCalledTimes(3);
    });
  });
});
