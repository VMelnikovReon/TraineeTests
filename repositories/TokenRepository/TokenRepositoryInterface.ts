import { WidgetInstallReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { Token, UpdateTokenDTO } from "../../models/TokenSchema";

export interface TokenRepositoryInterface{
	updateToken: (clientId:string, newData: UpdateTokenDTO) => Promise<void>
	checkToken :(clientId:string) => Promise<string | null>
	createTokenEntity:(token: Token) => Promise<void>;
	deleteToken:(userId: string, newData: UpdateTokenDTO) => Promise<void>;
}