import { WidgetInstallReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";

export interface WidgetServiceInterface {
	 installWidget:  (installInfo: WidgetInstallReq) => Promise<void>;
	 deleteWidget:  (req: WidgetInstallReq) => Promise<void>;
}
