import { Task } from "./Task";

export type GetTaskResponse = {
	_page:number;
	_links:{};
	_embedded:{
		tasks?:Task[];
	}
}