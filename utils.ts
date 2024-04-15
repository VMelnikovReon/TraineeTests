/**
 * Модуль утилитарных функций:
 *  - для обработки данных из amoCRM;
 *  - общего назначения;
 */

import { AxiosResponse } from "axios";
import { ICustomField } from "./types/AmoApiResponses/ICustomField";

const fs = require("fs");
const logger = require("./logger");

/**
 * Функция извлекает значение из id поля, массива полей custom_fields сущности amoCRM
 *
 * @param {*} customFields - массив полей сущности;
 * @param {*} fieldId - id поля из которого нужно получить значение;
 * @returns значение поля
 */
const getFieldValue = (customFields : ICustomField[], fieldId:number) => {
	const field = customFields
		? customFields.find((item) => String(item.id) === String(fieldId))
		: undefined;
	const value = field ? field.values[0] : undefined;
	return value;
};

/**
 * Функция извлекает значения из id поля, массива полей custom_fields сущности amoCRM
 * Подходит для работы со списковыми или мультисписковыми полями
 *
 * @param {*} customFields - массив полей сущности;
 * @param {*} fieldId - id поля из которого нужно получить значения;
 * @returns массив значений поля
 */
const getFieldValues = (customFields:ICustomField[], fieldId:number) => {
	const field = customFields
		? customFields.find((item) => String(item.id) === String(fieldId))
		: undefined;
	const values = field ? field.values : [];
	return values;
};

/**
 * Функция заполнения поля в amoCRM
 * @param {*} field_id - id поля, которое планируется заполнить. Поле должно быть заранее создано в amoCRM, id копируется из amo;
 * @param {*} value - значение поля, тип данных должен быть идентичным с типом поля в amoCRM;
 * @param {*} enum_id - В случае, если поле списковое или мультисписковое, то для указания нужного значения указывается данный параметр, т.е. id - варианта списка;
 * @returns типовой объект с данными о поле, который необходимо передать в amoCRM.
 */
const makeField = (field_id:number, value:number, enum_id:number) => {
	if (value === undefined || value === null) {
		return undefined;
	}
	return {
		field_id,
		values: [
			{
				value,
				enum_id
			},
		],
	};
};

/**
 * Функция для разбиения запроса на создание на несколько по chunkSize
 * @param {*} reqest - функция-запрос в amo
 * @param {*} data - данные запроса (до разбиения на chunkSize)
 * @param {*} chunkSize - размер chunkSize
 * @param {*} operationName - название операции
 */

//TODO
const bulkOperation = async <T>( 
	reqest : (...args:any[])=>Promise<T>,
	data : any[],
	chunkSize:number,
	operationName = "bulk"
) : Promise<void> => {
	let failed = [];
	if (data.length) {
		logger.debug(`Старт операции ${operationName}`);
		try {
			const chunksCount = data.length / chunkSize;
			for (let i = 0; i < chunksCount; i++) {
				try {
					const sliced = data.slice(i * chunkSize, (i + 1) * chunkSize);
					await reqest(sliced);
				} catch (e) {
					logger.error(e);
					failed.push(...data.slice(i * chunkSize, (i + 1) * chunkSize));
				}
				logger.debug(
					`${operationName} ${i * chunkSize} - ${(i + 1) * chunkSize}`
				);
			}
		} catch (e) {
			logger.error(e);
		}
	}
	logger.debug(
		`операция "${operationName}" завершена. Неуспешных - ${failed.length}`
	);
	fs.writeFileSync(`${operationName}Failed.txt`, JSON.stringify(failed));
};

/**
 * Функция выгрузки всех страниц сущности в amoCRM.
 * @param {*} request - функция-запрос, которая будет выполняться рекурсивно
 * @param {*} page - номер страницы (стартует с 1)
 * @param {*} limit - лимит на количество элементов в ответе (по дефолту - 200)
 * @returns [ ...elements ] все элементы сущности аккаунта
 */
const getAllPages = async (
    request: (options: { page: number, limit: number }) => Promise<any[]>,
    page = 1,
    limit = 200
): Promise<any[]> => {
    try {
        console.log(`Загрузка страницы ${page}`);
        const res = await request({ page, limit });
        if (res.length === limit) {
            const next = await getAllPages(request, page + 1, limit);
            return [...res, ...next];
        }
        return res;
    } catch (e) {
        logger.error(e);
        return [];
    }
};

/**
 * Функция принимает строку в которой есть цифры и символы и возвращает строку только с цифрами
 * применялась чтобы получать чистый номер телефона
 * @param {*} tel - String
 * @returns String | undefined
 */
const getClearPhoneNumber = (tel:string) : string | undefined => {
	return tel ? tel.split("").filter(item => new RegExp(/\d/).test(item)).join("") : undefined;
};

module.exports = {
	getFieldValue,
	getFieldValues,
	makeField,
	bulkOperation,
	getAllPages,
	getClearPhoneNumber
};
