import { WidgetInstallReq } from "../types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";

const TOKEN_PATH = 'api/tokens/';
const fs = require('fs');

export const saveToken = (userInfo:) : void=>{
    if (!fs.existsSync(TOKEN_PATH)) {
        fs.mkdirSync(TOKEN_PATH, { recursive: true });
    }

    fs.writeFileSync(`${TOKEN_PATH}${userInfo.client_id}.json`,JSON.stringify(userInfo));
}

export const getToken = (user:string) : WidgetInstallReq=>{
    const token = fs.readFileSync(`${TOKEN_PATH}${user}.json`);
    return token;
}