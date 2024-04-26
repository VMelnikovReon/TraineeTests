import logger from "../logger";
import { WidgetInstallReq } from "../types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";
import fs from 'fs';

const TOKEN_PATH = 'api/tokens/';

type tokenData = {
    userId:string,
    acces_token:string,
    refresh_token:string
}

export const saveToken = (userInfo: tokenData) : void=>{
    if (!fs.existsSync(TOKEN_PATH)) {
        fs.mkdirSync(TOKEN_PATH, { recursive: true });
    }

    fs.writeFileSync(`${TOKEN_PATH}${userInfo.userId}.json`,JSON.stringify(userInfo));
    logger.debug('токен сохранен')
}

export const deleteToken = (userId:string) : void=>{
    fs.unlink(`${TOKEN_PATH}${userId}.json`, (err) => {
        if (err) {
          logger.debug('ошибка при удалении токена')
          return;
        }
        logger.debug('токен удален')
    })
}