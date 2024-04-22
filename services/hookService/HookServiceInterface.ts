import { Link } from "../../infrastructure/types/AmoApi/AmoApiReq/EntityLinks";
import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";
import { UpdateDealReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateDealReq";

export interface HookServiceInterface {
	 addContact:  (contact: Contact) => Promise<void>;
	 updateDeal: (deals: UpdateDealReq) => Promise<void>;
	 

	}
