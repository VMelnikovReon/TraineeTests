import { Deal } from "./Deal";

export type DealsResponse = {
	_page: number;
	_links: { [key: string]: { href: string } };
	_embedded: {
		leads: Deal[];
	};
}
