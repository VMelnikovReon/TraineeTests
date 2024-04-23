import { Link } from "../../infrastructure/types/AmoApi/AmoApiReq/EntityLinks";
import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";
import { UpdateDealReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateDeal/UpdateDealReq";
import { UpdateTaskReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateTask/UpdateTaskReq";

export interface HookServiceInterface {
	 updateDeal: (deals: UpdateDealReq) => Promise<void>;
	 updateTask: (tasks : UpdateTaskReq) => Promise<void>;
	}
