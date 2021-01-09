import { Router } from 'express';
import User from '../models/Users';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const authenticateUserService = new AuthenticateUserService();

    const {
      user,
      token,
    }: {
      user: Partial<User>;
      token: string;
    } = await authenticateUserService.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  } catch (err) {
    return response
      .status(400)
      .json({ error: err.message || 'Invalid request' });
  }
});

export default sessionsRouter;
