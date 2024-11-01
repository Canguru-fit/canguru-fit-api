import { Router } from 'express';
import * as usersController from './usersController';

const router = Router();

router.use('/users-api', router);
router.post('/:source/signup', usersController.signUp);
router.post('/:source/confirmSignUp', usersController.confirmSignUp);
router.post('/:source/login', usersController.login);
router.put('/:source/forgotPassword', usersController.forgotPassword);
router.put('/:source/confirmForgotPassword', usersController.confirmForgotPassword);
router.put('/:source/changePassword', usersController.changePassword);
router.put('/:source/resendConfirmation', usersController.resendConfirmation);
router.put('/:source/refreshToken', usersController.refreshToken);
router.get('/:source/validate', usersController.validateToken);

export default router;
