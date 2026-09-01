export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const errors = {
  badRequest: (message = "Invalid appointment information.") => new AppError(400, message),
  unauthorized: () => new AppError(401, "Please log in to continue."),
  forbidden: () => new AppError(403, "You do not have permission to access this information."),
  notFound: (message = "Not found.") => new AppError(404, message),
  conflict: (message = "This appointment slot is already booked.") => new AppError(409, message),
  server: () => new AppError(500, "Something went wrong. Please try again."),
};

export function errorMessage(error: unknown) {
  if (error instanceof AppError) return error.message;
  return "Something went wrong. Please try again.";
}
