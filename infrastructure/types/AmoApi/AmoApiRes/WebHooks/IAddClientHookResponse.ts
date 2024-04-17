import { IAccount } from "../Account/IAccount";
import { IContact } from "../Contact/IContact";

export interface IAddClientHookResponse {
	account: IAccount;
	contacts: { add: IContact[] };
}
