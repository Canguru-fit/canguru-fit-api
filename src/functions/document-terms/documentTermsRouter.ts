import { Router } from 'express';
import * as documentTermsController from './documentTermsController';

const router = Router();

router.use('/document-terms', router);
router.get('/', documentTermsController.read);
router.get('/:id', documentTermsController.readOne);
router.post('', documentTermsController.create);
router.put('/:id', documentTermsController.update);
router.delete('/:id', documentTermsController.remove);

export default router;
