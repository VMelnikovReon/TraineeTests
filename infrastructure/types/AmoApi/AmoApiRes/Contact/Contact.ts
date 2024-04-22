import { CustomField } from "../../CustomField";

export type Contact = {
	id: number;
	responsible_user_id: number;
	date_create: string;
	last_modified: string;
	created_user_id: number;
	modified_user_id: number;
	account_id: number;
	custom_fields?: CustomField[];
	custom_fields_values?: CustomField[];
	created_at: string;
	updated_at: string;
	type: string;
}
