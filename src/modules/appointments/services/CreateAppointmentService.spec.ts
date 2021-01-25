import { startOfHour } from 'date-fns';
import { v4 as uuid } from 'uuid';

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
    const appointmentData = {
      provider_id: uuid(),
      date: new Date(),
    };

    const appointment = await createAppointment.execute(appointmentData);

    expect(appointment).toMatchObject({
      ...appointmentData,
      date: startOfHour(appointmentData.date),
    });
  });

  it('should NOT be able to create appointments in the same time', async () => {
    const appointmentData = {
      provider_id: uuid(),
      date: new Date(2021, 0, 19, 13),
    };

    await createAppointment.execute(appointmentData);

    await expect(
      createAppointment.execute(appointmentData),
    ).rejects.toBeInstanceOf(AppError);
  });
});
