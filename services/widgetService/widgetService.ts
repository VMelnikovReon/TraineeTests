import { WidgetInstallReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { TokenRepositoryInterface } from "../../repositories/TokenRepository/TokenRepositoryInterface";
import { WidgetServiceInterface } from "./WidgetServiceInterface";
import logger from "../../infrastructure/logger";
import TokenRepository from "../../repositories/TokenRepository/TokenRepository";
import { Token, UpdateTokenDTO } from "../../models/TokenSchema";
import api from "../../api/api";
import { AxiosError } from "axios";

class hooksService implements WidgetServiceInterface {
	private readonly api = api;
	private readonly logger = logger;
	private readonly tokenRepository;

	constructor(tokenRepository: TokenRepositoryInterface) {
		this.tokenRepository = tokenRepository;
	}

	private async refreshToken(
		clientId: string,
		refreshToken: string
	): Promise<void> {
		const tokens = await this.api.refreshToken(clientId, refreshToken);

		if (tokens instanceof AxiosError) {
			throw new Error("не возможно обновить токен");
		}

		await this.tokenRepository.updateToken(clientId, {
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
		});

		logger.debug("токены обновлены");
	}

	public async installWidget(installInfo: WidgetInstallReq): Promise<void> {
		const bdToken = await this.tokenRepository.checkToken(
			installInfo.client_id
		);

		if (bdToken) {
			await this.refreshToken(installInfo.client_id, bdToken);
		}

		const token = await api.requestAccessToken(
			installInfo.client_id,
			installInfo.code
		);

		if (token instanceof AxiosError) {
			throw new Error("ошибка при получении токена");
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
	public async deleteWidget(deleteInfo: WidgetInstallReq): Promise<void> {
		const newTokenData: UpdateTokenDTO = {
			access_token: "NULL",
			refresh_token: "NULL",
			installed: false,
		};
		await this.tokenRepository.deleteToken(deleteInfo.client_id, newTokenData);
	}
}

export default new hooksService(TokenRepository);
