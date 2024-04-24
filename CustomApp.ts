import { Express } from "express";
import { errorHandlerMiddleware } from "./infrastructure/errors/errorHandlerMiddleware";
import express from 'express';
import config from "./config";
import logger from "./infrastructure/logger";
import mongoose, { ConnectOptions } from "mongoose";
import { router } from "./routers/mainRouter";

export class CustomApplication {
	private app: Express;

	constructor() {
		this.app = express();
	}

	public addRouters(path: string): CustomApplication {
		this.app.use(path, router)
		return this;
	}

	public connectDB(connectionString:string, options: ConnectOptions){
		mongoose.connect(connectionString, options)
			.then(logger.debug('подключение к бд прошло успешно'))
			.catch((err)=>logger.debug(err))
		
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
