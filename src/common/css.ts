import { Theme } from "@mui/material"
import { CSSInterpolation } from "@emotion/serialize"

export type Styles = (theme: Theme) => CSSInterpolation
