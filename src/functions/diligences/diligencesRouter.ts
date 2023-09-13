import { Router } from 'express';
import * as diligencesController from './diligencesController';
import * as legalPersonsController from '../legalPersons/ legalPersonsController';
import * as naturalPersonsController from '../naturalPersons/naturalPersonsController';
import 'express-async-errors';

const router = Router();

router.use('/diligences', router);
router.get('/', diligencesController.read);
router.get('/:id', diligencesController.readOne);
router.post('', diligencesController.create);
router.put('/:id', diligencesController.update);
router.delete('/:id', diligencesController.remove);

// legal-person
router.post('/legal-persons', legalPersonsController.create);
router.get('/legal-persons/:id', legalPersonsController.read);
router.put('/legal-persons/:id', legalPersonsController.update);
router.delete('/legal-persons/:id', legalPersonsController.remove);

// natural-person
router.post('/natural-persons', naturalPersonsController.create);
router.get('/natural-persons/:id', naturalPersonsController.read);
router.put('/natural-persons/:id', naturalPersonsController.update);
router.delete('/natural-persons/:id', naturalPersonsController.remove);

router.post('/documents/collect', diligencesController.collect);
router.post('/documents/status', diligencesController.status);
router.post('/documents', diligencesController.document);

export default router;
