'use client'

import { startTransition, useActionState, useEffect, type SubmitEvent } from 'react'
import { requestFormReset } from 'react-dom'

type useFormStateProps = {
  action: (_: any, data: FormData) => Promise<FormState>
  initialState: FormState
  onSuccess?: () => Promise<void> | null
}

type FormState = {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null | undefined
}

export function useFormState({ action, initialState, onSuccess }: useFormStateProps): {
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void
  formState: FormState
  isPedding: boolean
} {
  const [formState, formAction, isPedding] = useActionState(action, initialState)

  useEffect(() => {
    if (formState.success && onSuccess) {
      onSuccess()
    }
  }, [formState, onSuccess])

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    const form = event.currentTarget
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => {
      formAction(formData)
      requestFormReset(form)
    })
  }

  return { handleSubmit, formState, isPedding }
}
