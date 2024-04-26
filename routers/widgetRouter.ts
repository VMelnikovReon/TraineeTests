// hooksRouter.ts
import { Router } from "express";
import { ROUTES } from "../infrastructure/consts";
import { Request, Response } from "express";
import { CreateContactBody } from "../infrastructure/types/AmoApi/WebHooks/CreateContaktReq";
import { HttpStatusCode } from "axios";
import { WidgetInstallReq } from "../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { saveToken } from "../infrastructure/helpers/tokenAcitions";
import logger from "../infrastructure/logger";
import widgetService from "../services/widgetService/widgetService";
import { WidgetDeleteReq } from "../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetDeleteReq";

const router = Router();

router.get(
	ROUTES.WIDGET.INSTALL,
	async (req : Request<{}, {}, {}, WidgetInstallReq>, res: Response) => {
		widgetService.installWidget(req.query);
		res.status(200).send();
	}
);

router.get(
	ROUTES.WIDGET.DELETE,
	async (req: Request<{}, {}, {}, WidgetDeleteReq>, res: Response) => {
		widgetService.deleteWidget(req.query);
		res.status(200).send();
	}
);

export default router;
