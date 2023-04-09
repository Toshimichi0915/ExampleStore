import "@/styles/global.scss"
import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Head from "next/head"
import { SessionProvider } from "next-auth/react"
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material"
import { GlobalTheme } from "@/components/theme"
import { useThemeOptions } from "@/common/theme"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { PurchaseHistory, defaultPurchaseHistoryStyles } from "@/components/history"

const queryClient = new QueryClient()

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const theme = useThemeOptions()

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <SessionProvider session={session}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <PurchaseHistory css={defaultPurchaseHistoryStyles(theme)} />
              <CssBaseline />
              <GlobalTheme />
              <Component {...pageProps} />
            </ThemeProvider>
          </StyledEngineProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}
