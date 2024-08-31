import { Router } from "express";
import { metadata } from "../controllers/metadata.controller";

const router = Router();

router.get('/', metadata);

export default router;
