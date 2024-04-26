import { WidgetDeleteReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetDeleteReq";
import { WidgetInstallReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";

export interface WidgetServiceInterface {
	 installWidget:  (installInfo: WidgetInstallReq) => Promise<void>;
	 deleteWidget:  (req: WidgetDeleteReq) => Promise<void>;
}
