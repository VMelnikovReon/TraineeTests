import { WidgetInstallReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { TokenRepositoryInterface } from "../../repositories/TokenRepository/TokenRepositoryInterface";
import { WidgetServiceInterface } from "./WidgetServiceInterface";
import TokenRepository from "../../repositories/TokenRepository/TokenRepository";
import { Token, UpdateTokenDTO } from "../../models/TokenSchema";
import api from "../../api/api";
import jwt from 'jsonwebtoken'
import { AxiosError } from "axios";
import { WidgetDeleteReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetDeleteReq";
import { TokenPayload } from "../../infrastructure/types/AmoApi/TokenPayload";
import { ServiceError } from "../../infrastructure/errors/ServiceError";

class hooksService implements WidgetServiceInterface {
	private readonly api = api;
	private readonly tokenRepository;

	constructor(tokenRepository: TokenRepositoryInterface) {
		this.tokenRepository = tokenRepository;
	}


	public async installWidget(installInfo: WidgetInstallReq): Promise<void> {
		
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

		const checkToken = await this.tokenRepository.checkToken(tokenPayload.account_id);

		if (checkToken) {
			await this.tokenRepository.updateToken(tokenPayload.account_id, {
				access_token : token.access_token,
				refresh_token : token.refresh_token
			});
			return;
		}

		const tokenEntity: Token = {
			account_id: tokenPayload.account_id,
			subdomain: installInfo.referer,
			access_token: token.access_token,
			refresh_token: token.refresh_token,
			installed: true,
		};

		await this.tokenRepository.createTokenEntity(tokenEntity);
	}
	public async deleteWidget(deleteInfo: WidgetDeleteReq): Promise<void> {

		const checkToken = await this.tokenRepository.checkToken(deleteInfo.account_id)

		if (!checkToken){
			throw ServiceError.NotFound('токен не найден');
		}

		const newTokenData: UpdateTokenDTO = {
			access_token: null,
			refresh_token: null,
			installed: false,
		};
		await this.tokenRepository.deleteToken(deleteInfo.account_id, newTokenData);
	}
}

export default new hooksService(TokenRepository);
