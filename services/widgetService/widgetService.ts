import { saveToken } from "../../infrastructure/helpers/tokenAcitions";
import { WidgetInstallReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { WidgetServiceInterface } from "./WidgetServiceInterface";

class hooksService implements WidgetServiceInterface {
	
	private readonly api = require('../../api/api');
	private readonly logger = require('../../infrastructure/logger');

	public async installWidget(installInfo: WidgetInstallReq): Promise<void>{
		saveToken(installInfo);
		this.logger.debug(`токен ${installInfo.client_id} сохранен`);
	}
	public async deleteWidget(req: any): Promise<void>{
		
	}
}

module.exports = new hooksService();
