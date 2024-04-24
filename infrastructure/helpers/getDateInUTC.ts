import { TIMESTAMP } from "../consts"

export const getDateInUtc = (date:'in one day' | 'in one hour' | 'in one week') : number =>{
	switch(date){
		case 'in one day':
			return Math.floor((new Date().getTime() / TIMESTAMP.MSEC_PER_SEC) + (TIMESTAMP.MSEC_PER_DAY / TIMESTAMP.MSEC_PER_SEC));
		case 'in one hour':
			return Math.floor((new Date().getTime() / TIMESTAMP.MSEC_PER_SEC) + (TIMESTAMP.MSEC_PER_HOUR / TIMESTAMP.MSEC_PER_SEC));
		case 'in one week':
			return Math.floor((new Date().getTime() / TIMESTAMP.MSEC_PER_SEC) + (TIMESTAMP.MSEC_PER_DAY / TIMESTAMP.MSEC_PER_SEC * 7));
	}
}