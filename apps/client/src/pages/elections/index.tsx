import { useStore } from 'effector-react';
import { NextPage } from 'next';
import { Box, Grid } from '@mui/material';
import React, { useRef } from 'react';
import { userStore } from '@app/client/storage';
import { isAdmin } from '@app/client/api';
import AdminPanel from '@app/client/components/AdminPanel';
import Header from '@app/client/components/Header';
import Layout from '@app/client/components/Layout';
import ConfirmationDialog from '@app/client/components/ConfirmationDialog';
import { ConfirmationContext } from '@app/client/components/ConfirmationDialog/ConfirmationContext';
import Typography from '@app/client/components/Typography';
import ElectionsList from '@app/client/components/ElectionsList';
import styles from './styles.module.scss';

const Elections: NextPage = () => {
  const user = useStore(userStore);
  const confirmationDialogRef = useRef(null);
  return (
    <Layout>
      <ConfirmationDialog ref={confirmationDialogRef} />
      <Header />
      <ConfirmationContext.Provider value={{ confirmationDialogRef }}>
        <main className={styles.mainContainer}>
          {isAdmin(user) || process.env.NODE_ENV === 'development' ? (
            <AdminPanel />
          ) : (
            <Box>
              <Typography variant="h2" fontWeight={600} mb={8}>
                Голосування
              </Typography>
              <Grid container spacing={3} mb={2}>
                <Grid item xs={12}>
                  <ElectionsList />
                </Grid>
              </Grid>
            </Box>
          )}
        </main>
      </ConfirmationContext.Provider>
    </Layout>
  );
};

export default Elections;

export async function getStaticProps() {
  return {
    props: {
      protected: true,
      root: false,
    },
  };
}
