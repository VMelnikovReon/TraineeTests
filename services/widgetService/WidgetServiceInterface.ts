import { WidgetInstallReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";

export interface WidgetServiceInterface {
	 installWidget:  (installInfo: WidgetInstallReq) => Promise<void>;
}
