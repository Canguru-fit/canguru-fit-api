import { Router } from 'express';
import * as workoutsController from './workoutsController';

const router = Router();

router.use('/routines-api', router);
router.get('/', workoutsController.read);
router.get('/:id', workoutsController.readOne);
router.post('', workoutsController.create);
router.put('/:id', workoutsController.update);
router.delete('/:id', workoutsController.remove);

export default router;
