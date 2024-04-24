/**
 * Модуль для работы c API amoCRM
 * Модуль используется для работы в NodeJS.
 */

import { AxiosError, AxiosRequestConfig, HttpStatusCode } from "axios";
import { TokenResponse } from "../infrastructure/types/AmoApi/AmoApiRes/Account/TokenResponse";
import { Deal } from "../infrastructure/types/AmoApi/AmoApiRes/Deals/Deal";
import { Contact } from "../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";
import { ErrorResponse } from "../infrastructure/types/AmoApi/AmoApiRes/Errors/ErrorResponse";
import { DealsResponse } from "../infrastructure/types/AmoApi/AmoApiRes/Deals/DealsResponse";
import { UpdateDeal } from "../infrastructure/types/AmoApi/AmoApiReq/Update/UpdateDeal";
import { Filters } from "../infrastructure/types/AmoApi/Filters";
import { UpdateContact } from "../infrastructure/types/AmoApi/AmoApiReq/Update/UpdateContact";
import { UpdateContactRes } from "../infrastructure/types/AmoApi/AmoApiRes/Contact/UpdateContactRes";
import { UpdateDealsRes } from "../infrastructure/types/AmoApi/AmoApiRes/Deals/UpdateDealsRes";
import axios from "axios";
import { ERRORS } from "../infrastructure/consts";
import { EntityLinksDTO, Link } from "../infrastructure/types/AmoApi/AmoApiReq/EntityLinks";
import querystring from 'querystring';
import fs from 'fs';
import axiosRetry from "axios-retry";
import config from '../config';
import logger from "../infrastructure/logger";


axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const AMO_TOKEN_PATH = "amo_token.json";

const LIMIT = 200;

export class Api {
	private access_token: string | null = null;
	private refresh_token: string | null = null;
	private readonly ROOT_PATH = `https://${config.SUB_DOMAIN}.amocrm.ru`;

