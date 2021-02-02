import { getHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      { provider_id, day, month, year },
    );

    const startOfServiceHours = 8;
    const serviceHours = Array.from(
      { length: 10 },
      (_, index) => index + startOfServiceHours,
    );

    const currentDate = new Date(Date.now());

    const availableHours = serviceHours.map(hour => {
      const hourAlreadyBooked = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hourAlreadyBooked && isAfter(compareDate, currentDate),
      };
    });

    return availableHours;
  }
}
