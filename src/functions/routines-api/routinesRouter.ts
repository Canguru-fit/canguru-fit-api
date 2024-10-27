import { Router } from 'express';
import * as routinesController from './routinesController';

const router = Router();

router.use('/routines-api', router);
router.get('/', routinesController.read);
router.get('/:id', routinesController.readOne);
router.post('', routinesController.create);
router.put('/:id', routinesController.update);
router.delete('/:id', routinesController.remove);

export default router;
