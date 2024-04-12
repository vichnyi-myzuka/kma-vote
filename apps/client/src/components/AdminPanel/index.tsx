import AddIcon from '@mui/icons-material/Add';
import { Box, Grid, Tooltip, Zoom } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';

import config from '@libs/configs/next';
import Typography from '@app/client/components/Typography';
import CustomFab from '@app/client/components/CustomFab';
import ElectionsList from '@app/client/components/ElectionsList';

import styles from './styles.module.scss';

export default function AdminPanel() {
  const router = useRouter();

  const handleFabClick = async () => {
    await router.push(config.routes.createElections.path);
  };

  return (
    <section className={styles.adminPanelContainer}>
      <Tooltip title={'Створити'} placement={'top'} arrow>
        <Zoom in>
          <CustomFab onClick={handleFabClick}>
            <AddIcon />
          </CustomFab>
        </Zoom>
      </Tooltip>
      <Box>
        <Typography variant="h2" fontWeight={600} mb={8}>
          Керування голосуваннями
        </Typography>
        <Grid container spacing={3} mb={2}>
          <Grid item xs={12}>
            <ElectionsList isAdmin />
          </Grid>
        </Grid>
      </Box>
    </section>
  );
}
