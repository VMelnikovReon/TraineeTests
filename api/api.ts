/**
 * Модуль для работы c API amoCRM
 * Модуль используется для работы в NodeJS.
 */

import axios, { AxiosError } from "axios";
import { TokenResponse } from "../infrastructure/types/AmoApi/AmoApiRes/Account/TokenResponse";
import axiosRetry from "axios-retry";
import config from '../config'
import logger from "../infrastructure/logger";

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export class Api {
	private readonly ROOT_PATH = `https://${config.SUB_DOMAIN}.amocrm.ru`;

	public requestAccessToken(clientId:string, code: string): Promise<TokenResponse | AxiosError> {
		return axios
			.post<TokenResponse>(`${this.ROOT_PATH}/oauth2/access_token`, {
				client_id: clientId,
				client_secret: config.CLIENT_SECRET,
				grant_type: "authorization_code",
				code: code,
				redirect_uri: config.REDIRECT_URI,
			})
			.then((res) => {
				logger.debug("Свежий токен получен");
				return res.data;
			})
			.catch((err: AxiosError) => {
				logger.error(err.message);
				throw err;
			});
	}

}

export default new Api();