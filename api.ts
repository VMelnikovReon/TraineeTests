/**
 * Модуль для работы c API amoCRM
 * Модуль используется для работы в NodeJS.
 */

import { AxiosError, AxiosResponse } from "axios";
import { ITokenResponse } from "./infrastructure/types/AmoApi/AmoApiRes/Account/ITokenResponse";
import { IDeal } from "./infrastructure/types/AmoApi/AmoApiRes/Deals/IDeal";
import { IContact } from "./infrastructure/types/AmoApi/AmoApiRes/Contact/IContact";
import { IErrorResponse } from "./infrastructure/types/AmoApi/AmoApiRes/Errors/IErrorResponse";
import { IDealsResponse } from "./infrastructure/types/AmoApi/AmoApiRes/Deals/IDealsResponse";
import { IUpdateDeal } from "./infrastructure/types/AmoApi/AmoApiReq/Update/IUpdateDeal";
import { IFilters } from "./infrastructure/types/AmoApi/IFilters";
import { IUpdateContact } from "./infrastructure/types/AmoApi/AmoApiReq/Update/IUpdateContact";
import { Response } from 'express';
import { IUpdateContactRes } from "./infrastructure/types/AmoApi/AmoApiRes/Contact/IUpdateContactRes";
import { IUpdateDealsRes } from "./infrastructure/types/AmoApi/AmoApiRes/Deals/IUpdateDealsRes";

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

	private authChecker<Args, Response>(request:(args:Args)=>Promise<Response>) : (args:Args) => Promise<Response>{
		return (args:Args) => {
			if (!this.access_token) {
				return this.getAccessToken().then(() => this.authChecker(request)(args));
			}
			return request(args).catch((err: AxiosError<IErrorResponse>) => {
				logger.error(err.response);
				logger.error(err);
				logger.error(err.response?.data);
				const data = err.response?.data;
				if (data && "validation-errors" in data) { 
					data["validation-errors"].forEach((error) => logger.error(error));
					logger.error("args", JSON.stringify(args, null, 2));
				}
				if (err.response?.status === 401 && err.response.statusText === "Unauthorized") {
					logger.debug("Нужно обновить токен");
					return this.refreshToken().then(() => this.authChecker(request)(args));
				}
				throw err;
			});
		};
	};

	private requestAccessToken() : Promise<ITokenResponse | AxiosError>{
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

	private getAccessToken = async () : Promise<string | ITokenResponse | AxiosError> => {
		if (this.access_token) {
			return Promise.resolve(this.access_token);
		}
		try {
			const content = fs.readFileSync(AMO_TOKEN_PATH);
			const token : ITokenResponse = JSON.parse(content);
			this.access_token = token.access_token;
			this.refresh_token = token.refresh_token;
			return Promise.resolve(token);
		} catch (error) {
			logger.error(`Ошибка при чтении файла ${AMO_TOKEN_PATH}`, error);
			logger.debug("Попытка заново получить токен");
			const token = await this.requestAccessToken();
			if (token instanceof Error){
				throw token.message;
			}
			fs.writeFileSync(AMO_TOKEN_PATH, JSON.stringify(token));
			this.access_token = token.access_token;
			this.refresh_token = token.refresh_token;
			return Promise.resolve(token);
		}
	};

	private refreshToken() : Promise<ITokenResponse>{
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
	public getDeal = this.authChecker(({id,withParam = []}:{id: string; withParam: string[]}) : Promise<IDeal> => {
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
			.then((res: AxiosResponse<IDeal>) => res.data);
	});
	

	// Получить сделки по фильтрам
	public getDeals = this.authChecker(({page,limit,filters} : { page:number, limit: number, filters:IFilters } ) : Promise<IDealsResponse> => {
		const url = `${this.ROOT_PATH}/api/v4/leads?${querystring.stringify({
			page: page,
			limit :limit,
			with: ["contacts"],
			...filters,
		})}`;

		return axios
			.get(url, {
				headers: {
					Authorization: `Bearer ${this.access_token}`,
				},
			})
			.then((res:AxiosResponse<IDealsResponse>) => {
				return res.data ? res.data._embedded.leads : []; 
			});
	});

	// Обновить сделки
	public updateDeals = this.authChecker((data:IUpdateDeal[]) : Promise<IUpdateDealsRes> => {
		return axios.patch(`${this.ROOT_PATH}/api/v4/leads`, data, {
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		});
	});

	// Получить контакт по id
	public getContact = this.authChecker((id:number) : Promise<IContact> => {
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
	public updateContacts = this.authChecker((data:IUpdateContact) : Promise<IUpdateContactRes> => {
		return axios.patch(`${this.ROOT_PATH}/api/v4/contacts`, data, {
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		});
	});

}

module.exports = new Api();
