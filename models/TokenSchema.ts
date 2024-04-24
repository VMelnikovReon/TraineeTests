import mongoose, { Schema, model } from "mongoose";

export interface Token{
	user_id:string,
	subdomain: string,
	access_token:string,
	refresh_token:string,
	installed:boolean
}

export type UpdateTokenDTO = {
	user_id?:string,
	subdomain?: string,
	access_token:string,
	refresh_token:string,
	installed?:boolean,
}

export const TokenSchema = new Schema<Token>({
	user_id: {type: String, require: true, unique: true},
	subdomain: {type: String, require: true},
	access_token:{type: String, require: true},
	refresh_token:{type: String, require: true},
	installed: {type: Boolean, require: true}
})

export const TokenModel =  mongoose.model<Token>('Token', TokenSchema);