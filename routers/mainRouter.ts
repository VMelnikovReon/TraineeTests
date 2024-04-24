import  { Router } from "express";
import { ROUTES } from "../infrastructure/consts";
import hooksRouter from './hooksRouter';

const router = Router();

router.use(ROUTES.HOOKS.HOME_ROUTE, hooksRouter);

export default router;
