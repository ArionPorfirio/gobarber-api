import { Router } from 'express';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';
import ensureUserAuthentication from '@modules/users/infra/http/middlewares/ensureUserAuthentication';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureUserAuthentication);

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;
