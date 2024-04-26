import { AxiosError } from "axios";
import { saveToken } from "../../infrastructure/helpers/tokenAcitions";
import { WidgetInstallReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { WidgetServiceInterface } from "./WidgetServiceInterface";
import { TokenPayload } from "../../infrastructure/types/AmoApi/TokenPayload";
import jwt from 'jsonwebtoken';

class hooksService implements WidgetServiceInterface {
	
	private readonly api = require('../../api/api');
	private readonly logger = require('../../infrastructure/logger');

	public async installWidget(installInfo: WidgetInstallReq): Promise<void>{
		const token = await this.api.requestAccessToken(
			installInfo.client_id,
			installInfo.code
		);

		if (token instanceof AxiosError) {
			throw new Error("ошибка при получении токена");
		}

		const tokenPayload: TokenPayload | null = jwt.decode(token.access_token) as TokenPayload | null;

		if (!tokenPayload){
			throw new Error('не удалось декодировать токен');
		}
		
		saveToken(installInfo);
		this.logger.debug(`токен ${installInfo.client_id} сохранен`);
	}
}

export default new hooksService();
