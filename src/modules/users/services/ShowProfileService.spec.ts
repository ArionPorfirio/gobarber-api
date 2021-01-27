import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const userProfile = await showProfile.execute({ user_id: user.id });

    expect(userProfile).toHaveProperty('name', 'John Doe');
    expect(userProfile).toHaveProperty('email', 'johndoe@example.com');
  });

  it('should NOT be able to show profile with a nonexistent user id', async () => {
    await expect(
      showProfile.execute({ user_id: 'nonexistent-user-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
