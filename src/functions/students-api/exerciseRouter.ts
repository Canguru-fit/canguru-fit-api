import { Router } from 'express';
import * as exerciseController from './exerciseController';

const router = Router();

router.use('/exercises-api', router);
router.get('/', exerciseController.read);
router.get('/:id', exerciseController.readOne);
router.post('', exerciseController.create);
router.put('/:id', exerciseController.update);
router.delete('/:id', exerciseController.remove);

export default router;
