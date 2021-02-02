import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
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

    await createAppointment.execute({
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
    ).rejects.toBeInstanceOf(AppError);
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
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 1, 1, 9).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider1',
        user_id: 'user1',
        date: new Date(2021, 1, 4, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        provider_id: 'provider1',
        user_id: 'user1',
        date: new Date(2021, 1, 5, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
