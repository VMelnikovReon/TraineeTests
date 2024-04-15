import { IContact } from "../types/AmoApi/AmoApiRes/Contact/IContact";
import { IHookService } from "../types/Services/IHookService";

const hooksService : IHookService = {
	calculateAge: (contact:IContact) =>{
		console.log(contact);
		const dateField = contact.custom_fields.find(e=>e.name === "Дата рождения");
		if (!dateField){
			console.log("Поле с датой не найдено");
			return;
		}

		const currentDate = new Date();
		const birthdayDate = new Date(dateField.values[0] * 1000);
		
		let age = currentDate.getFullYear() - birthdayDate.getFullYear();
		
		const currentMonth = currentDate.getMonth();
		const birthMonth = birthdayDate.getMonth();
		const currentDay = currentDate.getDate();
		const birthDay = birthdayDate.getDate();
		
		if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
			age--;
		}
		
		return age;
	}
};

module.exports = hooksService;