import { WidgetInstallReq } from "../../infrastructure/types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import { TokenRepositoryInterface } from "./TokenRepositoryInterface";
import logger from "../../infrastructure/logger";
import { Token, TokenModel, TokenSchema, UpdateTokenDTO } from "../../models/TokenSchema";
import { ServiceError } from "../../infrastructure/errors/ServiceError";
import { debug } from "console";

class TokenRepository implements TokenRepositoryInterface {

	public async updateToken(clientId:string, newData: UpdateTokenDTO) : Promise<void>{
		await TokenModel.updateOne({ user_id: clientId}, newData);
	}

	public async checkToken(clientId:string) : Promise<string | null>{
		const token = await TokenModel.findOne({user_id: clientId});
		return token ? token.refresh_token : null;
	}

	public async createTokenEntity(token: Token) : Promise<void> {
		await new TokenModel(token).save();

		logger.debug("токен сохранен в бд");
	}
	public async deleteToken(userId: string, newData: UpdateTokenDTO): Promise<void> {
		const tokenEntity = await TokenModel.findOne({user_id:userId});

		if (!tokenEntity){
			throw ServiceError.NotFound('токен не найден');
		}

		await this.updateToken(userId, newData);

		logger.debug('токен удален');
	}
}

export default new TokenRepository();
