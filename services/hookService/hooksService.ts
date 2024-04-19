import { CUSTOM_FIELDS_ID, MSEC_PER_SEC } from "../../infrastructure/consts";
import { ServiceError } from "../../infrastructure/errors/ServiceError";
import { calculateAge } from "../../infrastructure/helpers/calculateAge";
import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";
import { HookServiceInterface } from "./HookServiceInterface";

class hooksService implements HookServiceInterface {
	public addContact(contact: Contact) {
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

		return age;
	}
}

module.exports = new hooksService();
