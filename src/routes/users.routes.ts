import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import ensureUserAuthentication from '../middlewares/ensureUserAuthentication';
import User from '../models/Users';
import CreateUsersService from '../services/CreateUsersService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUserService = new CreateUsersService();

    const user: Partial<User> = await createUserService.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.status(201).json(user);
  } catch (err) {
    return response
      .status(400)
      .json({ error: err.message || 'Invalid request' });
  }
});

usersRouter.patch(
  '/avatar',
  ensureUserAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateUserAvatarService = new UpdateUserAvatarService();

      const user: Partial<User> = await updateUserAvatarService.execute({
        user_id: request.user.id,
        avatarFileName: request.file.filename,
      });

      delete user.password;

      return response.json(user);
    } catch (err) {
      return response
        .status(400)
        .json({ error: err.message || 'Invalid request' });
    }
  },
);

export default usersRouter;
