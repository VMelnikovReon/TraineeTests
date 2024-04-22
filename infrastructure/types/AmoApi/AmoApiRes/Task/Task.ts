export type Task = {
	id:number;
	created_by:number;
	updated_by:number;
	created_at:number;
	updated_at:number;
	responsible_user_id:number;
	group_id:number;
	entity_id:number;
	entity_type:string;
	is_completed:boolean;
	task_type_id:number;
	text:string;
	duration:number;
	complete_till:number;
	result:string[];
	account_id:number;
}