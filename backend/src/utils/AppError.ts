export class AppError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode = 500) {
		super(message); // Set the error message
		this.statusCode = statusCode; // Set the HTTP status

		// Make instanceof AppError work even after transpiling
		Object.setPrototypeOf(this, AppError.prototype);

		// Keeps the correct error line in stack trace
		Error.captureStackTrace(this, this.constructor);
	}
}
