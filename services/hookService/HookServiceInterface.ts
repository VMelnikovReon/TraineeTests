
import { UpdateDealReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateDealReq";

export interface HookServiceInterface {
	 updateDeal: (deals: UpdateDealReq) => Promise<void>;
	}
