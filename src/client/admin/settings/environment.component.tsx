import { useEnvironment } from "@/client/admin/settings/environment.hook"
import { ChangeEvent, useCallback, useState } from "react"
import { Environment } from "@/common/db.type"
import { Button, TextField, Theme } from "@mui/material"
import { css } from "@emotion/react"
import { Editor, EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"

export function SettingsEnvironment({
  environment: initialEnvironment,
  className,
}: {
  environment: Environment
  className?: string
}) {
  const { environment, edit } = useEnvironment(initialEnvironment)

  // telegram
  const [telegramUrl, setTelegramUrl] = useState(environment.telegramUrl)
  const changeTelegramUrl = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setTelegramUrl(event.target.value),
    []
  )

  // channel
  const [channelUrl, setChannelUrl] = useState(environment.channelUrl)
  const changeChannelUrl = useCallback((event: ChangeEvent<HTMLInputElement>) => setChannelUrl(event.target.value), [])

  // mail
  const [mailTo, setMailTo] = useState(environment.mailTo)
  const changeMailTo = useCallback((event: ChangeEvent<HTMLInputElement>) => setMailTo(event.target.value), [])

  // news
  const [campaign, setCampaign] = useState(environment.campaign)
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
    const classNames = ["Settings-TosButton"]
    if (editor && lambda(editor)) {
      classNames.push("Settings-TosButtonActive")
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
      telegramUrl,
      channelUrl,
      mailTo,
      campaign: campaign || "",
      termsOfService: editor?.getJSON(),
    })
  }, [edit, environment, telegramUrl, channelUrl, mailTo, campaign, editor])

  return (
    <section className={className} css={settingsEnvironmentStyles}>
      <h2 className="Settings-Environment">Environment</h2>
      <TextField label="Telegram URL" type="text" value={telegramUrl} onChange={changeTelegramUrl} />
      <TextField label="Channel URL" type="text" value={channelUrl} onChange={changeChannelUrl} />
      <TextField label="Mail To" type="text" value={mailTo} onChange={changeMailTo} />
      <TextField label="Campaign" type="text" value={campaign} onChange={changeCampaign} />
      <div className="Settings-Tos">
        {editor && (
          <>
            <div className="Settings-TosMenu">
              <p className="Settings-TosTitle">Terms of Service</p>
              <div className="Settings-TosButtons">
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
            <div className="Settings-TosBodyContainer">
              <EditorContent className="Settings-TosBody" editor={editor} />
            </div>
          </>
        )}
      </div>
      <Button onClick={updateEnvironment}>Click To Change</Button>
    </section>
  )
}

function settingsEnvironmentStyles(theme: Theme) {
  return css`
    display: flex;
    flex-direction: column;
    gap: 10px;

    & .Settings-Environment {
      margin: 8px 0;
    }

    & .Settings-Tos {
      border: 1px solid ${theme.palette.border.paper};
      border-radius: 4px;
      padding: 8px;

      transition: border 0.2s ease-in-out;

      &:focus-within {
        border: 1px solid ${theme.palette.primary.main};
        box-shadow: 0 0 0 1px ${theme.palette.primary.main};
      }
    }

    & .Settings-TosTitle {
      margin: 0;
      font-size: 1.1rem;
    }

    & .Settings-TosMenu {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    & .Settings-TosButton {
      background-color: transparent;
      color: ${theme.palette.text.primary};
      border: 1px solid ${theme.palette.border.paper};
      border-radius: 9999px;
      padding: 4px 12px;
      margin: 0 2px;
    }

    & .Settings-TosButtonActive {
      border: 1px solid transparent;
      background-color: ${theme.palette.background.light};
    }

    & .Settings-TosBodyContainer {
      max-height: 50vh;
      overflow: scroll;
      overflow-x: hidden;
      border: solid 1px ${theme.palette.border.paper};
      margin-top: 5px;
      border-radius: 3px;
    }

    & .Settings-TosBody {
      padding: 5px;

      & .ProseMirror:focus {
        outline: none;
      }
    }
  `
}
