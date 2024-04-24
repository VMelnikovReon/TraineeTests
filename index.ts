import { CustomApplication } from "./CustomApp";
import api from "./api/api";

const app = new CustomApplication();

const connectionString = 'mongodb://127.0.0.1:27017/traineTest';

mongoose.connect(connectionString)
	.then(()=>console.log('connect'))
	.catch((err)=>console.log(err));

app
	.addServices()
	.addRouters("/api")
	.addErrorHandlers()
	.run();
