import { IContact } from "../AmoApiResponses/IContact";

export interface IHookService{
	calculateAge: (contact:IContact) => number | undefined;
}