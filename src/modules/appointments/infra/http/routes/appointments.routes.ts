import { Router } from 'express';

import { celebrate, Joi, Segments } from 'celebrate';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';
import ensureUserAuthentication from '@modules/users/infra/http/middlewares/ensureUserAuthentication';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureUserAuthentication);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    }),
  }),
  appointmentsController.create,
);
appointmentsRouter.get('/schedule', providerAppointmentsController.index);

export default appointmentsRouter;
