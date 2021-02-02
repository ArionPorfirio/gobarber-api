import { getDate, getDaysInMonth, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailability {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const daysInMonth = Array.from(
      { length: getDaysInMonth(new Date(year, month - 1)) },
      (_, index) => index + 1,
    );

    const currentDate = new Date(Date.now());

    const availability = daysInMonth.map(day => {
      const compareDate = new Date(year, month - 1, day, 17, 0, 0);

      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );

      return {
        day,
        available:
          isAfter(compareDate, currentDate) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailability;
