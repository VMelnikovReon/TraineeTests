import { Express, Request } from "express";
import { errorHandlerMiddleware } from "./infrastructure/errors/errorHandlerMiddleware";

const express = require("express");
const mainRouter = require("./routers/mainRouter");
const config = require("./config");
const logger = require("./infrastructure/logger");

export class CustomApplication {
	private app: Express;

	constructor() {
		this.app = express();
	}

	public addRouters(path: string): CustomApplication {
		this.app.use(path, mainRouter);
		this.app.get('/widget/install', (req : Request,res)=>{
			console.log(req.body);
		});
		return this;
	}

	public addErrorHandlers(): CustomApplication {
		this.app.use(errorHandlerMiddleware);
		return this;
	}

	public addServices(): CustomApplication {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		return this;
	}

	public run(): void {
		this.app.listen(config.PORT, () =>
			logger.debug("Server started on ", config.PORT)
		);
	}
}
