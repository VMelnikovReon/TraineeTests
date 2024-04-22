import { Link } from "../../infrastructure/types/AmoApi/AmoApiReq/EntityLinks";
import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";
import { UpdateDeakReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateDealReq";

export interface HookServiceInterface {
	 addContact:  (contact: Contact) => Promise<boolean>;
	 updateDeal: (deals: UpdateDeakReq) => Promise<boolean>;
	 

	}
