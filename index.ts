import { CustomApplication } from "./CustomApp";
import CONFIG from "./config";


const app = new CustomApplication();

app
	.connectDB(CONFIG.BD_CONNECTION_STRING, {})
	.addServices()
	.addRouters("/api")
	.addErrorHandlers()
	.run();
