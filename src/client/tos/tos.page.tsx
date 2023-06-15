import { InferGetServerSidePropsType } from "next"
import { getServerSideProps } from "@/pages/tos"
import { EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { css } from "@emotion/react"
import { memo } from "react"

export const TosPage = memo(function TosPage({ environment }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: environment.termsOfService,
    editable: false,
  })

  return (
    <div css={topPageStyles}>
      <h1 className="Tos-Title">Terms Of Service</h1>
      {editor && <EditorContent className="Tos-Body" editor={editor} />}
    </div>
  )
})

function topPageStyles() {
  return css`
    margin: 60px 20px;

    @media (min-width: 768px) {
      margin: 60px 100px;
    }

    @media (min-width: 1024px) {
      width: 768px;
      margin: 60px auto;
    }

    & .Tos-Title {
      font-size: 2.5rem;
    }
  `
}
