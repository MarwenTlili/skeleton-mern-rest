import { Router } from "express";
import userController from "../controllers/user.controller";
import { authorizedRoles } from "../middlewares/authorizedRoles.middleware";

const router = Router();

router.use(authorizedRoles('ADMIN'));
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
