
import { Router } from "express";
import { ROUTES } from "../infrastructure/consts";
import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import hooksService from "../services/hookService/hooksService";
import { UpdateDealReq } from "../infrastructure/types/AmoApi/WebHooks/UpdateDeal/UpdateDealReq";
import { UpdateTaskReq } from "../infrastructure/types/AmoApi/WebHooks/UpdateTask/UpdateTaskReq";


const router = Router();

router.post(
	ROUTES.HOOKS.UPDATE_DEAL_ROUTE,
	async (req: Request<{}, {}, UpdateDealReq>, res: Response) => {
		hooksService.updateDeal(req.body);
		res.status(HttpStatusCode.Ok);
	}
);

router.post(
	ROUTES.HOOKS.UPDATE_TASK_ROUTE,
	async (req: Request<{}, {}, UpdateTaskReq>, res: Response) => {
		hooksService.updateTask(req.body);
		res.status(HttpStatusCode.Ok);
	}
);

export default router;
