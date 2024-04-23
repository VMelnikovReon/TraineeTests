import  { Router } from "express";
import { ROUTES } from "../infrastructure/consts";

const hooksRouter = require("./hooksRouter");

const router = Router();

router.use(ROUTES.HOOKS.HOME_ROUTE, hooksRouter);

module.exports = router;
