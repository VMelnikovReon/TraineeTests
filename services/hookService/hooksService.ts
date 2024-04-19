import { CUSTOM_FIELDS_ID, MSEC_PER_SEC } from "../../infrastructure/consts";
import { ServiceError } from "../../infrastructure/errors/ServiceError";
import { calculateAge } from "../../infrastructure/helpers/calculateAge";
import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";
import { HookServiceInterface } from "./HookServiceInterface";
import { UpdateContact } from "../../infrastructure/types/AmoApi/AmoApiReq/Update/UpdateContact";
import { makeField } from "../../infrastructure/utils";
import { UpdateContactRes } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/UpdateContactRes";
import { HttpStatusCode } from "axios";



class hooksService implements HookServiceInterface {
	private readonly api = require('../../api/api');

	public async addContact(contact: Contact) : Promise<boolean> {
		const BirthdayDateCustomField = contact.custom_fields.find(
			(field) =>
				Number(field.field_id || field.id) === CUSTOM_FIELDS_ID.BIRTHDAY_DATE
		);

		if (!BirthdayDateCustomField) {
			throw ServiceError.BadRequest("отсутствует поле с датой");
		}

		if (typeof Number(BirthdayDateCustomField.values[0]) !== "number") {
			throw ServiceError.BadRequest("поле с датой имеет не правильный тип");
		}

		const birthdayDate = new Date(
			Number(BirthdayDateCustomField.values[0]) * MSEC_PER_SEC
		);

		const age = calculateAge(birthdayDate);

		const newAgeField = makeField(CUSTOM_FIELDS_ID.BIRTHDAY_DATE, age, 1)
		
		if (!newAgeField){
			throw new Error();
		}
		
		const updateContactBody : UpdateContact[] = [{
			id: Number(contact.id),
			custom_fields_values:[
				{
					field_id: CUSTOM_FIELDS_ID.AGE,
					values:[
						{value:String(age)}
					]
				}
		]
		}]

		const updateContactRes = await this.api.updateContacts(updateContactBody);

		return true;
	}
}

module.exports = new hooksService();
