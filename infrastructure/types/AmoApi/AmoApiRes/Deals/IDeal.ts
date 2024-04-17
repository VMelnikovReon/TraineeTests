import { ICompany } from "../Company/ICompany";
import { ICustomField } from "../../ICustomField";
import { ITag } from "../../ITag";

export interface IDeal {
	id: number;
	name: string;
	price: number;
	responsible_user_id: number;
	group_id: number;
	status_id: number;
	pipeline_id: number;
	loss_reason_id: number;
	source_id: number;
	created_by: number;
	updated_by: number;
	created_at: number;
	updated_at: number;
	closed_at: number;
	closest_task_at: number;
	is_deleted: boolean;
	custom_fields_values: ICustomField[];
	score: number;
	account_id: number;
	is_price_modified_by_robot: boolean;
	_links: {
		self: { href: string };
	};
	_embedded: {
		tags: {
			id: number;
			name: string;
			color: string;
		}[];
		companies: {
			id: number;
			_links: { self: { href: string } };
		}[];
		loss_reason: {
			id: number;
			name: string;
			sort: number;
			create_at: number;
			update_at: number;
			_links: { self: { href: string } };
		}[];
		catalog_elements: [];
		contacts: {
			id: number;
			is_main: boolean;
			_links: { self: { href: string } };
		}[];
	};
}
