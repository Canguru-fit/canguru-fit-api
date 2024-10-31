import { Router } from 'express';
import * as usersController from './usersController';

const router = Router();

router.use('/users-api', router);
router.post('/:source/signup', usersController.signUp);
router.post('/:source/login', usersController.login);
router.get('/:source/validate', usersController.validateToken);
router.post('/:source/refreshToken', usersController.refreshToken);

export default router;
