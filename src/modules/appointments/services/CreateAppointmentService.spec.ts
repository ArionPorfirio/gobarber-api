import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 1, 1, 9).getTime();
    });

    const appointment = await createAppointment.execute({
      provider_id: 'provider1',
      user_id: 'user1',
      date: new Date(2021, 1, 3, 10),
    });

    expect(appointment).toEqual(
      expect.objectContaining({
        provider_id: 'provider1',
        user_id: 'user1',
        date: new Date(2021, 1, 3, 10),
      }),
    );
  });

  it('should NOT be able to create appointments in the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 1, 1, 9).getTime();
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider1',
      user_id: 'user1',
      date: new Date(2021, 1, 3, 13, 0, 0),
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider1',
        user_id: 'user2',
        date: new Date(2021, 1, 3, 13, 0, 0),
      }),
    ).rejects.toEqual({
      message: 'Appointment already booked',
      statusCode: 400,
    });
  });

  it('should NOT be able to create an appointment with same user and provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 1, 1, 9).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider1',
        user_id: 'provider1',
        date: new Date(2021, 1, 2, 11),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to create the appointment in the past', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 1, 1, 9).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider1',
        user_id: 'user1',
        date: new Date(2021, 0, 31, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to create the appointment before 8am or after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2021, 1, 1, 9).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider1',
        user_id: 'user1',
        date: new Date(2021, 1, 4, 7),
      }),
    ).rejects.toEqual({
      message:
        'It was not possible to create an appointment outside the range of 8am and 5pm',
      statusCode: 400,
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider1',
        user_id: 'user1',
        date: new Date(2021, 1, 5, 18),
      }),
    ).rejects.toEqual({
      message:
        'It was not possible to create an appointment outside the range of 8am and 5pm',
      statusCode: 400,
    });
  });
});
