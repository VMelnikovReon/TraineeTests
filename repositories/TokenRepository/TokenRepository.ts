import { TokenRepositoryInterface } from "./TokenRepositoryInterface";
import logger from "../../infrastructure/logger";
import { Token, TokenModel, TokenSchema, UpdateTokenDTO } from "../../models/TokenSchema";

class TokenRepository implements TokenRepositoryInterface {

	public async updateToken(accountId:string, newData: UpdateTokenDTO) : Promise<void>{
		await TokenModel.updateOne({ account_id: accountId}, newData);
		logger.debug('токен обновлен');
	}

	public async checkToken(accountId:string) : Promise<boolean>{
		const token = await TokenModel.findOne({account_id: accountId});
		return Boolean(token);
	}

	public async createTokenEntity(token: Token) : Promise<void> {
		await new TokenModel(token).save();

		logger.debug("токен сохранен в бд");
	}
	public async deleteToken(accountId: string, newData: UpdateTokenDTO): Promise<void> {

		await this.updateToken(accountId, newData);

		logger.debug('токен удален');
	}
}

export default new TokenRepository();
