import { WidgetInstallReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { WidgetServiceInterface } from "./WidgetServiceInterface";

class hooksService implements WidgetServiceInterface {
	
	private readonly api = require('../../api/api');

	public async installWidget(installInfo: WidgetInstallReq): Promise<void>{
		console.log(installInfo);

	}
	public async deleteWidget(req: any): Promise<void>{

	}

	
}

module.exports = new hooksService();
