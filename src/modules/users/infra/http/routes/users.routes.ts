import { Router } from 'express';

import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';

import uploadConfig from '@config/upload';

import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import ensureUserAuthentication from '@modules/users/infra/http/middlewares/ensureUserAuthentication';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig.multer);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  ensureUserAuthentication,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
