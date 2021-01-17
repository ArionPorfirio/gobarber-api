import { Router } from 'express';

import { parseISO } from 'date-fns';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureUserAuthentication from '@modules/users/infra/http/middlewares/ensureUserAuthentication';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureUserAuthentication);

// appointmentsRouter.get('/', async (request, response) => {
//   const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);

  const appointmentsRepository = new AppointmentsRepository();
  const createAppointmentService = new CreateAppointmentService(
    appointmentsRepository,
  );

  const appointment = await createAppointmentService.execute({
    provider_id,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
