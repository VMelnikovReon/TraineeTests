import { WidgetInstallReq } from "../types/AmoApi/AmoApiReq/Widget/WidgetInstallReq";

const TOKEN_PATH = 'api/tokens/';
const fs = require('fs');

export const saveToken = (userInfo:WidgetInstallReq)=>{
    if (!fs.existsSync(TOKEN_PATH)) {
        // Если не существует, создаем ее
        fs.mkdirSync(TOKEN_PATH, { recursive: true });
    }

    fs.writeFileSync(`${TOKEN_PATH}${userInfo.client_id}.json`,JSON.stringify(userInfo));
}

export const getToken = (user:string) : string=>{
    const token = fs.readFileSync(TOKEN_PATH + user);
    return token;
}