import type { ApiError } from '../http/api-client';

export function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as ApiError;
    return apiError.response?.data?.message || apiError.message || 'Unknown error';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}

export function extractFieldErrors(error: unknown): Record<string, string[]> | null {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as ApiError;

    // Se o backend retornar erros estruturados por campo
    if (apiError.response?.data?.error) {
      return apiError.response.data.error;
    }

    // Mapeia erros conhecidos para campos específicos
    // const message = apiError.response?.data?.message || apiError.message;

    // if (message?.includes('same name already exists')) {
    //   return { name: [message] }
    // }

    // if (message?.includes('same domain already exists')) {
    //   return { domain: [message] }
    // }
  }

  return null;
}
