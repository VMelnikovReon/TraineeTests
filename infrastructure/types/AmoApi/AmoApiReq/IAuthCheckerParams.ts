import { IFilters } from "../IFilters";
import { IUpdateContact } from "./Update/IUpdateContact";
import { IUpdateDeal } from "./Update/IUpdateDeal";

export interface IGetDealParams {
	id: number;
	withParam?: [];
}

export interface IGetDealsParams {
	page: number;
	limit: number;
	filters: IFilters;
}

export type IAuthCheckerParams =
	| IGetDealParams
	| IGetDealsParams
	| number
	| IUpdateContact
	| IUpdateDeal;
