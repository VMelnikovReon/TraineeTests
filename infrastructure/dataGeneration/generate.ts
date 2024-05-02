import {v4 as uuidv4} from 'uuid'
import { Client, ClientModel } from '../../models/ClientModel';
import { Service, ServiceModel } from '../../models/ServiceModel';
import { VisiteModel } from '../../models/VisiteModel';
import { ObjectId } from 'mongoose';

export async function generateClients(count: number) : Promise<void> {
    const clients = [];
    for (let i = 0; i < count; i++) {
        const client = new ClientModel({
            fname: 'Name' + i,
            lname: 'Lastname' + i,
            patronymic: 'Patronymic' + i,
            birthDate: new Date(i),
            phone: '123456789' + i
        });
        clients.push(client);
    }
    await ClientModel.insertMany(clients);
}

export async function generateServices(count: number): Promise<void> {
    const services = [];
    for (let i = 0; i < count; i++) {
        const service = new ServiceModel({
            name: 'Service' + i,
            code: 'CODE' + i,
            price: Math.floor(Math.random() * 100) + 50,
            description: 'Description of service ' + i
        });
        services.push(service);
    }
    await ServiceModel.insertMany(services);
}

export async function generateVisits(count: number, clients : Client[], services: Service[]): Promise<void> {
    const visits = [];
    const statuses = ['planned', 'visited', 'cancelled'];

    for (let i = 0; i < count; i++) {
        const status = statuses[Math.floor(Math.random() * (statuses.length - 1))];

		const serviseCount = Math.random() * (services.length - 1);

		const visitServices: ObjectId[] = [];

		let totalPrice = 0;

		for (let i = 0; i<= serviseCount; i++){
			const service = services[Math.floor(Math.random() * (services.length -1))];

			if (visitServices.includes(service._id)){
				continue;
			}

			visitServices.push(service._id);
			totalPrice += service.price;
		}

		const randomClient = clients[Math.floor(Math.random() * (clients.length - 1))]

        const visit = new VisiteModel({
            client: randomClient._id,
            plannedDateTime: new Date(i),
            actualDateTime: status === 'visited' ? new Date(i+1) : null,
            status: status,
            services: status === 'visited' ? visitServices : null,
            totalCost: status === 'visited' ? totalPrice : null
        });
        visits.push(visit);

    }
    await VisiteModel.insertMany(visits);
}
