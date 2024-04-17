import { IContact } from "../AmoApi/AmoApiRes/Contact/IContact";

export interface IHookService{
	calculateAge: (contact:IContact) => number | undefined;
}