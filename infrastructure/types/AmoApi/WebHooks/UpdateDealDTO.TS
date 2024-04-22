import { CustomField } from "../CustomField";

export type UpdateDealDTO = {
	id: number;
	name: string;
	price: number;
	responsible_user_id: number;
	last_modified:number;
	created_user_id:number;
	date_create:number;
	pipeline_id: number;
	account_id:number;
	created_at: number;
	updated_at: number;
	custom_fields: CustomField[];
}