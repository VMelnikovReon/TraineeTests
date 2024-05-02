import {v4 as uuidv4} from 'uuid'
import { Client, ClientModel } from '../../models/ClientModel';
import { Service, ServiceModel } from '../../models/ServiceModel';
import { VisiteModel } from '../../models/VisiteModel';
import { ObjectId } from 'mongoose';

export async function generateClients(count: number) : Promise<void> {
    const clients = Array.from({length : count}, (_item, index)=>{
        const client = new ClientModel({
            fname: 'Name' + index,
            lname: 'Lastname' + index,
            patronymic: 'Patronymic' + index,
            birthDate: new Date(index),
            phone: '123456789' + index
        });
        return client;
    })
    await ClientModel.insertMany(clients);
}

export async function generateServices(count: number): Promise<void> {
    const services = Array.from({length: count}, (_item,index)=>{
        const service = new ServiceModel({
            name: 'Service' + index,
            code: 'CODE' + index,
            price: Math.floor(Math.random() * 100) + 50,
            description: 'Description of service ' + index
        });
        return service;
    });
    await ServiceModel.insertMany(services);
}

export async function generateVisits(count: number, clients : Client[], services: Service[]): Promise<void> {
    const statuses = ['planned', 'visited', 'cancelled'];

    const visits = Array.from({length: count}, (_item, index)=>{
        const status = statuses[Math.floor(Math.random() * (statuses.length - 1))];

		const serviseCount = Math.random() * (services.length - 1);

		const visitServices: ObjectId[] = [];

		let totalPrice = 0;

		for (let j = 0; j<= serviseCount; j++){
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
            plannedDateTime: new Date(index),
            actualDateTime: status === 'visited' ? new Date(index+1) : null,
            status: status,
            services: status === 'visited' ? visitServices : null,
            totalCost: status === 'visited' ? totalPrice : null
        });
        return visit;
    })
    await VisiteModel.insertMany(visits);
}
