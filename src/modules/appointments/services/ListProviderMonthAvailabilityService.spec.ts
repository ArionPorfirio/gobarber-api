import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailability from '@modules/appointments/services/ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailability;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailability(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const serviceHours = Array.from({ length: 10 }, (_, index) => index + 8);

    await Promise.all(
      serviceHours.map(hour => {
        return fakeAppointmentsRepository.create({
          provider_id: 'provider1',
          user_id: 'user1',
          date: new Date(2021, 1, 3, hour, 0, 0),
        });
      }),
    );

    await Promise.all(
      serviceHours.map(hour => {
        return fakeAppointmentsRepository.create({
          provider_id: 'provider1',
          user_id: 'user1',
          date: new Date(2021, 1, 4, hour, 0, 0),
        });
      }),
    );

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2021, 0, 31).getTime());

    const availableDays = await listProviderMonthAvailability.execute({
      provider_id: 'provider1',
      month: 2,
      year: 2021,
    });

    expect(availableDays).toEqual(
      expect.arrayContaining([
        { day: 1, available: true },
        { day: 2, available: true },
        { day: 3, available: false },
        { day: 4, available: false },
        { day: 5, available: true },
      ]),
    );
  });
});
