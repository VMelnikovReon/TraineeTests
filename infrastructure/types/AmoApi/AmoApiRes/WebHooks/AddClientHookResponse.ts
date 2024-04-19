import { Account } from "../Account/Account";
import { Contact } from "../Contact/Contact";

export type AddClientHookResponse = {
	account: Account;
	contacts: { add: Contact[] };
}
