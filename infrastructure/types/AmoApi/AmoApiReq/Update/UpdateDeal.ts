import { CustomField } from "../../CustomField";
import { CustomFieldToUpdate } from "../CustomFieldToUpdate";

export type UpdateDeal = {
	id: number;
	name?: string;
	price?: number;
	status_id?: number;
	pipeline_id?: number;
	created_by?: number;
	updated_by?: number;
	closed_at?: number;
	created_at?: number;
	updated_at?: number;
	loss_reason_id?: number;
	responsible_user_id?: number;
	custom_fields_values?: CustomField[];
	tags_to_add?: CustomFieldToUpdate[];
	tags_to_delete?: CustomFieldToUpdate[];
	_embedded?: {
		tags?: CustomFieldToUpdate[] | null;
	};
}
