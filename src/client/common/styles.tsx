import { css, Theme } from "@mui/material"

export function paperStyles(theme: Theme) {
  return css`
    padding: 20px;
    border-radius: 6px;
    border: 1px solid ${theme.palette.border.paper};
    background-color: ${theme.palette.background.paper};
  `
}

export function textAreaStyles(theme: Theme) {
  return css`
    background: transparent;
    padding: 8.5px 14px;
    font-family: ${theme.typography.fontFamily};
    font-size: inherit;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.23);
    outline: none;
    color: ${theme.palette.text.primary};

    &:hover {
      border: 1px solid rgba(255, 255, 255, 0.87);
    }

    &:focus {
      border: 1px solid ${theme.palette.primary.main};
      box-shadow: 0 0 0 1px ${theme.palette.primary.main};
    }

    &::placeholder {
      color: ${theme.palette.text.secondary};
    }
  `
}

export function dialogStyles(theme: Theme) {
  return css`
    & .MuiDialog-paper {
      padding: 10px;
      border-radius: 6px;
      border: 1px solid ${theme.palette.border.paper};
    }

    & .MuiDialogContent-root {
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow: visible;
    }
  `
}
