import { AttachmentParams } from "./NotesParam/AttachmentParams";
import { CallParams } from "./NotesParam/CallParams";
import { CommonParams } from "./NotesParam/CommonParams";
import { GeolocationParams } from "./NotesParam/GeolocationParams";
import { MessageParams } from "./NotesParam/MessageParams";
import { SmsParams } from "./NotesParam/SmsParams";

export type CreateNoteDTO = {
    entity_id?: number;
    created_by?: number;
    note_type?: string;
    params?: AttachmentParams | CallParams | CommonParams | GeolocationParams | MessageParams | SmsParams;
    request_id?: string;
    is_need_to_trigger_digital_pipeline?: boolean;
}