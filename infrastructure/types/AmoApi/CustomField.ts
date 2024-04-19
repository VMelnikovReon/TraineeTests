export type CustomValue = | { value: number | boolean | string, enum_id?:number }
| string
| number
| boolean;

export type CustomField = {
	field_id?: number;
	id?: number;
	field_name?: string;
	name?: string;
	values: CustomValue[]
		
};
