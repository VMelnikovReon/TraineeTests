import {
	AMO_ENTITYES,
	CUSTOM_FIELDS_ID,
	MSEC_PER_SEC,
} from "../../infrastructure/consts";
import { ServiceError } from "../../infrastructure/errors/ServiceError";
import { calculateAge } from "../../infrastructure/helpers/calculateAge";
import { Contact } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/Contact";
import { HookServiceInterface } from "./HookServiceInterface";
import { UpdateContact } from "../../infrastructure/types/AmoApi/AmoApiReq/Update/UpdateContact";
import { makeField } from "../../infrastructure/utils";
import { UpdateContactRes } from "../../infrastructure/types/AmoApi/AmoApiRes/Contact/UpdateContactRes";
import { HttpStatusCode } from "axios";
import { UpdateDeakReq } from "../../infrastructure/types/AmoApi/WebHooks/UpdateDealReq";
import { Link } from "../../infrastructure/types/AmoApi/AmoApiReq/EntityLinks";
import { checkValueByEnumId } from "../../infrastructure/helpers/checkValueByEnumId";
import { UpdateDeal } from "../../infrastructure/types/AmoApi/AmoApiReq/Update/UpdateDeal";

class hooksService implements HookServiceInterface {
	private api = require("../../api/api");

	public async addContact(contact: Contact): Promise<boolean> {
		const customFields = contact.custom_fields || contact.custom_fields_values;

		console.log(customFields);

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
			Number(BirthdayDateCustomField.values[0]) * MSEC_PER_SEC
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

		const updateContactRes = await this.api.updateContacts(updateContactBody);

		return true;
	}

	public async updateDeal(deals: UpdateDeakReq): Promise<boolean> {
		deals.leads.update.forEach(async (lead) => {
			const linkEntityes: Link[] = await this.api.getLinkEntityes(
				AMO_ENTITYES.LEADS,
				lead.id
			);
			const contacts = linkEntityes.filter(
				(link) => link.to_entity_type === AMO_ENTITYES.CONTACTS
			);

			let mainContact = null;

			switch (contacts.length) {
				case 0:
					return;
				case 1:
					mainContact = contacts[0];
					break;
				default:
					mainContact = contacts.find(
						(contact) => contact.metadata?.main_contact === true
					);
					break;
			}

			const contactFullInfo: Contact = await this.api.getContact(
				mainContact?.to_entity_id
			);

			const customFields = contactFullInfo.custom_fields_values;

			if (!customFields) {
				throw new Error("кастомное поле не найдено");
			}

			const ultrasonikLiftingField = customFields.find(
				(field) =>
					(field.id || field.field_id) ===
					CUSTOM_FIELDS_ID.CONTACT.ULTRASONIC_LIFTING
			);
			const lazerRejuvenationField = customFields.find(
				(field) =>
					(field.id || field.field_id) ===
					CUSTOM_FIELDS_ID.CONTACT.LAZER_REJUVENATION
			);
			const lazerRemovalField = customFields.find(
				(field) =>
					(field.id || field.field_id) ===
					CUSTOM_FIELDS_ID.CONTACT.LAZER_REMOVAL
			);
			const correctionOfFacialWrinklesField = customFields.find(
				(field) =>
					(field.id || field.field_id) ===
					CUSTOM_FIELDS_ID.CONTACT.CORRECTION_OF_FACIAL_WRINKLES
			);
			const lazerHairRemovalField = customFields.find(
				(field) =>
					(field.id || field.field_id) ===
					CUSTOM_FIELDS_ID.CONTACT.LAZER_HAIR_REMOVAL
			);

			const contactPriceInfo: { [key: string]: number } = {
				ultrasonikLifting:
					typeof ultrasonikLiftingField?.values[0] === "object"
						? Number(ultrasonikLiftingField.values[0].value)
						: 0,
				lazerRejuvenation:
					typeof lazerRejuvenationField?.values[0] === "object"
						? Number(lazerRejuvenationField.values[0].value)
						: 0,
				lazerRemoval:
					typeof lazerRemovalField?.values[0] === "object"
						? Number(lazerRemovalField.values[0].value)
						: 0,
				correctionOfFacialWrinkles:
					typeof correctionOfFacialWrinklesField?.values[0] === "object"
						? Number(correctionOfFacialWrinklesField.values[0].value)
						: 0,
				lazerHairRemoval:
					typeof lazerHairRemovalField?.values[0] === "object"
						? Number(lazerHairRemovalField.values[0].value)
						: 0,
			};

			let totalPrice = 0;

			if (lead.custom_fields) {
				const leadServicesList = lead.custom_fields.find(
					(field) =>
						Number(field.id || field.field_id) ===
						CUSTOM_FIELDS_ID.LEAD.SERVICES.ID
				);

				if (leadServicesList) {
					const leadServices: { [key: string]: boolean } = {
						ultrasonikLifting: checkValueByEnumId(
							leadServicesList,
							CUSTOM_FIELDS_ID.LEAD.SERVICES.ULTRASONIC_LIFTING
						),
						lazerRejuvenation: checkValueByEnumId(
							leadServicesList,
							CUSTOM_FIELDS_ID.LEAD.SERVICES.LAZER_REJUVENATION
						),
						lazerRemoval: checkValueByEnumId(
							leadServicesList,
							CUSTOM_FIELDS_ID.LEAD.SERVICES.LAZER_REMOVAL
						),
						correctionOfFacialWrinkles: checkValueByEnumId(
							leadServicesList,
							CUSTOM_FIELDS_ID.LEAD.SERVICES.CORRECTION_OF_FACIAL_WRINKLES
						),
						lazerHairRemoval: checkValueByEnumId(
							leadServicesList,
							CUSTOM_FIELDS_ID.LEAD.SERVICES.LAZER_HAIR_REMOVAL
						),
					};

					for (let service in contactPriceInfo) {
						if (
							leadServices.hasOwnProperty(service) &&
							contactPriceInfo.hasOwnProperty(service) &&
							leadServices[service]
						) {
							totalPrice += Number(contactPriceInfo[service]);
						}
					}
				}
			}

			const updateDealDTO: UpdateDeal[] = [
				{
					id: Number(lead.id),
					price: totalPrice,
				},
			];

			if (Number(lead.price) !== updateDealDTO[0].price) {
				await this.api.updateDeals(updateDealDTO);
			}
		});

		return true;
	}
}

module.exports = new hooksService();
