import { ICustomField } from "../../ICustomField";
import { ICustomFieldToUpdate } from "../ICustomFieldToUpdate";

export interface IUpdateContact {
	id: number;
	name?: string;
	first_name?: string;
	last_name?: string;
	created_by?: number;
	updated_by?: number;
	created_at?: number;
	updated_at?: number;
	responsible_user_id?: number;
	custom_fields_values?: ICustomField[];
	tags_to_add?: ICustomFieldToUpdate[];
	tags_to_delete?: ICustomFieldToUpdate[];
	_embedded?: {
		tags?: ICustomFieldToUpdate[] | null;
	};
}
