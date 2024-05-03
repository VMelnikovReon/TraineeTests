import {v4 as uuidv4} from 'uuid'
import { Client, ClientModel } from '../../models/ClientModel';
import { Service, ServiceModel } from '../../models/ServiceModel';
import { VisiteModel } from '../../models/VisiteModel';
import { ObjectId } from 'mongoose';
import { faker } from '@faker-js/faker';


function randomDate(startDate: Date, endDate: Date): Date {
    const startMilliseconds = startDate.getTime();
    const endMilliseconds = endDate.getTime();
    const randomMilliseconds = startMilliseconds + Math.random() * (endMilliseconds - startMilliseconds);
    return new Date(randomMilliseconds);
  }

export async function generateClients(count: number) : Promise<void> {
    const clients = Array.from({length : count}, (_item, index)=>{
        const client = new ClientModel({
            fname: faker.name.firstName(),
            lname: faker.name.lastName(),
            patronymic: faker.name.firstName() + 'евич',
            birthDate: randomDate(new Date('1980-01-01'), new Date('2000-01-01')),
            phone: faker.phone.number()
        });
        return client;
    })
    await ClientModel.insertMany(clients);
}

export async function generateServices(count: number): Promise<void> {
    const services = Array.from({length: count}, (_item,index)=>{
        const service = new ServiceModel({
            name: faker.random.word(),
            code: faker.string.uuid(),
            price: faker.number.int({min:100, max:10000}),
            description: faker.random.words(10)
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
            plannedDateTime: randomDate(new Date('2022-01-01'), new Date('2023-01-01')),
            actualDateTime: status === 'visited' ? randomDate(new Date('2023-02-01'), new Date('2024-01-01')) : null,
            status: status,
            services: status === 'visited' ? visitServices : null,
            totalCost: status === 'visited' ? totalPrice : null
        });
        return visit;
    })
    await VisiteModel.insertMany(visits);
}
