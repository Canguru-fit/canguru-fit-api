import { Router } from 'express';
import * as personalsController from './personalsController';

const router = Router();

router.use('/personals-api', router);
router.get('/', personalsController.read);
router.get('/:id', personalsController.readOne);
router.post('', personalsController.create);
router.put('/:id', personalsController.update);
router.delete('/:id', personalsController.remove);

export default router;
