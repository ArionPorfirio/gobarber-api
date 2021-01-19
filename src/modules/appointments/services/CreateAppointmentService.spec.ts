import { startOfHour } from 'date-fns';
import { v4 as uuid } from 'uuid';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointmentData = {
      provider_id: uuid(),
      date: new Date(),
    };

    const appointment = await createAppointmentService.execute(appointmentData);

    expect(appointment).toMatchObject({
      ...appointmentData,
      date: startOfHour(appointmentData.date),
    });
  });

  it('should NOT be able to create appointments in the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointmentData = {
      provider_id: uuid(),
      date: new Date(2021, 0, 19, 13),
    };

    await createAppointmentService.execute(appointmentData);

    await expect(
      createAppointmentService.execute(appointmentData),
    ).rejects.toBeInstanceOf(AppError);
  });
});
