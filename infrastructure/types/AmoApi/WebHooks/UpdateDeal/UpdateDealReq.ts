import { Account } from "../../AmoApiRes/Account/Account"
import { UpdateDealDTO } from "./UpdateDealDTO";

export type UpdateDealReq = {
	account:Account;
	leads:{
		update:UpdateDealDTO[];
	}
}