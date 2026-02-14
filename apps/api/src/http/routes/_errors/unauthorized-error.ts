export class UnauthorizedError extends Error {
  constructor(mensage?: string) {
    super(mensage || 'Unauthorized')
  }
}
