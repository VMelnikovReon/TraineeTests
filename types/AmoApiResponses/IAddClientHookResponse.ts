import { IAccount } from "./IAccount";
import { IContact } from "./IContact";

export interface IAddClientHookResponse{
	account:IAccount;
	contacts:{add:IContact[]};
}