import { Schema, model } from "mongoose";

export interface Service{
	_id:string,
	name:string,
	code: string,
	prive: number,
	description: string
}

export const ServiceScheme = new Schema<Service>({
	_id:{type: String, required:true, unique:true},
	name:{type: String, required: true},
	code:{type: String, required: true},
	prive:{type: Number, required: true},
	description:{type: String, required: true},
})

export const ServiceModel = model<Service>('Service', ServiceScheme);