import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailability from '@modules/appointments/services/ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailability;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailability(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    const bookedHours = [9, 11, 13, 14, 16];

    await Promise.all(
      bookedHours.map(hour => {
        return fakeAppointmentsRepository.create({
          provider_id: 'provider1',
          user_id: 'user1',
          date: new Date(2021, 1, 1, hour, 0, 0),
        });
      }),
    );

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2021, 0, 31).getTime());

    const availableHours = await listProviderDayAvailability.execute({
      provider_id: 'provider1',
      day: 1,
      month: 2,
      year: 2021,
    });

    expect(availableHours).toEqual(
      expect.arrayContaining([
        { hour: 8, available: true },
        { hour: 9, available: false },
        { hour: 10, available: true },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 13, available: false },
        { hour: 14, available: false },
        { hour: 15, available: true },
        { hour: 16, available: false },
        { hour: 17, available: true },
      ]),
    );
  });
});
