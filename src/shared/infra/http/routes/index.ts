import { Router } from 'express';

import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';

const router = Router();

router.use('/appointments', appointmentsRouter);
router.use('/sessions', sessionsRouter);
router.use('/users', usersRouter);
router.use('/password', passwordRouter);
router.use('/profile', profileRouter);

export default router;
