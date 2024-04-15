/**
 * Модуль для работы c API amoCRM
 * Модуль используется для работы в NodeJS.
 */

import { AxiosError, AxiosResponse } from "axios";
import { ITokenResponse } from "./types/AmoApiResponses/ITokenResponse";
import { IDeal } from "./types/AmoApiResponses/IDeal";
import { IContact } from "./types/AmoApiResponses/IContact";

const axios = require("axios");
const querystring = require("querystring");
const fs = require("fs");
const axiosRetry = require("axios-retry");
const config = require("./config");
const logger = require("./logger");

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const AMO_TOKEN_PATH = "amo_token.json";

const LIMIT = 200;

class Api {
	private access_token: string | null = null;
	private refresh_token : string | null = null;
	private readonly ROOT_PATH = `https://${config.SUB_DOMAIN}.amocrm.ru`;

	private authChecker<T>(request:(...args:any[])=>Promise<T>) : (...args:any[]) => Promise<T>{
		return (...args:any[]) => {
			if (!this.access_token) {
				return this.getAccessToken().then(() => this.authChecker(request)(...args));
			}
			return request(...args).catch((err: AxiosError) => {
				logger.error(err.response);
				logger.error(err);
				logger.error(err.response?.data);
				const data = err.response?.data;
				// if ("validation-errors" in data) { TODO
				// 	data["validation-errors"].forEach(({ errors }) => logger.error(errors));
				// 	logger.error("args", JSON.stringify(args, null, 2));
				// }
				if (err.response?.status == 401 && err.response.statusText === "Unauthorized") {
					logger.debug("Нужно обновить токен");
					return this.refreshToken().then(() => this.authChecker(request)(...args));
				}
				throw err;
			});
		};
	};

	private requestAccessToken(){
		return axios
			.post(`${this.ROOT_PATH}/oauth2/access_token`, {
				client_id: config.CLIENT_ID,
				client_secret: config.CLIENT_SECRET,
				grant_type: "authorization_code",
				code: config.AUTH_CODE,
				redirect_uri: config.REDIRECT_URI,
			})
			.then((res:AxiosResponse<ITokenResponse>) => {
				logger.debug("Свежий токен получен");
				return res.data;
			})
			.catch((err:AxiosError) => {
				logger.error(err.message);
				throw err;
			});
	};

	private getAccessToken = async () => {
		if (this.access_token) {
			return Promise.resolve(this.access_token);
		}
		try {
			const content = fs.readFileSync(AMO_TOKEN_PATH);
			const token = JSON.parse(content);
			this.access_token = token.access_token;
			this.refresh_token = token.refresh_token;
			return Promise.resolve(token);
		} catch (error) {
			logger.error(`Ошибка при чтении файла ${AMO_TOKEN_PATH}`, error);
			logger.debug("Попытка заново получить токен");
			const token = await this.requestAccessToken();
			fs.writeFileSync(AMO_TOKEN_PATH, JSON.stringify(token));
			this.access_token = token.access_token;
			this.refresh_token = token.refresh_token;
			return Promise.resolve(token);
		}
	};

	private refreshToken(){
		return axios
			.post(`${this.ROOT_PATH}/oauth2/access_token`, {
				client_id: config.CLIENT_ID,
				client_secret: config.CLIENT_SECRET,
				grant_type: "refresh_token",
				refresh_token: this.refresh_token,
				redirect_uri: config.REDIRECT_URI,
			})
			.then((res : AxiosResponse<ITokenResponse>) => {
				logger.debug("Токен успешно обновлен");
				const token = res.data;
				fs.writeFileSync(AMO_TOKEN_PATH, JSON.stringify(token));
				this.access_token = token.access_token;
				this.refresh_token = token.refresh_token;
				return token;
			})
			.catch((err:AxiosError) => {
				logger.error("Не удалось обновить токен");
				logger.error(err.message);
			});
	};

	// this.getAccessToken = getAccessToken;
	// Получить сделку по id
	public getDeal = this.authChecker((id, withParam = []) => {
		return axios
			.get(
				`${this.ROOT_PATH}/api/v4/leads/${id}?${querystring.encode({
					with: withParam.join(","),
				})}`,
				{
					headers: {
						Authorization: `Bearer ${this.access_token}`,
					},
				}
			)
			.then((res:AxiosResponse<IDeal>) => res.data);
	});

	// Получить сделки по фильтрам
	public getDeals = this.authChecker(({ page = 1, limit = LIMIT, filters }) => {
		const url = `${this.ROOT_PATH}/api/v4/leads?${querystring.stringify({
			page,
			limit,
			with: ["contacts"],
			...filters,
		})}`;

		return axios
			.get(url, {
				headers: {
					Authorization: `Bearer ${this.access_token}`,
				},
			})
			.then((res:AxiosResponse<IDeal[]>) => {
				// return res.data ? res.data._embedded.leads : []; TODO
				return res.data ? res.data : [];
			});
	});

	// Обновить сделки
	public updateDeals = this.authChecker((data) => {
		return axios.patch(`${this.ROOT_PATH}/api/v4/leads`, [].concat(data), {
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		});
	});

	// Получить контакт по id
	public getContact = this.authChecker((id) => {
		return axios
			.get(`${this.ROOT_PATH}/api/v4/contacts/${id}?${querystring.stringify({
				with: ["leads"]
			})}`, {
				headers: {
					Authorization: `Bearer ${this.access_token}`,
				},
			})
			.then((res:AxiosResponse<IContact>) => res.data);
	});

	// Обновить контакты
	public updateContacts = this.authChecker((data) => {
		return axios.patch(`${this.ROOT_PATH}/api/v4/contacts`, [].concat(data), {
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		});
	});

}

module.exports = new Api();
