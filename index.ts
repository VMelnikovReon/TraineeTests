import { CustomApplication } from "./CustomApp";

const api = require("./api/api");
const app = new CustomApplication();

app
	.addServices()
	.addRouters("/api")
	.addErrorHandlers()
	.run();
