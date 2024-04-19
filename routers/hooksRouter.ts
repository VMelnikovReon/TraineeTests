// hooksRouter.ts
import { Router } from "express";
import { ROUTES } from "../infrastructure/consts";
import { Request, Response } from "express";
import { CreateContactBody } from "../infrastructure/types/AmoApi/WebHooks/CreateContaktReq";
import { HttpStatusCode } from "axios";

const logger = require("../infrastructure/logger");
const router = Router();
const hooksService = require("../services/hookService/hooksService");

router.post(
	ROUTES.HOOKS.ADD_CONTACR_ROUTE,
	async (req: Request<{}, {}, CreateContactBody>, res: Response) => {
		const status = await hooksService.addContact(req.body.contacts.add[0]);
		res.status(HttpStatusCode.Ok);
	}
);

module.exports = router;
