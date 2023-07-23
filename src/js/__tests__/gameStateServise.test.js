import GameStateService from '../GameStateService';
// сброс всех моков
beforeEach(() => {
  jest.resetAllMocks();
});

test('data loading', () => {
  const stateService = new GameStateService();
  stateService.storage = jest.fn().mockReturnValue('Hello');
  expect(() => stateService.load()).toThrow('Invalid state');
});
