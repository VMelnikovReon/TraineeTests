import { Account } from "../../AmoApiRes/Account/Account"
import { UpdateTaskDTO } from "./UpdateTaskDTO"

export type UpdateTaskReq = {
    account: Account,
    task:{
        update:UpdateTaskDTO[];
    }
}