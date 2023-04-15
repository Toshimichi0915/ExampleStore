import { useMutation } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import { PasswordInput } from "@/common/password.type"

export interface Password {
  update(oldPassword: string, newPassword: string): void

  updating: boolean
  successMessage: string
  errorMessage: string
}

export function usePassword(): Password {

  const [ successMessage, setSuccessMessage ] = useState("")
  const [ errorMessage, setErrorMessage ] = useState("")

  const { mutate, isLoading } = useMutation(async ({ oldPassword, newPassword }: {
    oldPassword: string,
    newPassword: string
  }) => {

    const value: PasswordInput = { oldPassword, newPassword }

    const response = await fetch("/api/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    })
    if (!response.ok) throw new Error(`Failed to update password: ${response.statusText}`)
  }, {

    onMutate() {
      setSuccessMessage("")
      setErrorMessage("")
    },

    onSuccess() {
      setSuccessMessage("Password updated successfully")
    },

    onError() {
      setErrorMessage("Old password is incorrect")
    },
  })

  const update = useCallback((oldPassword: string, newPassword: string) => {
    mutate({ oldPassword, newPassword })
  }, [ mutate ])

  return useMemo(() => ({
    update,
    updating: isLoading,
    successMessage,
    errorMessage,
  }), [ errorMessage, isLoading, successMessage, update ])
}
