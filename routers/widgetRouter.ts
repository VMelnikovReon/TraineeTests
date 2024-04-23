// hooksRouter.ts
import { Router } from "express";
import { ROUTES } from "../infrastructure/consts";
import { Request, Response } from "express";
import { CreateContactBody } from "../infrastructure/types/AmoApi/WebHooks/CreateContaktReq";
import { HttpStatusCode } from "axios";
import { WidgetInstallReq } from "../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { saveToken } from "../infrastructure/helpers/SaveToken";

const logger = require("../infrastructure/logger");
const router = Router();
const widgetService = require("../services/widgetService/widgetService");

router.get(
	ROUTES.WIDGET.INSTALL,
	async (req : Request<{}, {}, {}, WidgetInstallReq>, res: Response) => {
		saveToken(req.query);
	}
);

router.get(
	ROUTES.WIDGET.DELETE,
	async (req: Request<{}, {}, CreateContactBody>, res: Response) => {
		console.log(req.query);
	}
);

module.exports = router;
