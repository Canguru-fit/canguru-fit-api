import { Router } from 'express';
import * as diligencesController from './diligencesController';
import 'express-async-errors';

const router = Router();

router.use('/diligences', router);
router.get('/', diligencesController.read);
router.get('/:id', diligencesController.readOne);
router.post('', diligencesController.create);
router.put('/:id', diligencesController.update);
router.delete('/:id', diligencesController.remove);


export default router;
