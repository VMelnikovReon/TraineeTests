import {
	AMO_ENTITYES,
	CUSTOM_FIELDS_ID,
	NOTES,
	TASKS,
	TIMESTAMP,
} from "../../infrastructure/consts";
import { ServiceError } from "../../infrastructure/errors/ServiceError";
import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";
import { HookServiceInterface } from "./HookServiceInterface";
import { UpdateContact } from "../../infrastructure/types/AmoApi/AmoApiReq/Update/UpdateContact";
import { makeField } from "../../infrastructure/utils";
import { UpdateDealReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateDeal/UpdateDealReq";
import { Link } from "../../infrastructure/types/AmoApi/AmoApiReq/EntityLinks";
import { UpdateDeal } from "../../infrastructure/types/AmoApi/AmoApiReq/Update/UpdateDeal";
import { CreateTaskDTO } from "../../infrastructure/types/AmoApi/AmoApiReq/Create/CreateTask";
import { TaskFilter } from "../../infrastructure/types/AmoApi/AmoApiReq/Filters/TasksFilter";
import { GetTaskResponse } from "../../infrastructure/types/AmoApi/AmoApiRes/Task/GetTasksRes";
import { UpdateTaskReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateTask/UpdateTaskReq";
import { CreateNoteDTO } from "../../infrastructure/types/AmoApi/AmoApiReq/Create/CreateNotes/CreateNoteDTO";

class hooksService implements HookServiceInterface {
	private api = require("../../api/api");
	private logger = require('../../infrastructure/logger');

	private getLeadContacts = (contactLinks: Link[]): Link | null | undefined => {
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

			if (!mainContact) {
				return;
			}

			const contactFullInfo: Contact = await this.api.getContact(
				mainContact?.to_entity_id
			);

			const customFields = contactFullInfo.custom_fields_values;

			const leadServiceList = lead.custom_fields?.find((field) => Number(field.id || field.field_id) === CUSTOM_FIELDS_ID.LEAD.SERVICES.ID);

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
			}, { price: 0 });

			const totalPrice = priceReduce?.price ? priceReduce.price : 0;

			const updateDealDTO: UpdateDeal[] = [
				{
					id: Number(lead.id),
					price: totalPrice,
				},
			];

			if (Number(lead.price) !== updateDealDTO[0].price) {
				await this.api.updateDeals(updateDealDTO);

				const taskFilter: TaskFilter = {
					'filter[entity_id]': lead.id,
					'filter[entity_type]': AMO_ENTITYES.LEADS,
					'filter[is_completed]': 0,
					'filter[task_type]': TASKS.TASK_TYPES.CHECK,
				}

				const unComplitedTasks: any = await this.api.getTasks(10, 1, taskFilter);

				if (unComplitedTasks) {
					console.log(unComplitedTasks._embedded.tasks.length);
					return;
				}

				const createTaskDTO: CreateTaskDTO[] = [
					{
						entity_id: Number(lead.id),
						entity_type: AMO_ENTITYES.LEADS,
						task_type_id: TASKS.TASK_TYPES.CHECK,
						text: TASKS.TASK_VALUES.CHECK_PRICE,
						responsible_user_id: Number(lead.responsible_user_id),
						complete_till: Math.floor((new Date().getTime() / TIMESTAMP.MSEC_PER_SEC) + (TIMESTAMP.MSEC_PER_DAY / TIMESTAMP.MSEC_PER_SEC))
					}
				]

				await this.api.createTask(createTaskDTO);
			}
		});
		this.logger.debug('Сумма сделки изменена');
	}

	public async updateTask(tasks: UpdateTaskReq): Promise<void> {
		const taskList = tasks.task.update;

		const correctTasks = taskList.filter((task) => (Number(task.action_close) === 1 && Number(task.task_type) === TASKS.TASK_TYPES.CHECK && task.text === TASKS.TASK_VALUES.CHECK_PRICE && Number(task.element_type) === AMO_ENTITYES.TYPES_ID.LEADS));

		if (!correctTasks) {
			return;
		}

		correctTasks.forEach( async (task)=>{
			const createNoteDTO: CreateNoteDTO[] = [{
				note_type : NOTES.NOTE_TYPES.COMMON,
				params:{
					text: NOTES.NOTE_VALUES.PRIVE_CHECKED,
				}
			}]
	
			await this.api.createNote(createNoteDTO, AMO_ENTITYES.LEADS, task.element_id);

			this.logger.debug('Примечание созданно');
		})
	}
}

module.exports = new hooksService();
