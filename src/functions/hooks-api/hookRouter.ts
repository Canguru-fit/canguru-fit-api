import { Router } from 'express';
import * as hookController from './hookController';
import 'express-async-errors';

const router = Router();

router.use('/hook', router);
router.post('/properties', hookController.propertiesHook);
router.get('/bookings', hookController.bookingsHook);
router.get('/subscribe', hookController.subscribe);


export default router;