	private createReqConfig(options: { Auth: boolean }): AxiosRequestConfig {
		const config: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		};
		return config;
	}

	private authChecker<TArgs extends unknown[], TResponse>(
		request: (...args: TArgs) => Promise<TResponse>
	): (...args: TArgs) => Promise<TResponse> {
		return (...args: TArgs) => {
			if (!this.access_token) {
				return this.getAccessToken().then(() =>
					this.authChecker(request)(...args)
				);
			}
			return request(...args).catch((err: AxiosError<ErrorResponse>) => {
				logger.error(err.response);
				logger.error(err);
				logger.error(err.response?.data);
				const data = err.response?.data;
				if (data && ERRORS.VALIDATION_ERRORS in data) {
					data[ERRORS.VALIDATION_ERRORS].forEach((error) =>
						logger.error(error)
					);
					logger.error("args", JSON.stringify(args, null, 2));
				}
				if (
					err.response?.status === HttpStatusCode.Unauthorized &&
					err.response.statusText === "Unauthorized"
				) {
					logger.debug("Нужно обновить токен");
					return this.refreshToken().then(() =>
						this.authChecker(request)(...args)
					);
				}
				throw err;
			});
		};
	}

	private requestAccessToken(): Promise<TokenResponse | AxiosError> {
		return axios
			.post<TokenResponse>(`${this.ROOT_PATH}/oauth2/access_token`, {
				client_id: config.CLIENT_ID,
				client_secret: config.CLIENT_SECRET,
				grant_type: "authorization_code",
				code: config.AUTH_CODE,
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

	public getAccessToken = async (): Promise<
		string | TokenResponse | AxiosError
	> => {
		if (this.access_token) {
			return Promise.resolve(this.access_token);
		}
		try {
			const content = fs.readFileSync(AMO_TOKEN_PATH);
			const token: TokenResponse = JSON.parse(content.toString());
			this.access_token = token.access_token;
			this.refresh_token = token.refresh_token;
			return Promise.resolve(token);
		} catch (error) {
			logger.error(`Ошибка при чтении файла ${AMO_TOKEN_PATH}`, error);
			logger.debug("Попытка заново получить токен");
			const token = await this.requestAccessToken();
			if (token instanceof Error) {
				throw token.message;
			}
			fs.writeFileSync(AMO_TOKEN_PATH, JSON.stringify(token));
			this.access_token = token.access_token;
			this.refresh_token = token.refresh_token;
			return Promise.resolve(token);
		}
	};

	private refreshToken(): Promise<TokenResponse | void> {
		return axios
			.post<TokenResponse>(`${this.ROOT_PATH}/oauth2/access_token`, {
				client_id: config.CLIENT_ID,
				client_secret: config.CLIENT_SECRET,
				grant_type: "refresh_token",
				refresh_token: this.refresh_token,
				redirect_uri: config.REDIRECT_URI,
			})
			.then((res) => {
				logger.debug("Токен успешно обновлен");
				const token = res.data;
				fs.writeFileSync(AMO_TOKEN_PATH, JSON.stringify(token));
				this.access_token = token.access_token;
				this.refresh_token = token.refresh_token;
				return token;
			})
			.catch((err: AxiosError) => {
				logger.error("Не удалось обновить токен");
				logger.error(err.message);
			});
	}

	// this.getAccessToken = getAccessToken;
	// Получить сделку по id
	public getDeal = this.authChecker(
		(id: number, withParam: string[] = []): Promise<Deal> => {
			return axios
				.get<Deal>(
					`${this.ROOT_PATH}/api/v4/leads/${id}?${querystring.encode({
						with: withParam.join(","),
					})}`,
					this.createReqConfig({ Auth: true })
				)
				.then((res) => res.data);
		}
	);

	// Получить сделки по фильтрам
	public getDeals = this.authChecker(
		(page: number, limit: number, filters: Filters): Promise<Deal[]> => {
			const url = `${this.ROOT_PATH}/api/v4/leads?${querystring.stringify({
				page: page,
				limit: limit,
				with: ["contacts"],
				...filters,
			})}`;

			return axios
				.get<DealsResponse>(url, {
					headers: {
						Authorization: `Bearer ${this.access_token}`,
					},
				})
				.then((res) => {
					return res.data ? res.data._embedded.leads : [];
				});
		}
	);

	// Обновить сделки
	public updateDeals = this.authChecker(
		(data: UpdateDeal[]): Promise<UpdateDealsRes> => {
			return axios.patch(
				`${this.ROOT_PATH}/api/v4/leads`,
				data,
				this.createReqConfig({ Auth: true })
			);
		}
	);

	// Получить контакт по id
	public getContact = this.authChecker((id: number): Promise<Contact> => {
		return axios
			.get<Contact>(
				`${this.ROOT_PATH}/api/v4/contacts/${id}?${querystring.stringify({
					with: ["leads"],
				})}`,
				this.createReqConfig({ Auth: true })
			)
			.then((res) => res.data);
	});

	// Обновить контакты
	public updateContacts = this.authChecker(
		(data: UpdateContact[]): Promise<UpdateContactRes> => {
			console.log(data);
			return axios.patch(
				`${this.ROOT_PATH}/api/v4/contacts`,
				data,
				this.createReqConfig({ Auth: true })
			);
		}
	);

	public getLinkEntityes = this.authChecker(
		(
			targetEntity: 'leads' | "contacts" | "companies" | "customers",
			id: number,
			filters: Filters = {}
		): Promise<Link[]> => {
			return axios
				.get<EntityLinksDTO>(
					`${this.ROOT_PATH}/api/v4/${targetEntity}/${id}/links`,
					{
						headers: {
							Authorization: `Bearer ${this.access_token}`,
						},
					}
				)
				.then((res) => {
					return res ? res.data._embedded.links : [];
				});
		}
	);
}

export default new Api();
