import { Router } from 'express';
import * as exerciseRepoController from './exerciseRepoController';

const router = Router();

router.use('/exercises-repo-api', router);
router.get('/', exerciseRepoController.read);
router.get('/:id', exerciseRepoController.readOne);
router.post('', exerciseRepoController.create);
router.put('/:id', exerciseRepoController.update);
router.delete('/:id', exerciseRepoController.remove);

export default router;
