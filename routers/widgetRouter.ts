// hooksRouter.ts
import { Router } from "express";
import { ROUTES } from "../infrastructure/consts";
import { Request, Response } from "express";
import { CreateContactBody } from "../infrastructure/types/AmoApi/WebHooks/CreateContaktReq";
import { HttpStatusCode } from "axios";
import { WidgetInstallReq } from "../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { saveToken } from "../infrastructure/helpers/tokenAcitions";

const logger = require("../infrastructure/logger");
const router = Router();
const widgetService = require("../services/widgetService/widgetService");

router.get(
	ROUTES.WIDGET.INSTALL,
	async (req : Request<{}, {}, {}, WidgetInstallReq>, res: Response) => {
		widgetService.installWidget(req.query);
		res.status(200).send();
	}
);

router.get(
	ROUTES.WIDGET.DELETE,
	async (req: Request<{}, {}, {}, {}>, res: Response) => {
		widgetService.deleteWidget(req.query);
		res.status(200).send();
	}
);

module.exports = router;
