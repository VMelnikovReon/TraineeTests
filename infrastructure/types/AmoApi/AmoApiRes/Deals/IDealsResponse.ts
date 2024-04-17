import { IDeal } from "./IDeal";

export interface IDealsResponse{
	_page:number;
	_links:{[key:string] : {href:string}};
	_embedded:{
		leads:IDeal[];
	}
}