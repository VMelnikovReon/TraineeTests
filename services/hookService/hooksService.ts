import {
	AMO_ENTITYES,
	CUSTOM_FIELDS_ID,
} from "../../infrastructure/consts";
import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";
import { HookServiceInterface } from "./HookServiceInterface";
import { UpdateDealReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateDealReq";
import { Link } from "../../infrastructure/types/AmoApi/AmoApiReq/EntityLinks";
import { UpdateDeal } from "../../infrastructure/types/AmoApi/AmoApiReq/Update/UpdateDeal";
import Api from "../../api/api";
import logger from "../../infrastructure/logger";


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
		}
	}
}

export default new hooksService();
