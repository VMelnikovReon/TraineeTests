import { Request, Response, Express } from "express";

/**
 * Основной модуль приложения - точка входа. 
 */
const express = require("express");
const api = require("./api");
const logger = require("./logger");
const config = require("./config");
const hooksService = require("./services/hooksService");

const app : Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken().then(() => {
	app.get("/ping", (req : Request, res : Response) => res.send("pong " + Date.now()));

	app.post("/hook", (req : Request, res : Response) => {
		const age = hooksService.calculateAge(req.body.contacts.add[0]);
		console.log(age);
		res.send("OK");
	});

	app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
});
