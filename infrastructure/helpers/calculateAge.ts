export const calculateAge = (birthdayDate:Date) : number=>{
console.log(birthdayDate)

	const currentDate = new Date();

	const age = currentDate.getFullYear() - birthdayDate.getFullYear();

	const currentMonth = currentDate.getMonth();
	const birthMonth = birthdayDate.getMonth();
	const currentDay = currentDate.getDate();
	const birthDay = birthdayDate.getDate();

	
	if (age < 0){
		return 0;
	}

	if (
		currentMonth < birthMonth ||
		(currentMonth === birthMonth && currentDay < birthDay)
	) {
		return age - 1;
	}

	return age;
}