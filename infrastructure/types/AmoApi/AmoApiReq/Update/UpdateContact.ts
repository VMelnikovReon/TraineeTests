import { CustomField } from "../../CustomField";
import { CustomFieldToUpdate } from "../CustomFieldToUpdate";

export type UpdateContact = {
	id: number;
	name?: string;
	first_name?: string;
	last_name?: string;
	created_by?: number;
	updated_by?: number;
	created_at?: number;
	updated_at?: number;
	responsible_user_id?: number;
	custom_fields_values?: CustomField[];
	tags_to_add?: CustomFieldToUpdate[];
	tags_to_delete?: CustomFieldToUpdate[];
	_embedded?: {
		tags?: CustomFieldToUpdate[] | null;
	};
}
