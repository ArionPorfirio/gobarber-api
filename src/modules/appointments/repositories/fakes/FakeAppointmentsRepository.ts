import { isEqual } from 'date-fns';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { provider_id, date });

    this.appointments.push(appointment);

    return new Promise((resolve, _) => resolve(appointment));
  }

  findByDate(date: Date): Promise<Appointment | undefined> {
    const appointmentInDate = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return new Promise((resolve, _) => resolve(appointmentInDate));
  }
}

export default FakeAppointmentsRepository;
