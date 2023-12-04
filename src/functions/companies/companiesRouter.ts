import { Router } from 'express';
import * as companiesController from './companiesController';

const router = Router();

router.use('/companies', router);
router.get('/', companiesController.read);
router.get('/:id', companiesController.readOne);
router.post('', companiesController.create);
router.put('/:id', companiesController.update);
router.delete('/:id', companiesController.remove);

export default router;
