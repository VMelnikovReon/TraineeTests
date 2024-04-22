export type Link = {
	to_entity_id: number;
	to_entity_type: string;
	metadata:{
		main_contact:boolean;
	} | null;
}

export type EntityLinksDTO = {
	_total_items:  4;
	_links:{
		self:{
			href:string;
		}
	},
	_embedded:{
		links:Link[];
	}
}