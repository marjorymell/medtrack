import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useNotificationPermissions } from '@/hooks/use-notification-permissions';
import * as Notifications from 'expo-notifications';

// Mock do Expo Notifications
jest.mock('expo-notifications');

describe('useNotificationPermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });



  describe('Status de permissão', () => {  describe('Status de permissão', () => {

    it('deve retornar granted quando permissão está concedida', async () => {    it('deve retornar granted quando permissão está concedida', async () => {

      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({

        granted: true,        granted: true,

        canAskAgain: true,        canAskAgain: true,

        status: 'granted',        status: 'granted',

      });      });



      const { result } = renderHook(() => useNotificationPermissions());      const { result } = renderHook(() => useNotificationPermissions());



      await waitFor(() => {      await waitFor(() => {

        expect(result.current.isLoading).toBe(false);        expect(result.current.permissionStatus).toBe('granted');

      });      });

    });

      expect(result.current.permissionStatus.granted).toBe(true);

      expect(result.current.permissionStatus.status).toBe('granted');    it('deve retornar denied quando permissão está negada', async () => {

      expect(result.current.permissionStatus.canAskAgain).toBe(true);      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({

    });        granted: false,

        canAskAgain: false,

    it('deve retornar denied quando permissão está negada', async () => {        status: 'denied',

      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({      });

        granted: false,

        canAskAgain: false,      const { result } = renderHook(() => useNotificationPermissions());

        status: 'denied',

      });      await waitFor(() => {

        expect(result.current.permissionStatus).toBe('denied');

      const { result } = renderHook(() => useNotificationPermissions());      });

    });

      await waitFor(() => {

        expect(result.current.isLoading).toBe(false);    it('deve retornar undetermined quando permissão não foi solicitada', async () => {

      });      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({

        granted: false,

      expect(result.current.permissionStatus.granted).toBe(false);        canAskAgain: true,

      expect(result.current.permissionStatus.status).toBe('denied');        status: 'undetermined',

      expect(result.current.permissionStatus.canAskAgain).toBe(false);      });

    });

      const { result } = renderHook(() => useNotificationPermissions());

    it('deve retornar undetermined quando permissão não foi solicitada', async () => {

      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({      await waitFor(() => {

        granted: false,        expect(result.current.permissionStatus).toBe('undetermined');

        canAskAgain: true,      });

        status: 'undetermined',    });

      });  });



      const { result } = renderHook(() => useNotificationPermissions());  describe('Solicitar permissão', () => {

    it('deve solicitar e conceder permissão com sucesso', async () => {

      await waitFor(() => {      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({

        expect(result.current.isLoading).toBe(false);        granted: true,

      });        canAskAgain: true,

        status: 'granted',

      expect(result.current.permissionStatus.granted).toBe(false);      });

      expect(result.current.permissionStatus.status).toBe('undetermined');

      expect(result.current.permissionStatus.canAskAgain).toBe(true);      const { result } = renderHook(() => useNotificationPermissions());

    });

  });      const granted = await result.current.requestPermission();



  describe('Solicitar permissão', () => {      expect(granted).toBe(true);

    it('deve solicitar e conceder permissão com sucesso', async () => {      expect(Notifications.requestPermissionsAsync).toHaveBeenCalledTimes(1);

      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({    });

        granted: false,

        status: 'undetermined',    it('deve tratar negação de permissão', async () => {

      });      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({

        granted: false,

      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({        canAskAgain: false,

        granted: true,        status: 'denied',

        canAskAgain: true,      });

        status: 'granted',

      });      const { result } = renderHook(() => useNotificationPermissions());



      const { result } = renderHook(() => useNotificationPermissions());      const granted = await result.current.requestPermission();



      await waitFor(() => {      expect(granted).toBe(false);

        expect(result.current.isLoading).toBe(false);    });

      });

    it('deve tratar erro ao solicitar permissão', async () => {

      let permissionResult;      (Notifications.requestPermissionsAsync as jest.Mock).mockRejectedValue(

      await act(async () => {        new Error('Permission error')

        permissionResult = await result.current.requestPermissions();      );

      });

      const { result } = renderHook(() => useNotificationPermissions());

      expect(permissionResult.granted).toBe(true);

      expect(Notifications.requestPermissionsAsync).toHaveBeenCalledTimes(1);      const granted = await result.current.requestPermission();

    });

      expect(granted).toBe(false);

    it('deve tratar negação de permissão', async () => {    });

      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({  });

        granted: false,

        status: 'undetermined',  describe('Verificar permissão', () => {

      });    it('deve verificar se tem permissão', async () => {

      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({

      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({        granted: true,

        granted: false,        status: 'granted',

        canAskAgain: false,      });

        status: 'denied',

      });      const { result } = renderHook(() => useNotificationPermissions());



      const { result } = renderHook(() => useNotificationPermissions());      const hasPermission = await result.current.checkPermission();



      await waitFor(() => {      expect(hasPermission).toBe(true);

        expect(result.current.isLoading).toBe(false);      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();

      });    });



      let permissionResult;    it('deve retornar false quando não tem permissão', async () => {

      await act(async () => {      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({

        permissionResult = await result.current.requestPermissions();        granted: false,

      });        status: 'denied',

      });

      expect(permissionResult.granted).toBe(false);

      expect(permissionResult.canAskAgain).toBe(false);      const { result } = renderHook(() => useNotificationPermissions());

    });

      const hasPermission = await result.current.checkPermission();

    it('deve tratar erro ao solicitar permissão', async () => {

      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({      expect(hasPermission).toBe(false);

        granted: false,    });

        status: 'undetermined',  });

      });

  describe('Estado de loading', () => {

      (Notifications.requestPermissionsAsync as jest.Mock).mockRejectedValue(    it('deve ter estado de loading durante verificação', async () => {

        new Error('Permission error')      (Notifications.getPermissionsAsync as jest.Mock).mockImplementation(

      );        () => new Promise((resolve) => setTimeout(() => resolve({ granted: true }), 100))

      );

      const { result } = renderHook(() => useNotificationPermissions());

      const { result } = renderHook(() => useNotificationPermissions());

      await waitFor(() => {

        expect(result.current.isLoading).toBe(false);      expect(result.current.isLoading).toBe(true);

      });

      await waitFor(() => {

      let permissionResult;        expect(result.current.isLoading).toBe(false);

      await act(async () => {      });

        permissionResult = await result.current.requestPermissions();    });

      });  });

});

      expect(permissionResult.granted).toBe(false);
    });
  });

  describe('Verificar permissão', () => {
    it('deve verificar se tem permissão', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        canAskAgain: true,
        status: 'granted',
      });

      const { result } = renderHook(() => useNotificationPermissions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.checkPermissions();
      });

      expect(result.current.permissionStatus.granted).toBe(true);
      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
    });

    it('deve retornar false quando não tem permissão', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        canAskAgain: true,
        status: 'denied',
      });

      const { result } = renderHook(() => useNotificationPermissions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.checkPermissions();
      });

      expect(result.current.permissionStatus.granted).toBe(false);
    });

    it('deve tratar erro ao verificar permissão', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockRejectedValue(
        new Error('Check permission error')
      );

      const { result } = renderHook(() => useNotificationPermissions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Mesmo com erro, o hook não deve quebrar
      expect(result.current.permissionStatus).toBeDefined();
    });
  });

  describe('Estados de loading', () => {
    it('deve iniciar com isLoading true', () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  granted: false,
                  status: 'undetermined',
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useNotificationPermissions());

      expect(result.current.isLoading).toBe(true);
    });

    it('deve definir isLoading como false após verificar permissões', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        status: 'granted',
      });

      const { result } = renderHook(() => useNotificationPermissions());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
