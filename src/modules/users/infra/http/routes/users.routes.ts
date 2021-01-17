import { Router } from 'express';

import multer from 'multer';
import { container } from 'tsyringe';

import uploadConfig from '@config/upload';

import ensureUserAuthentication from '@modules/users/infra/http/middlewares/ensureUserAuthentication';
import User from '@modules/users/infra/typeorm/entities/Users';
import CreateUsersService from '@modules/users/services/CreateUsersService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUserService = container.resolve(CreateUsersService);

  const user: Partial<User> = await createUserService.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.status(201).json(user);
});

usersRouter.patch(
  '/avatar',
  ensureUserAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    const user: Partial<User> = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
