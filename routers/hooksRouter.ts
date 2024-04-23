
import { Router } from "express";
import { ROUTES } from "../infrastructure/consts";
import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { UpdateDealsRes } from "../infrastructure/types/AmoApi/AmoApiRes/Deals/UpdateDealsRes";

const logger = require("../infrastructure/logger");
const router = Router();
const hooksService = require("../services/hookService/hooksService");

router.post(
	ROUTES.HOOKS.UPDATE_DEAL_ROUTE,
	async (req: Request<{}, {}, UpdateDealsRes>, res: Response) => {
		hooksService.updateDeal(req.body);
		res.status(HttpStatusCode.Ok);
	}
);

module.exports = router;
