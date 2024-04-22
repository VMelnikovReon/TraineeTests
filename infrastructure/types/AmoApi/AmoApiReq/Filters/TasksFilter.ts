export type TaskFilter = {
	"filter[responsible_user_id]"? : number;
	"filter[task_type]"? : number;
	"filter[entity_type]"? : string;
	"filter[entity_id]"? : number;
	"filter[id]"? : number;
	"filter[updated_at]"? : number;
	"filter[is_completed]"? : 0 | 1;

}