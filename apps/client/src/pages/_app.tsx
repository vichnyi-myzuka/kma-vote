import { useStore } from 'effector-react';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { SnackbarProvider } from 'notistack';
import config from '@libs/configs/next';
import { Role } from '@libs/core/database/enums';
import { updateAuth } from '@app/client/guards/auth.guard';
import { userStore } from '@app/client/storage';
import { theme } from '@app/client/theme';
import Elections from '@app/client/pages/elections';
import NotAuthorized from '@app/client/pages/401';
import Forbidden from '@app/client/pages/403';
import PageLoader from '@app/client/components/PageLoader';
import { PageLoaderContext } from '@app/client/components/PageLoader/PageLoaderContext';
import '@app/client/styles/index.scss';

interface CustomAppProps extends Omit<AppProps, 'pageProps'> {
  pageProps: AppProps['pageProps'] & {
    protected: boolean;
    userTypes: Role[];
    root: boolean;
  };
}

function MyApp({ Component, pageProps, router }: CustomAppProps) {
  const user = useStore(userStore);
  const [isLoading, setLoading] = useState(false);
  const [isUpdated, setUpdated] = useState(false);

  useEffect(() => {
    const start = () => {
      console.log('start');
      setLoading(true);
    };
    const end = () => {
      console.log('end');
      setLoading(false);
    };
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', end);
    router.events.on('routeChangeError', end);
    updateAuth(
      () => {
        setUpdated(true);
      },
      () => {
        setUpdated(true);
      },
    );
    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', end);
      router.events.off('routeChangeError', end);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    if (pageProps.protected && isUpdated && !user) {
      router.push(config.routes['401'].path);
      return <NotAuthorized />;
    }

    if (pageProps.root && isUpdated && user) {
      router.push(config.routes.elections.path);
      return <Elections />;
    }
    if (
      pageProps.protected &&
      user &&
      pageProps.userTypes &&
      !pageProps.userTypes
        .map((role) => user.roles.includes(role))
        .reduce((fr, sr) => fr && sr)
    ) {
      router.push(config.routes['403'].path);
      return <Forbidden />;
    }
  }

  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : (
        <PageLoaderContext.Provider
          value={{
            showPageLoader: () => setLoading(true),
            hidePageLoader: () => setLoading(false),
          }}
        >
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
              <Component {...pageProps} key={router.asPath} />
            </SnackbarProvider>
          </ThemeProvider>
        </PageLoaderContext.Provider>
      )}
    </>
  );
}

export default MyApp;
