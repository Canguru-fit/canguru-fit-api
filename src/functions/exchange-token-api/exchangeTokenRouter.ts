import { Router } from 'express';
import * as exchangeTokenController from './exchangeTokenController';
import 'express-async-errors';

const router = Router();

router.use('/exchange-token', router);
router.post('', exchangeTokenController.exchangeToken);


export default router;
