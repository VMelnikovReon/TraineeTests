import { ObjectId, Schema, model } from "mongoose";

export interface Client{
	_id:ObjectId,
	fname:string,
	lname:string,
	phone:string,
	patronymic:string,
	birthDate:Date,
}

export const ClientScheme = new Schema<Client>({
	fname:{type: String, required: true},
	lname:{type: String, required: true},
	phone:{type: String, required: true},
	patronymic:{type: String, required: true},
	birthDate:{type: Date, required: true},
})

export const ClientModel = model<Client>('Client', ClientScheme);