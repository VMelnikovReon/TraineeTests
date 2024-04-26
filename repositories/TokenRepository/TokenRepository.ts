import { TokenRepositoryInterface } from "./TokenRepositoryInterface";
import logger from "../../infrastructure/logger";
import { Token, TokenModel, TokenSchema, UpdateTokenDTO } from "../../models/TokenSchema";

class TokenRepository implements TokenRepositoryInterface {

	public async updateToken(clientId:string, newData: UpdateTokenDTO) : Promise<void>{
		await TokenModel.updateOne({ user_id: clientId}, newData);
		logger.debug('токен обновлен');
	}

	public async checkToken(clientId:string) : Promise<boolean>{
		const token = await TokenModel.findOne({user_id: clientId});
		return token ? true : false;
	}

	public async createTokenEntity(token: Token) : Promise<void> {
		await new TokenModel(token).save();

		logger.debug("токен сохранен в бд");
	}
	public async deleteToken(userId: string, newData: UpdateTokenDTO): Promise<void> {

		await this.updateToken(userId, newData);

		logger.debug('токен удален');
	}
}

export default new TokenRepository();
