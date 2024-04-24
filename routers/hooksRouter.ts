
import { Router } from "express";
import { ROUTES } from "../infrastructure/consts";
import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import hooksService from "../services/hookService/hooksService";
import { UpdateDealReq } from "../infrastructure/types/AmoApi/WebHooks/UpdateDealReq";


const router = Router();

router.post(
	ROUTES.HOOKS.UPDATE_DEAL_ROUTE,
	async (req: Request<{}, {}, UpdateDealReq>, res: Response) => {
		hooksService.updateDeal(req.body);
		res.status(HttpStatusCode.Ok);
	}
);

export default router;
