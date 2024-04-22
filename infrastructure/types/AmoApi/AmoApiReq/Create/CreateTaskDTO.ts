export type CreateTaskDTO = {
	responsible_user_id?: number;
	entity_id?:number;
	entity_type?:string;
	is_completed?:boolean;
	task_type_id?:number;
	text?:string;
	duration?:number;
	complete_till?:number;
	created_by?:number;
	updated_by?:number;
	created_at?:number;
	updated_at?:number;
	request_id?:number;
}