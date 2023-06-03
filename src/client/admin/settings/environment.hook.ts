import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Environment } from "@/common/db.type"

interface EnvironmentEdit {
  environment: Environment
  edit: (newEnv: Environment) => void
}

export function useEnvironment(initialEnvironment?: Environment): EnvironmentEdit {
  const queryClient = useQueryClient()

  const { data } = useQuery(
    ["env"],
    async () => {
      const res = await fetch("/api/env")
      if (!res.ok) throw new Error("Failed to fetch env")

      return res.json()
    },
    {
      initialData: initialEnvironment ?? {
        telegramUrl: "",
      },
    }
  )

  const { mutate } = useMutation(
    async (newEnv: Environment) => {
      const res = await fetch(`/api/env`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEnv),
      })

      if (!res.ok) throw new Error("Failed to update env")
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["env"])
      },
    }
  )

  return {
    environment: data,
    edit: mutate,
  }
}
