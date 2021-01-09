import { Router } from 'express';
import User from '../models/Users';
import CreateUsersService from '../services/CreateUsersService';

const usersRouter = Router();

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

export default usersRouter;
