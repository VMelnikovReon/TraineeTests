import { HttpStatusCode } from "axios";

export class ServiceError extends Error {
	public status: HttpStatusCode;

	constructor(message: string, status: HttpStatusCode) {
		super(message);
		this.status = status;
	}

	public static BadRequest(message: string) {
		return new ServiceError(message, HttpStatusCode.BadRequest);
	}

	public static NotFound(message: string) {
		return new ServiceError(message, HttpStatusCode.NotFound);
	}

	public static Unauthorized(message: string) {
		return new ServiceError(message, HttpStatusCode.Unauthorized);
	}

	public static Forbidden(message: string) {
		return new ServiceError(message, HttpStatusCode.Forbidden);
	}
}
