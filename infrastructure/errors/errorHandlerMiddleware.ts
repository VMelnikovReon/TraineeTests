import { NextFunction, Request, Response } from "express";
import { ServiceError } from "./ServiceError";
import { HttpStatusCode } from "axios";

const logger = require("../logger");

export const errorHandlerMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	logger.debug(err.message);

	if (err instanceof ServiceError) {
		res.status(err.status).send(err.message);
	} else {
		res
			.status(HttpStatusCode.InternalServerError)
			.send("Internal Serveer Error");
	}
};
