// hooksRouter.ts
import {Router} from 'express';
import { ROUTES } from "../infrastructure/consts";
import { Request, Response } from "express";
import { WidgetInstallReq } from "../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import widgetService from "../services/widgetService/widgetService";
import { WidgetServiceInterface } from '../services/widgetService/WidgetServiceInterface';

class WidgetRouter{
	public router;
	private readonly widgetService;

	constructor(widgetServise : WidgetServiceInterface){
		this.router = Router();
		this.widgetService = widgetServise;

		this.router.get(
			ROUTES.WIDGET.INSTALL,
			async (req : Request<{}, {}, {}, WidgetInstallReq>, res: Response) => {
				this.widgetService.installWidget(req.query);
				console.log('install');
				res.status(200).send();
			}
		);
		
		this.router.get(
			ROUTES.WIDGET.DELETE,
			async (req: Request<{}, {}, {}, WidgetInstallReq>, res: Response) => {
				this.widgetService.deleteWidget(req.query);
				console.log('delete');
				res.status(200).send();
			}
		);
	}
}



export default new WidgetRouter(widgetService);
