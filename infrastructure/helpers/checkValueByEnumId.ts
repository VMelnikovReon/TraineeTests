import { CustomField, CustomValue } from "../types/AmoApi/CustomField";

export const checkValueByEnumId = (field: CustomField, enum_id:number) : boolean =>{
	if (field.values.find((listItem)=>typeof listItem === 'object' && (Number(listItem.enum || listItem.enum_id)) === enum_id)){
		return true;
	}
	return false;
}