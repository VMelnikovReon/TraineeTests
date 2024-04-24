import { CustomApplication } from "./CustomApp";
import api from "./api/api";

const app = new CustomApplication();

app
	.addServices()
	.addRouters("/api")
	.addErrorHandlers()
	.run();

api.getAccessToken().then(() => console.log("токен получен"));
