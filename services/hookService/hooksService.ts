import {
	AMO_ENTITYES,
	CUSTOM_FIELDS_ID,
	NOTES,
	TASKS,
} from "../../infrastructure/consts";
import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";
import { HookServiceInterface } from "./HookServiceInterface";
import { Link } from "../../infrastructure/types/AmoApi/AmoApiReq/EntityLinks";
import { UpdateDeal } from "../../infrastructure/types/AmoApi/AmoApiReq/Update/UpdateDeal";
import Api from "../../api/api";
import logger from "../../infrastructure/logger";
import { TaskQueryParams } from "../../infrastructure/types/AmoApi/AmoApiReq/QueryParams/TasksQueryParams";
import { getDateInUtc } from "../../infrastructure/helpers/getDateInUTC";
import { CreateTaskDTO } from "../../infrastructure/types/AmoApi/AmoApiReq/Create/CreateTask";
import { UpdateTaskReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateTask/UpdateTaskReq";
import { CreateNoteDTO } from "../../infrastructure/types/AmoApi/AmoApiReq/Create/CreateNotes/CreateNoteDTO";
import { UpdateDealReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateDeal/UpdateDealReq";
import { ActionClose } from "../../infrastructure/types/AmoApi/WebHooks/UpdateTask/UpdateTaskDTO";
import { TargetEntity } from "../../infrastructure/types/AxiosDTOs/Links/targetEntity";


class hooksService implements HookServiceInterface {
	private api = Api;
	private logger = logger;

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

		for (const lead of deals.leads.update){
			const linkEntities: Link[] = await this.api.getLinkEntityes(
				TargetEntity.leads,
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

			const totalPrice = leadServiceList?.values.reduce((summ: number, field) : number => {
				
				const serviceName = typeof field === 'object' && field.value
				const servicePriceField = customFields?.find((field) => (field.name || field.field_name) === serviceName);
				if (servicePriceField && typeof servicePriceField.values[0] === 'object') {
					const servicePrice = Number(servicePriceField.values[0].value);
					summ += servicePrice;
					return summ;
				} 
				return summ;
			}, 0);

			if (Number(lead.price) === totalPrice){
				this.logger.debug('Сумма не изменилась');
				return;
			}

			const updateDealDTO: UpdateDeal[] = [
				{
					id: Number(lead.id),
					price: totalPrice,
				},
			];

			await this.api.updateDeals(updateDealDTO);
			this.logger.debug('Сумма сделки изменена');

			const taskFilter : TaskQueryParams = {
				page:1,
				limit:10,
				'filter[entity_id]': lead.id,
				'filter[entity_type]' : AMO_ENTITYES.LEADS,
				'filter[is_completed]' : 0,
				'filter[task_type]' : TASKS.TASK_TYPES.CHECK,
			}
			
			const unComplitedTasks = await this.api.getTasks(taskFilter);
			
			if (unComplitedTasks){
				this.logger.debug('не требуется создавать задачу');
				return;
			}

			const createTaskDTO : CreateTaskDTO[] = [
				{
					entity_id : Number(lead.id),
					entity_type: AMO_ENTITYES.LEADS,
					task_type_id: TASKS.TASK_TYPES.CHECK,
					text: 'Проверить бюджет',
					responsible_user_id: Number(lead.responsible_user_id),
					complete_till : getDateInUtc('in one day')
				}
			]

			await this.api.createTask(createTaskDTO);
			this.logger.debug('Таска создана');
		}
	}

	public async updateTask(tasks: UpdateTaskReq): Promise<void> {
		const taskList = tasks.task.update;

		const correctTasks = taskList.filter((task) => (Number(task.action_close) === ActionClose.Yes && Number(task.task_type) === TASKS.TASK_TYPES.CHECK && task.text === TASKS.TASK_VALUES.CHECK_PRICE && Number(task.element_type) === AMO_ENTITYES.TYPES_ID.LEADS));

		if (correctTasks.length === 0) {
			return;
		}


		const task = correctTasks[0];
		const createNoteDTO: CreateNoteDTO[] = [{
			note_type : NOTES.NOTE_TYPES.COMMON,
			params:{
				text: NOTES.NOTE_VALUES.PRIVE_CHECKED,
			}
		}]

		await this.api.createNote(createNoteDTO, AMO_ENTITYES.LEADS, task.element_id);

		this.logger.debug('Примечание созданно');
	}
}

export default new hooksService();
