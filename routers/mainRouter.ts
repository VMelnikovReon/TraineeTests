import express, { Router, Request } from "express";
import { ROUTES } from "../infrastructure/consts";

const widgetRouter = require("./widgetRouter");

const router = Router();

router.use(ROUTES.WIDGET.HOME_ROUTE, widgetRouter);

module.exports = router;
