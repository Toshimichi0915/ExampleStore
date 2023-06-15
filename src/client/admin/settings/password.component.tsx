import { ChangeEvent, memo, useCallback, useState } from "react"
import { usePassword } from "@/client/admin/settings/password.hook"
import { Button, TextField } from "@mui/material"
import { css } from "@emotion/react"

export const SettingsPassword = memo(function SettingsPassword({ className }: { className?: string }) {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const { update, successMessage, errorMessage } = usePassword()

  const changeOldPassword = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setOldPassword(event.target.value),
    []
  )

  const changeNewPassword = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value),
    []
  )
  const updatePassword = useCallback(() => update(oldPassword, newPassword), [update, oldPassword, newPassword])

  return (
    <section className={className} css={settingsPasswordStyles}>
      <h2 className="SettingsPassword-Title">Password</h2>
      <div className="SettingsPassword-Form">
        {successMessage && <p className="SettingsPassword-FormSuccess">{successMessage}</p>}
        {errorMessage && <p className="SettingsPassword-FormError">{errorMessage}</p>}
        <TextField label="Old Password" type="password" value={oldPassword} onChange={changeOldPassword} />
        <TextField label="New Password" type="password" value={newPassword} onChange={changeNewPassword} />
        <Button onClick={updatePassword}>Click To Change</Button>
      </div>
    </section>
  )
})

export function settingsPasswordStyles() {
  return css`
    & .SettingsPassword-Title {
      margin: 8px 0;
    }

    & .SettingsPassword-Form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    & .SettingsPassword-FormSuccess {
      color: #4caf50;
      margin: 0;
    }

    & .SettingsPassword-FormError {
      color: red;
      margin: 0;
    }
  `
}
