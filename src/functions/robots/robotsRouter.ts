import { Router } from 'express';
import * as robotsController from './robotsController';

const router = Router();

router.use('/robots', router);
router.get('/', robotsController.read);
router.get('/:id', robotsController.readOne);
router.post('', robotsController.create);
router.put('/:id', robotsController.update);
router.delete('/:id', robotsController.remove);

export default router;
