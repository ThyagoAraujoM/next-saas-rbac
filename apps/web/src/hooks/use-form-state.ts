'use client'

import { startTransition, useActionState, useEffect, useState, type SubmitEvent } from 'react'
import { signInWithEmailAndPassword } from '../app/auth/sign-in/actions'

type useFormStateProps = {
  action: (_: any, data: FormData) => Promise<FormState>
  initialState: FormState
}

type FormState = {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null | undefined
}

export function useFormState({ action, initialState }: useFormStateProps): {
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void
  formState: FormState
  isPedding: boolean
} {
  const [formState, formAction, isPedding] = useActionState(action, initialState)

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => {
      formAction(formData)
    })
  }

  return { handleSubmit, formState, isPedding }
}
