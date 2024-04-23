export const CUSTOM_FIELDS_ID = {
	CONTACT:{
		ULTRASONIC_LIFTING: 878645,
		LAZER_REJUVENATION: 878647,
		LAZER_REMOVAL: 878697,
		CORRECTION_OF_FACIAL_WRINKLES: 878747,
		LAZER_HAIR_REMOVAL: 878797
	},
	LEAD:{
		SERVICES:{
			ID: 878863,
			ULTRASONIC_LIFTING: 459079,
			LAZER_REJUVENATION: 459077,
			LAZER_REMOVAL: 459081,
			CORRECTION_OF_FACIAL_WRINKLES: 459083,
			LAZER_HAIR_REMOVAL: 459085
		}
	}
	
	
};

export const NOTES = {
	NOTE_TYPES:{
		COMMON:'common',
		CALL_IN:'call_in',
		CALL_OUT:'call_out',
		SERVICE_MESSAGE:'service_message',
		EXTENDED_SERVICE_MESSAGE:'extended_service_message',
		MESSAGE_CACHIER:'message_cashier',
		GEOLOCATION:'geolocation',
		SMS_IN:'sms_in',
		SMS_OUT:'sms_out',
		ATTACHMENT:'attachment',
	},
	NOTE_VALUES: {
		PRIVE_CHECKED: 'Бюджет проверен, ошибок нет',
	}
}

export const TASKS = {
	TASK_TYPES :{
		CHECK: 3354374
	},
	TASK_VALUES:{
		CHECK_PRICE: 'Проверить бюджет'
	}
}

export const ROUTES = {
	HOOKS: {
		HOME_ROUTE: '/hooks',
		UPDATE_DEAL_ROUTE : '/updatedeal',
		UPDATE_TASK_ROUTE : '/updatetask'
	},
	PING_ROUTE: '/ping'
}

export const ERRORS = {
	VALIDATION_ERRORS: "validation-errors",
}

export const AMO_ENTITYES = {
	CONTACTS: 'contacts',
	LEADS : 'leads',
	TYPES_ID :{
		LEADS : 2,
	}
}

export const TIMESTAMP = {
	MSEC_PER_SEC: 1000,
	MSEC_PER_MIN : 1000*60,
	MSEC_PER_HOUR : 1000*60*60,
	MSEC_PER_DAY : 1000*60*60*24
}