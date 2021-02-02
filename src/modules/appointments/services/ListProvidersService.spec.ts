import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list all providers except itself', async () => {
    const provider1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const provider2 = await fakeUsersRepository.create({
      name: 'Ryan Doe',
      email: 'ryandoe@gmail.com',
      password: '123123',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Jack Doe',
      email: 'jackdoe@gmail.com',
      password: 'abcdef',
    });

    const providersList = await listProviders.execute({
      except_user_id: loggedUser.id,
    });

    expect(providersList).toEqual([provider1, provider2]);
  });
});
