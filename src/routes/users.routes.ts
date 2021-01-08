import { Router } from 'express';
import CreateUsersService from '../services/CreateUsersService';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUserService = new CreateUsersService();

    const createUser = await createUserService.execute({
      name,
      email,
      password,
    });

    return response.status(201).json(createUser);
  } catch (err) {
    return response
      .status(400)
      .json({ error: err.message || 'Invalid request' });
  }
});

export default usersRouter;
