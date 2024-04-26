import { AxiosError } from "axios";
import { deleteToken, saveToken } from "../../infrastructure/helpers/tokenAcitions";
import { WidgetInstallReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { WidgetServiceInterface } from "./WidgetServiceInterface";
import { TokenPayload } from "../../infrastructure/types/AmoApi/TokenPayload";
import jwt from 'jsonwebtoken';
import api from "../../api/api";
import logger from "../../infrastructure/logger";
import { WidgetDeleteReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetDeleteReq";

class hooksService implements WidgetServiceInterface {
	
	private readonly api = api;
	private readonly logger = logger;

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
		
		saveToken({userId: tokenPayload.account_id, acces_token: token.access_token, refresh_token: token.refresh_token});
		this.logger.debug(`токен ${installInfo.client_id} сохранен`);
	}

	public async deleteWidget(deleteInfo: WidgetDeleteReq): Promise<void>{
		deleteToken(deleteInfo.account_id);
	}
}

export default new hooksService();
