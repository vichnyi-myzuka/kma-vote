import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Tooltip, Zoom } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import * as React from 'react';

import config from '@libs/configs/next';
import { ElectionDataDto } from '@libs/core/dto';
import { createElection } from '@app/client/api';
import CustomFab from '@app/client/components/CustomFab';
import ElectionForm from '@app/client/components/ElectionForm';

function CreateElectionForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (election: ElectionDataDto) => {
    await createElection(election);
    await router.push(config.routes.elections.path);
  };

  const handleError = (e: any) => {
    enqueueSnackbar(e.response.data.message || 'Помилка сервера', {
      variant: 'error',
    });
  };

  const handleFabClick = async () => {
    await router.push(config.routes.elections.path);
  };

  return (
    <>
      <Tooltip title={'Назад'} placement={'top'} arrow>
        <Zoom in>
          <CustomFab onClick={handleFabClick}>
            <ArrowBackIcon />
          </CustomFab>
        </Zoom>
      </Tooltip>
      <ElectionForm onSubmit={handleSubmit} onError={handleError} />
    </>
  );
}

export default CreateElectionForm;
