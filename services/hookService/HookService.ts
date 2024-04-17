import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";

export type IHookService = {
	calculateAge: (contact: Contact) => number | undefined;
}
