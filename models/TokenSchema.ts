import mongoose, { Schema, model } from "mongoose";

export interface Token{
	account_id:string,
	subdomain: string,
	access_token?:string | null,
	refresh_token?:string | null,
	installed:boolean
}

export type UpdateTokenDTO = {
	account_id?:string,
	subdomain?: string,
	access_token?:string | null,
	refresh_token?:string | null,
	installed?:boolean,
}

export const TokenSchema = new Schema<Token>({
	account_id: {type: String, require: true, unique: true},
	subdomain: {type: String, require: true},
	access_token:{type: String, require: true},
	refresh_token:{type: String, require: true},
	installed: {type: Boolean, require: true}
})

export const TokenModel =  mongoose.model<Token>('Token', TokenSchema);