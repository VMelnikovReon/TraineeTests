import mongoose from "mongoose";
import {
	generateClients,
	generateServices,
	generateVisits,
} from "./infrastructure/dataGeneration/generate";
import { ClientModel } from "./models/ClientModel";
import { ServiceModel } from "./models/ServiceModel";
import logger from "./infrastructure/logger";

async function fillDatabase() {
	try {
		mongoose
			.connect("mongodb://127.0.0.1:27017/LastTask")
			.then(() => logger.debug("соединение установленно"));

		await generateClients(200);
		logger.debug("клиенты");

		await generateServices(10);
		logger.debug("услуги");

		const clients = await ClientModel.find();
		const services = await ServiceModel.find();

		await generateVisits(3000, clients, services);
		logger.debug("визиты");

		logger.debug("база заполнена успешно");
	} catch (error) {
		logger.debug("ошибочки");
	} finally {
		mongoose.disconnect();
	}
}

fillDatabase();
