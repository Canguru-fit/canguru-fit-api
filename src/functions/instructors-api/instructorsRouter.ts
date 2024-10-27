import { Router } from 'express';
import * as instructorsController from './instructorsController';

const router = Router();

router.use('/instructors', router);
router.post('/login', instructorsController.login);
router.post('/verify/token', instructorsController.verifyToken);
router.post('/forgot', instructorsController.forgot);
router.post('/update-password', instructorsController.updatePassword);
router.get('/', instructorsController.read);
router.get('/:id', instructorsController.readOne);
router.post('', instructorsController.create);
router.post('/:id/resend-temp-password', instructorsController.resendTempPassword);
router.put('/:id', instructorsController.update);
router.put('/:id/status', instructorsController.toggleStatus);
router.delete('/:id', instructorsController.remove);

export default router;
