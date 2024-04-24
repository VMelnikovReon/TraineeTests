import { Router } from "express";
import { ROUTES } from "../infrastructure/consts";
import widgetRouter from './widgetRouter';

export const router = Router();

router.use(ROUTES.WIDGET.HOME_ROUTE, widgetRouter.router);

