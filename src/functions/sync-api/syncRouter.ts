import { Router } from 'express';
import * as syncController from './syncController';
import 'express-async-errors';

const router = Router();

router.use('/sync', router);
router.post('/booking', syncController.syncBooking);
router.post('/property', syncController.syncProperty);
router.post('/properties', syncController.syncProperties);


export default router;
