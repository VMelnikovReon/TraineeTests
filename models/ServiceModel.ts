import { ObjectId, Schema, model } from "mongoose";

export interface Service{
	_id:ObjectId,
	name:string,
	code: string,
	price: number,
	description: string
}

export const ServiceScheme = new Schema<Service>({
	name:{type: String, required: true},
	code:{type: String, required: true},
	price:{type: Number, required: true},
	description:{type: String, required: true},
})

export const ServiceModel = model<Service>('Service', ServiceScheme);