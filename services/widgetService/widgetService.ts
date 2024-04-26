import { WidgetInstallReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { TokenRepositoryInterface } from "../../repositories/TokenRepository/TokenRepositoryInterface";
import { WidgetServiceInterface } from "./WidgetServiceInterface";
import logger from "../../infrastructure/logger";
import TokenRepository from "../../repositories/TokenRepository/TokenRepository";
import { Token, UpdateTokenDTO } from "../../models/TokenSchema";
import api from "../../api/api";
import { AxiosError } from "axios";
import { WidgetDeleteReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetDeleteReq";

class hooksService implements WidgetServiceInterface {
	private readonly api = api;
	private readonly logger = logger;
	private readonly tokenRepository;

	constructor(tokenRepository: TokenRepositoryInterface) {
		this.tokenRepository = tokenRepository;
	}


	public async installWidget(installInfo: WidgetInstallReq): Promise<void> {
		
		const token = await api.requestAccessToken(
			installInfo.client_id,
			installInfo.code
		);

		if (token instanceof AxiosError) {
			throw new Error("ошибка при получении токена");
		}

		if (await this.tokenRepository.checkToken(installInfo.client_id)) {
			await this.tokenRepository.updateToken(installInfo.client_id, {
				access_token : token.access_token,
				refresh_token : token.refresh_token
			});
			return;
		}

		const tokenEntity: Token = {
			user_id: installInfo.client_id,
			subdomain: installInfo.referer,
			access_token: token.access_token,
			refresh_token: token.refresh_token,
			installed: true,
		};

		await this.tokenRepository.createTokenEntity(tokenEntity);
	}
	public async deleteWidget(deleteInfo: WidgetDeleteReq): Promise<void> {
		const newTokenData: UpdateTokenDTO = {
			access_token: "NULL",
			refresh_token: "NULL",
			installed: false,
		};
		await this.tokenRepository.deleteToken(deleteInfo.client_uuid, newTokenData);
	}
}

export default new hooksService(TokenRepository);
