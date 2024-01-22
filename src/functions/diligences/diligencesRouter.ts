import { Router } from 'express';
import * as diligencesController from './diligencesController';
import * as entitiesController from '../entities/entitiesController';
import 'express-async-errors';

const router = Router();

router.use('/diligences', router);

router.post('/entities', entitiesController.create);
router.get('/entities/:id', entitiesController.readOne);
router.get('/entities/', entitiesController.read);
router.put('/entities/:id', entitiesController.update);
router.delete('/entities/:id', entitiesController.remove);

router.post('/documents/collect', diligencesController.collect);
router.post('/documents/collect/exato', diligencesController.collectExato);
router.post('/documents/status', diligencesController.status);
router.post('/documents', diligencesController.document);

router.get('/:id', diligencesController.readOne);
router.get('/', diligencesController.read);
router.post('', diligencesController.create);
router.put('/:id', diligencesController.update);
router.delete('/:id', diligencesController.remove);

export default router;
