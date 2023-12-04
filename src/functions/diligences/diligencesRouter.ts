import { Router } from 'express';
import * as diligencesController from './diligencesController';
import * as entitiesController from '../entities/entitiesController';
import 'express-async-errors';

const router = Router();

router.use('/diligences', router);
router.get('/', diligencesController.read);
router.get('/:id', diligencesController.readOne);
router.post('', diligencesController.create);
router.put('/:id', diligencesController.update);
router.delete('/:id', diligencesController.remove);

router.post('/entities', entitiesController.create);
router.get('/', entitiesController.read);
router.get('/:id', entitiesController.readOne);
router.put('/:id', entitiesController.update);
router.delete('/:id', entitiesController.remove);

router.post('/documents/collect', diligencesController.collect);
router.post('/documents/status', diligencesController.status);
router.post('/documents', diligencesController.document);

export default router;
