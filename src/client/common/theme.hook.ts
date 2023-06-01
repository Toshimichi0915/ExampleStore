import { createTheme, Theme as MuiTheme } from "@mui/material"
import { Poppins } from "next/font/google"
import { useEffect, useMemo, useState } from "react"

declare module "@mui/material" {
  interface TypeBackground {
    light: string
    dark: string
  }

  interface Palette {
    border: {
      paper: string
    }
  }

  interface PaletteOptions {
    border: {
      paper: string
    }
  }
}

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends MuiTheme {
  }
}

export const poppins = Poppins({ subsets: [ "latin" ], weight: "400" })

export function useThemeOptions() {
  const [ rootElement, setRootElement ] = useState<Element>()

  useEffect(() => {
    setRootElement(document.querySelector("#__next") ?? undefined)
  }, [])

  return useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          primary: {
            main: "#458EFC",
            dark: "#2D3DC6",
          },
          background: {
            default: "#010638",
            dark: "#131742",
            light: "#2D3DC6",
            paper: "#162074",

          },
          border: {
            paper: "#30415B",
          },
        },
        typography: {
          fontFamily: poppins.style.fontFamily,
          h1: {
            fontSize: "2rem",
          },
          h2: {
            fontSize: "1.5rem",
          },
          subtitle1: {
            fontSize: "1.5rem",
          },
        },
        components: {
          MuiPopover: {
            defaultProps: {
              container: rootElement,
            },
          },
          MuiPopper: {
            defaultProps: {
              container: rootElement,
            },
          },
          MuiDialog: {
            defaultProps: {
              container: rootElement,
            },
          },
        },
      }),
    [ rootElement ],
  )
}
