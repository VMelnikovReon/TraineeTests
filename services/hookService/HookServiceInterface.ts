import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";

export interface HookServiceInterface {
	 addContact:  (contact: Contact) => Promise<boolean>;
}
