import { IContact } from "../AmoApiRes/Contact/IContact";

export interface ICreateContactBody {
	contacts: {
		add: IContact[];
	};
}
