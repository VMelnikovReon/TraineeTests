import { Account } from "../AmoApiRes/Account/Account"
import { UpdateDealDTO } from "./UpdateDealDTO";

export type UpdateDeakReq = {
	account:Account;
	leads:{
		update:UpdateDealDTO[];
	}
}