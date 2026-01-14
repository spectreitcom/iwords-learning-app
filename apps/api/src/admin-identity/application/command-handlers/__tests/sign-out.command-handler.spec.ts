import { SignOutCommandHandler } from '../sign-out.command-handler';
import { FakeRefreshTokenStorage } from './fakes/fake-refresh-token.storage';
import { SignOutCommand } from '../../commands/sign-out.command';

describe('SignOutCommandHandler', () => {
  let refreshTokenStorage: FakeRefreshTokenStorage;
  let handler: SignOutCommandHandler;

  beforeEach(() => {
    refreshTokenStorage = new FakeRefreshTokenStorage();
    handler = new SignOutCommandHandler(refreshTokenStorage);
  });

  it('should invalidate refresh token on sign out', async () => {
    const userId = 'user-id';
    const tokenId = 'token-id';
    await refreshTokenStorage.insert(userId, tokenId);

    const command = new SignOutCommand(userId);
    await handler.execute(command);

    expect(await refreshTokenStorage.validate(userId, tokenId)).toBe(false);
  });
});
