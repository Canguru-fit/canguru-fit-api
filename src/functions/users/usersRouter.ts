import { Router } from 'express';
import * as usersController from './usersController';

const router = Router();

router.use('/users', router);
router.get('/', usersController.read);
router.get('/:id', usersController.readOne);
router.post('', usersController.create);
router.post('/:id/resend-temp-password', usersController.resendTempPassword);
router.put('/:id', usersController.update);
router.put('/:id/status', usersController.toggleStatus);
router.delete('/:id', usersController.remove);

export default router;
