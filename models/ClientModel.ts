import { Schema, model } from "mongoose";

export interface Client{
	_id:string,
	fname:string,
	lname:string,
	phone:string,
	patronymic:string,
	birthDate:Date,
	phoneNumber:string,
}

export const ClientScheme = new Schema<Client>({
	_id:{type: String, required:true, unique:true},
	fname:{type: String, required: true},
	lname:{type: String, required: true},
	phone:{type: String, required: true},
	patronymic:{type: String, required: true},
	birthDate:{type: Date, required: true},
	phoneNumber:{type: String, required: true},
})

export const ClientModel = model<Client>('Client', ClientScheme);