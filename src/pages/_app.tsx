import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Head from "next/head"
import { SessionProvider } from "next-auth/react"
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material"
import { useThemeOptions } from "@/client/common/theme.hook"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { PurchaseHistory } from "@/client/purchase-history/history.component"
import { GlobalTheme } from "@/client/common/theme.component"
import NextNProgress from "nextjs-progressbar"

const queryClient = new QueryClient()

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const theme = useThemeOptions()

  return (
    <>
      <Head>
        <title>Example Store</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Example Store" />
        <meta property="og:site_name" content="Example Store" />
        <meta property="og:description" content="Provides Best value products" />
        <meta property="og:type" content="website" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <SessionProvider session={session}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <GlobalTheme />
              <NextNProgress
                color="rgb(59 130 246)"
                options={{
                  showSpinner: false,
                }}
              />
              <PurchaseHistory />
              <Component {...pageProps} />
            </ThemeProvider>
          </StyledEngineProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}
