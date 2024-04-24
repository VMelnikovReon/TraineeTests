import express, { Router, Request } from "express";
import { ROUTES } from "../infrastructure/consts";
import widgetRouter from './widgetRouter';

const router = Router();

router.use(ROUTES.WIDGET.HOME_ROUTE, widgetRouter);

module.exports = router;
