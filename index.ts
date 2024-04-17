import { Request, Response, Express } from "express";
import { CreateContactBody } from "./infrastructure/types/AmoApi/WebHooks/CreateContaktReq";

/**
 * Основной модуль приложения - точка входа.
 */
const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");
const hooksService = require("./services/hookService/hooksService");

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken().then(() => {
	app.get("/ping", (req: Request, res: Response) =>
		res.send("pong " + Date.now())
	);

	app.post(
		"/hook",
		(req: Request<{}, {}, CreateContactBody>, res: Response) => {
			const age = hooksService.calculateAge(req.body.contacts.add[0]);
			console.log('awsdawsd');
			logger.debug(`возраст добавленного контакта ${age}`);
			res.send("OK");
		}
	);

	app.listen(config.PORT, () =>
		logger.debug("Server started on ", config.PORT)
	);
});
