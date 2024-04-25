import { UpdateDealReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateDeal/UpdateDealReq";

export interface HookServiceInterface {
	 updateDeal: (deals: UpdateDealReq) => Promise<void>;
	}
