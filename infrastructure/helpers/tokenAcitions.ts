import { WidgetInstallReq } from "../types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";

const TOKEN_PATH = 'api/tokens/';
const fs = require('fs');

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
}

export const getToken = (user:string) : WidgetInstallReq=>{
    const token = fs.readFileSync(`${TOKEN_PATH}${user}.json`);
    return token;
}