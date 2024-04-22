import {
	AMO_ENTITYES,
	CUSTOM_FIELDS_ID,
	TASK_TYPES,
	TIMESTAMP,
} from "../../infrastructure/consts";
import { ServiceError } from "../../infrastructure/errors/ServiceError";
import { calculateAge } from "../../infrastructure/helpers/calculateAge";
import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";
import { HookServiceInterface } from "./HookServiceInterface";
import { UpdateContact } from "../../infrastructure/types/AmoApi/AmoApiReq/Update/UpdateContact";
import { makeField } from "../../infrastructure/utils";
import { UpdateDealReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateDealReq";
import { Link } from "../../infrastructure/types/AmoApi/AmoApiReq/EntityLinks";
import { UpdateDeal } from "../../infrastructure/types/AmoApi/AmoApiReq/Update/UpdateDeal";
import { CreateTaskDTO } from "../../infrastructure/types/AmoApi/AmoApiReq/Create/CreateTaskDTO";
import { TaskFilter } from "../../infrastructure/types/AmoApi/AmoApiReq/Filters/TasksFilter";
import { GetTaskResponse } from "../../infrastructure/types/AmoApi/AmoApiRes/Task/GetTasksRes";

class hooksService implements HookServiceInterface {
	private api = require("../../api/api");
	private logger = require('../../infrastructure/logger');

	private getLeadContacts = (contactLinks: Link[]) : Link | null | undefined =>{
		switch (contactLinks.length) {
			case 0:
				return null;
			case 1:
				return contactLinks[0];
			default:
				return contactLinks.find(
					(contact) => contact.metadata?.main_contact
				);
		}
	}

	public async addContact(contact: Contact): Promise<void> {
		const customFields = contact.custom_fields || contact.custom_fields_values;

		if (!customFields) {
			throw new Error("кастомные поля не найдены");
		}

		const BirthdayDateCustomField = customFields.find(
			(field) =>
				Number(field.field_id || field.id) ===
				CUSTOM_FIELDS_ID.CONTACT.BIRTHDAY_DATE
		);

		if (!BirthdayDateCustomField) {
			throw ServiceError.BadRequest("отсутствует поле с датой");
		}

		if (typeof Number(BirthdayDateCustomField.values[0]) !== "number") {
			throw ServiceError.BadRequest("поле с датой имеет не правильный тип");
		}

		const birthdayDate = new Date(
			Number(BirthdayDateCustomField.values[0]) * TIMESTAMP.MSEC_PER_SEC
		);

		const age = calculateAge(birthdayDate);

		const newAgeField = makeField(
			CUSTOM_FIELDS_ID.CONTACT.BIRTHDAY_DATE,
			age,
			1
		);

		if (!newAgeField) {
			throw new Error();
		}

		const updateContactBody: UpdateContact[] = [
			{
				id: Number(contact.id),
				custom_fields_values: [
					{
						field_id: CUSTOM_FIELDS_ID.CONTACT.AGE,
						values: [{ value: String(age) }],
					},
				],
			},
		];

		await this.api.UpdateContact(updateContactBody);

		this.logger.debug('возраст добавлен');
	}

	public async updateDeal(deals: UpdateDealReq): Promise<void> {
		deals.leads.update.forEach(async (lead) => {
			const linkEntities: Link[] = await this.api.getLinkEntityes(
				AMO_ENTITYES.LEADS,
				lead.id
			);
			const contacts = linkEntities.filter(
				(link) => link.to_entity_type === AMO_ENTITYES.CONTACTS
			);

			const mainContact = this.getLeadContacts(contacts);

			if (!mainContact){
				return;
			}

			const contactFullInfo: Contact = await this.api.getContact(
				mainContact?.to_entity_id
			);

			const customFields = contactFullInfo.custom_fields_values;

			const leadServiceList = lead.custom_fields?.find((field)=>Number(field.id || field.field_id) === CUSTOM_FIELDS_ID.LEAD.SERVICES.ID);

			const priceReduce = leadServiceList?.values.reduce((summ, field) => {
				
				const serviceName = typeof field === 'object' && field.value
				const servicePriceField = customFields?.find((field) => (field.name || field.field_name) === serviceName);
				if (servicePriceField && typeof servicePriceField.values[0] === 'object') {
					const servicePrice = Number(servicePriceField.values[0].value);
					summ.price += servicePrice;
					return summ;
				} else {
					return summ;
				}
			}, {price : 0});

			const totalPrice = priceReduce?.price ? priceReduce.price : 0;

			const updateDealDTO: UpdateDeal[] = [
				{
					id: Number(lead.id),
					price: totalPrice,
				},
			];

			if (Number(lead.price) !== updateDealDTO[0].price) {
				await this.api.updateDeals(updateDealDTO);

				const taskFilter : TaskFilter = {
					'filter[entity_id]': lead.id,
					'filter[entity_type]' : AMO_ENTITYES.LEADS,
					'filter[is_completed]' : 0,
					'filter[task_type]' : TASK_TYPES.CHECK,
				}
				
				const unComplitedTasks : any = await this.api.getTasks(10,1,taskFilter);
				
				if (unComplitedTasks){
					console.log(unComplitedTasks._embedded.tasks.length);
					return;
				}

				const createTaskDTO : CreateTaskDTO[] = [
					{
						entity_id : Number(lead.id),
						entity_type: AMO_ENTITYES.LEADS,
						task_type_id: TASK_TYPES.CHECK,
						text: 'Проверить бюджет',
						responsible_user_id: Number(lead.responsible_user_id),
						complete_till : Math.floor((new Date().getTime() / TIMESTAMP.MSEC_PER_SEC) + (TIMESTAMP.MSEC_PER_DAY / TIMESTAMP.MSEC_PER_SEC))
					}
				]

				await this.api.createTask(createTaskDTO);
			}
		});
		this.logger.debug('Сумма сделки изменена');
	}
}

module.exports = new hooksService();
