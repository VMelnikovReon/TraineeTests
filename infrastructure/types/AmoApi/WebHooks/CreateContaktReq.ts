import { Contact } from "../AmoApiRes/Contact/Contact";

export type CreateContactBody = {
	contacts: {
		add: Contact[];
	};
}
