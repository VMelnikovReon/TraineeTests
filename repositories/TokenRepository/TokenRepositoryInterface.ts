import { Token, UpdateTokenDTO } from "../../models/TokenSchema";

export interface TokenRepositoryInterface{
	updateToken: (clientId:string, newData: UpdateTokenDTO) => Promise<void>
	checkToken :(clientId:string) => Promise<true | false>
	createTokenEntity:(token: Token) => Promise<void>;
	deleteToken:(userId: string, newData: UpdateTokenDTO) => Promise<void>;
}