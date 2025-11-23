describe('Setup Validation', () => {
  it('should pass basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should be able to mock functions', () => {
    const mockFn = jest.fn();
    mockFn('test');

    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('should have AsyncStorage mock available', () => {
    const AsyncStorage = require('./mocks/async-storage.mock').default;
    expect(AsyncStorage.getItem).toBeDefined();
    expect(AsyncStorage.setItem).toBeDefined();
  });
});
