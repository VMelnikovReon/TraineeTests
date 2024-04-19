// hooksRouter.ts
import { Router } from "express";
import { ROUTES } from "../infrastructure/consts";
import { Request, Response } from "express";
import { CreateContactBody } from "../infrastructure/types/AmoApi/WebHooks/CreateContaktReq";

const logger = require("../infrastructure/logger");
const router = Router();
const hooksService = require("../services/hookService/hooksService");

router.post(
	ROUTES.HOOKS.ADD_CONTACR_ROUTE,
	(req: Request<{}, {}, CreateContactBody>, res: Response) => {
		logger.debug(hooksService.addContact(req.body.contacts.add[0]));
		res.send("OK");
	}
);

module.exports = router;
