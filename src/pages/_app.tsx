import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Head from "next/head"
import { SessionProvider } from "next-auth/react"
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material"
import { useThemeOptions } from "@/client/common/theme.hook"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { PurchaseHistory } from "@/client/purchase-history/history.component"
import { GlobalTheme } from "@/client/common/theme.component"
import NextProgress from "next-progress"

const queryClient = new QueryClient()

const nextProgressOptions = {
  showSpinner: false,
} as const

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
              <CssBaseline />
              <GlobalTheme />
              <NextProgress delay={300} options={nextProgressOptions} />
              <PurchaseHistory />
              <Component {...pageProps} />
            </ThemeProvider>
          </StyledEngineProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}
