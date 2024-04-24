import {
	AMO_ENTITYES,
	CUSTOM_FIELDS_ID,
	TASK_TYPES,
} from "../../infrastructure/consts";
import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";
import { HookServiceInterface } from "./HookServiceInterface";
import { UpdateDealReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateDealReq";
import { Link } from "../../infrastructure/types/AmoApi/AmoApiReq/EntityLinks";
import { UpdateDeal } from "../../infrastructure/types/AmoApi/AmoApiReq/Update/UpdateDeal";
import Api from "../../api/api";
import logger from "../../infrastructure/logger";
import { TaskQueryParams } from "../../infrastructure/types/AmoApi/AmoApiReq/QueryParams/TasksQueryParams";
import { CreateTaskDTO } from "../../infrastructure/types/AmoApi/AmoApiReq/Create/CreateTaskDTO";
import { getDateInUtc } from "../../infrastructure/helpers/getDateInUTC";


class hooksService implements HookServiceInterface {
	private api = Api;
	private logger = logger;

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


	public async updateDeal(deals: UpdateDealReq): Promise<void> {

		for (const lead of deals.leads.update){
			const linkEntities: Link[] = await this.api.getLinkEntityes(
				'leads',
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
				'filter[task_type]' : TASK_TYPES.CHECK,
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
					task_type_id: TASK_TYPES.CHECK,
					text: 'Проверить бюджет',
					responsible_user_id: Number(lead.responsible_user_id),
					complete_till : getDateInUtc('in one day')
				}
			]

			await this.api.createTask(createTaskDTO);
			this.logger.debug('Таска создана');
		}
	}
}

export default new hooksService();
