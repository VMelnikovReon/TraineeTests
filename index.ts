import { CustomApplication } from "./CustomApp";

const app = new CustomApplication();

app
	.addServices()
	.addRouters("/api")
	.addErrorHandlers()
	.run();
