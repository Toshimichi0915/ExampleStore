import { Button } from "@mui/material"
import { memo, useCallback } from "react"
import { signOut } from "next-auth/react"
import { css } from "@emotion/react"

export const SettingsSignOut = memo(function SettingsSignOut({ className }: { className?: string }) {
  const logout = useCallback(() => signOut(), [])

  return (
    <section className={className} css={settingsSignOutStyles}>
      <h2 className="SettingsSignOut-Title">Sign Out</h2>
      <Button onClick={logout}>Click to Sign Out</Button>
    </section>
  )
})

function settingsSignOutStyles() {
  return css`
    & .SettingsSignOut-Title {
      margin: 8px 0;
    }
  `
}
