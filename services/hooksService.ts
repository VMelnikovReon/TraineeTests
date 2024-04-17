import { CUSTOM_FIELD_NAMES } from "../infrastructure/apiConsts";
import { IContact } from "../infrastructure/types/AmoApi/AmoApiRes/Contact/IContact";
import { IHookService } from "../infrastructure/types/Services/IHookService";

const hooksService: IHookService = {
	calculateAge: (contact: IContact) => {
		const BirthdayDateCustomField = contact.custom_fields.find(
			(e) => e.name === CUSTOM_FIELD_NAMES.BIRTHDAY_DATE
		);
		if (!BirthdayDateCustomField) {
			console.log("Поле с датой не найдено");
			return;
		}

		const currentDate = new Date();
		const birthdayDate = new Date(BirthdayDateCustomField.values[0] * 1000);

		let age = currentDate.getFullYear() - birthdayDate.getFullYear();

		const currentMonth = currentDate.getMonth();
		const birthMonth = birthdayDate.getMonth();
		const currentDay = currentDate.getDate();
		const birthDay = birthdayDate.getDate();

		if (
			currentMonth < birthMonth ||
			(currentMonth === birthMonth && currentDay < birthDay)
		) {
			age--;
		}

		return age;
	},
};

module.exports = hooksService;
