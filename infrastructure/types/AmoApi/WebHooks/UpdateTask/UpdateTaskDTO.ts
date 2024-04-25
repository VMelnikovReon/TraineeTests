export enum ActionClose{
    Yes = 1,
    No = 0,
}

export type UpdateTaskDTO = {
    id: number;
    element_id: number;
    element_type: number;
    task_type: number;
    date_create: string;
    text: string;
    status: number;
    account_id: number;
    created_user_id: number;
    last_modified: Date;
    responsible_user_id: number;
    complete_till: Date;
    action_close: ActionClose;
    old_text: string;
    created_at: number;
    updated_at: number;
    complete_before: number;
}