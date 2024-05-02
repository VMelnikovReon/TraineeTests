import mongoose from "mongoose";
import {
	generateClients,
	generateServices,
	generateVisits,
} from "./infrastructure/dataGeneration/generate";
import { ClientModel } from "./models/ClientModel";
import { ServiceModel } from "./models/ServiceModel";
import logger from "./infrastructure/logger";
import 'dotenv/config';
import { FILL } from "./infrastructure/consts";

async function fillDatabase() {
	try {
		if (!process.env.CONNECTION_STRING){
			throw new Error('нет строки подключения')
		}
		mongoose
			.connect(process.env.CONNECTION_STRING)
			.then(() => logger.debug("соединение установленно"));

		await generateClients(FILL.CLIENTS);
		logger.debug("клиенты");

		await generateServices(FILL.SERVICES);
		logger.debug("услуги");

		const clients = await ClientModel.find();
		const services = await ServiceModel.find();

		await generateVisits(FILL.VISITS, clients, services);
		logger.debug("визиты");

		logger.debug("база заполнена успешно");
	} catch (error) {
		logger.debug(error);
	} finally {
		mongoose.disconnect();
	}
}

fillDatabase();
