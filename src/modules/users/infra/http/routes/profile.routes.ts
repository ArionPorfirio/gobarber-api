import { Router } from 'express';

import { Joi, Segments, celebrate } from 'celebrate';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';
import ensureUserAuthentication from '@modules/users/infra/http/middlewares/ensureUserAuthentication';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureUserAuthentication);

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    }),
  }),
  profileController.update,
);

export default profileRouter;
