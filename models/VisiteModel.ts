import { Schema, model } from "mongoose";

export interface Visite{
	_id: string,
    client: string,
    plannedDateTime: { type: Date, required: true },
    actualDateTime: { type: Date },
    status: { type: String, enum: ['planned', 'visited', 'cancelled'], required: true },
    services: [{ type: String, ref: 'Service' }],
    totalCost: { type: Number }
}

export const VisiteScheme = new Schema<Visite>({
	_id: { type: String, required: true },
    client: { type: String, ref: 'Client', required: true },
    plannedDateTime: { type: Date, required: true },
    actualDateTime: { type: Date },
    status: { type: String, enum: ['planned', 'visited', 'cancelled'], required: true },
    services: [{ type: String, ref: 'Service' }],
    totalCost: { type: Number }
})

export const VisiteModel = model<Visite>('Visite', VisiteScheme);