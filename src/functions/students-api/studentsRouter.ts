import { Router } from 'express';
import authMiddleware from '@libs/authMiddleware';
import * as studentsController from './studentsController';

const router = Router();

router.use('/students-api', router);
router.get('/', authMiddleware, studentsController.read);
router.get('/:id', authMiddleware, studentsController.readOne);
router.post('', authMiddleware, studentsController.create);
router.put('/:id', authMiddleware, studentsController.update);
router.delete('/:id', authMiddleware, studentsController.remove);

export default router;
