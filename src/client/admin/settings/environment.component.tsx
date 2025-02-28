import { useEnvironment } from "@/client/admin/settings/environment.hook"
import { ChangeEvent, memo, useCallback, useState } from "react"
import { Environment } from "@/common/db.type"
import { Button, TextField, Theme } from "@mui/material"
import { css } from "@emotion/react"
import { Editor, EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"

export const SettingsEnvironment = memo(function SettingsEnvironment({
  environment: initialEnvironment,
  className,
}: {
  environment: Environment
  className?: string
}) {
  const { environment, edit } = useEnvironment(initialEnvironment)

  // channel
  const [channelUrl, setChannelUrl] = useState(environment.channelUrl)
  const changeChannelUrl = useCallback((event: ChangeEvent<HTMLInputElement>) => setChannelUrl(event.target.value), [])

  // mail
  const [email, setEmail] = useState(environment.email)
  const changeEmail = useCallback((event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value), [])

  // news
  const [campaign, setCampaign] = useState(environment.campaign ?? "")
  const changeCampaign = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setCampaign(event.target.value ?? ""),
    []
  )

  // tos
  const editor = useEditor({
    extensions: [StarterKit],
    content: environment.termsOfService,
  })

  const newTosButtonClassName = (lambda: (editor: Editor) => boolean) => {
    const classNames = ["SettingsEnvironment-TosButton"]
    if (editor && lambda(editor)) {
      classNames.push("SettingsEnvironment-TosButtonActive")
    }

    return classNames.join(" ")
  }

  const pClassName = newTosButtonClassName((editor) => editor.isActive("paragraph"))
  const onPClick = useCallback(() => editor?.chain().focus().setParagraph().run(), [editor])

  const h1ClassName = newTosButtonClassName((editor) => editor.isActive("heading", { level: 1 }))
  const onH1Click = useCallback(() => editor?.chain().focus().toggleHeading({ level: 1 }).run(), [editor])

  const h2ClassName = newTosButtonClassName((editor) => editor.isActive("heading", { level: 2 }))
  const onH2Click = useCallback(() => editor?.chain().focus().toggleHeading({ level: 2 }).run(), [editor])

  // save mechanism
  const updateEnvironment = useCallback(() => {
    edit({
      ...environment,
      channelUrl,
      email,
      campaign: campaign || "",
      termsOfService: editor?.getJSON(),
    })
  }, [edit, environment, channelUrl, email, campaign, editor])

  return (
    <section className={className} css={settingsEnvironmentStyles}>
      <h2 className="SettingsEnvironment-Title">Environment</h2>
      <TextField label="Channel URL" type="text" value={channelUrl} onChange={changeChannelUrl} />
      <TextField label="Email" type="text" value={email} onChange={changeEmail} />
      <TextField label="Campaign" type="text" value={campaign} onChange={changeCampaign} />
      <div className="SettingsEnvironment-Tos">
        {editor && (
          <>
            <div className="SettingsEnvironment-TosMenu">
              <p className="SettingsEnvironment-TosTitle">Terms of Service</p>
              <div className="SettingsEnvironment-TosButtons">
                <button className={pClassName} onClick={onPClick}>
                  p
                </button>
                <button className={h1ClassName} onClick={onH1Click}>
                  h1
                </button>
                <button className={h2ClassName} onClick={onH2Click}>
                  h2
                </button>
              </div>
            </div>
            <div className="SettingsEnvironment-TosBodyContainer">
              <EditorContent className="SettingsEnvironment-TosBody" editor={editor} />
            </div>
          </>
        )}
      </div>
      <Button onClick={updateEnvironment}>Click To Change</Button>
    </section>
  )
})

function settingsEnvironmentStyles(theme: Theme) {
  return css`
    display: flex;
    flex-direction: column;
    gap: 10px;

    & .SettingsEnvironment-Title {
      margin: 8px 0;
    }

    & .SettingsEnvironment-Tos {
      border: 1px solid ${theme.palette.border.paper};
      border-radius: 4px;
      padding: 8px;

      transition: border 0.2s ease-in-out;

      &:focus-within {
        border: 1px solid ${theme.palette.primary.main};
        box-shadow: 0 0 0 1px ${theme.palette.primary.main};
      }
    }

    & .SettingsEnvironment-TosTitle {
      margin: 0;
      font-size: 1.1rem;
    }

    & .SettingsEnvironment-TosMenu {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    & .SettingsEnvironment-TosButton {
      background-color: transparent;
      color: ${theme.palette.text.primary};
      border: 1px solid ${theme.palette.border.paper};
      border-radius: 9999px;
      padding: 4px 12px;
      margin: 0 2px;
    }

    & .SettingsEnvironment-TosButtonActive {
      border: 1px solid transparent;
      background-color: ${theme.palette.background.light};
    }

    & .SettingsEnvironment-TosBodyContainer {
      max-height: 50vh;
      overflow: scroll;
      overflow-x: hidden;
      border: solid 1px ${theme.palette.border.paper};
      margin-top: 5px;
      border-radius: 3px;
    }

    & .SettingsEnvironment-TosBody {
      padding: 5px;

      & .ProseMirror:focus {
        outline: none;
      }
    }
  `
}
