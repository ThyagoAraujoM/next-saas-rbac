import ky from 'ky'
import { getCookie, type CookiesFn } from 'cookies-next'
import { env } from '@saas/env'

export interface ApiError extends Error {
  response?: {
    data: {
      message?: string
      error?: any
    }
    status: number
    statusText: string
  }
}

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let cookieStore: CookiesFn | undefined

        if (typeof window === 'undefined') {
          const { cookies: serverCookies } = await import('next/headers')
          cookieStore = serverCookies
        }

        const token = await getCookie('token', { cookies: cookieStore })

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    // beforeError: [
    //   async (error) => {
    //     const { response } = error;
    //     if (response) {
    //       try {
    //         // Tenta ler o corpo do erro como JSON
    //         const errorData = await response.clone().json();

    //         // Enriquece o erro com os dados do backend
    //         error.message = errorData.message || error.message;
    //         (error as any).response = {
    //           ...(error as any).response,
    //           data: errorData,
    //           status: response.status,
    //           statusText: response.statusText,
    //         };
    //       } catch {
    //         // Se não for JSON, tenta como texto
    //         const text = await response.clone().text();
    //         (error as any).response = {
    //           ...(error as any).response,
    //           data: text,
    //           status: response.status,
    //           statusText: response.statusText,
    //         };
    //       }
    //     }
    //     return error;
    //   },
    // ],
  },
})
