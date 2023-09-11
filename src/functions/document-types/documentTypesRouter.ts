import { Router } from 'express';
import * as documentTypesController from './documentTypesController';

const router = Router();

router.use('/document-types', router);
router.get('/', documentTypesController.read);
router.get('/:id', documentTypesController.readOne);
router.post('', documentTypesController.create);
router.put('/:id', documentTypesController.update);
router.delete('/:id', documentTypesController.remove);

export default router;
