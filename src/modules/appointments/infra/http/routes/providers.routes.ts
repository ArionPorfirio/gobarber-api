import { Router } from 'express';

import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ensureUserAuthentication from '@modules/users/infra/http/middlewares/ensureUserAuthentication';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureUserAuthentication);

providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilityController.index,
);
providersRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailabilityController.index,
);

export default providersRouter;
