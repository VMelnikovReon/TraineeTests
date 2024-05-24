import mongoose, {Schema, model, ObjectId} from "mongoose";

export enum visiteStatus{
    planned = 'planned',
    visited = 'visited',
    cancelled = 'cancelled'
}

export interface Visite{
	_id: string,
    client: ObjectId,
    plannedDateTime: Date,
    actualDateTime: Date,
    status: visiteStatus,
    services: string[],
    totalCost: number
}

export const VisiteScheme = new Schema<Visite>({
    client: { type: mongoose.Types.ObjectId, ref: 'Client', required: true },
    plannedDateTime: { type: Date, required: true },
    actualDateTime: { type: Date },
    status: { type: String, enum: visiteStatus, required: true },
    services: [{ type: mongoose.Types.ObjectId, ref: 'Service' }],
    totalCost: { type: Number }
})

export const VisiteModel = model<Visite>('Visite', VisiteScheme);