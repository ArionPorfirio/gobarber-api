import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all provider appointments in a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider1',
      user_id: 'user1',
      date: new Date(2021, 1, 3, 8),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider1',
      user_id: 'user2',
      date: new Date(2021, 1, 3, 10),
    });

    const schedule = await listProviderAppointments.execute({
      provider_id: 'provider1',
      day: 3,
      month: 2,
      year: 2021,
    });

    expect(schedule).toEqual(
      expect.arrayContaining([appointment1, appointment2]),
    );
  });
});
