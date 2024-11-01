import { Router } from 'express';
import * as studentsController from './studentsController';

const router = Router();

router.use('/exercises-api', router);
router.get('/', studentsController.read);
router.get('/:id', studentsController.readOne);
router.post('', studentsController.create);
router.put('/:id', studentsController.update);
router.delete('/:id', studentsController.remove);

export default router;
