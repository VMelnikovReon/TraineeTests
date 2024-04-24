import { Express, Request } from "express";
import { errorHandlerMiddleware } from "./infrastructure/errors/errorHandlerMiddleware";
import express from 'express';
import config from "./config";
import logger from "./infrastructure/logger";

export class CustomApplication {
	private app: Express;

	constructor() {
		this.app = express();
	}

	public addRouters(path: string): CustomApplication {
		
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
