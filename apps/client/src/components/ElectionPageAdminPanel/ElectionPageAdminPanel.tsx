import { useRouter } from 'next/router';
import { Zoom } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { useSnackbar } from 'notistack';

import config from '@libs/configs/next';
import { ElectionDataDto } from '@libs/core/dto';
import { Election } from '@libs/core/database/entities';
import { ElectionStatus } from '@libs/core/database/enums';
import { updateElection } from '@app/client/api';
import { Action, getFilteredAdminActions } from '@app/client/utils/elections';
import { ConfirmationContext } from '@app/client/components/ConfirmationDialog/ConfirmationContext';
import {
  cancelElectionAction,
  completeElectionAction,
  deleteElectionAction,
  pauseElectionAction,
  resumeElectionAction,
  startElectionAction,
  toggleElectionViewAction,
} from '@app/client/components/ElectionsList/utils';
import EditElectionForm from '@app/client/components/EditElectionForm';
import ElectionProgress from '@app/client/components/ElectionProgress';
import s from './ElectionPageAdminPanel.module.scss';

export type ElectionPageAdminPanelProps = {
  election?: Election;
  onElectionUpdate?: () => Promise<void>;
  onElectionEditOpen?: () => void;
};
export default function ElectionPageAdminPanel({
  election,
  onElectionUpdate,
  onElectionEditOpen,
}: ElectionPageAdminPanelProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { confirmationDialogRef } = React.useContext(ConfirmationContext);
  const [showEditElectionDialog, setShowEditElectionDialog] = useState(false);

  const router = useRouter();
  const handleDeleteActionClick = () => {
    if (election && confirmationDialogRef) {
      deleteElectionAction(
        election,
        async () => {
          enqueueSnackbar('Голосування видалено', { variant: 'success' });
          await router.push('/elections');
        },
        async (message) => {
          enqueueSnackbar(message ?? 'Помилка видалення голосування', {
            variant: 'error',
          });
        },
        confirmationDialogRef,
      );
    }
  };
  const handleHideActionClick = () => {
    if (election && confirmationDialogRef && onElectionUpdate) {
      toggleElectionViewAction(
        election,
        async () => {
          await onElectionUpdate();
          enqueueSnackbar('Голосування показано', { variant: 'success' });
        },
        async (message) => {
          enqueueSnackbar(message ?? 'Помилка показу голосування', {
            variant: 'error',
          });
        },
        async () => {
          await onElectionUpdate();
          enqueueSnackbar('Голосування приховане', { variant: 'success' });
        },
        async (message) => {
          enqueueSnackbar(message ?? 'Помилка приховання голосування', {
            variant: 'error',
          });
        },
        confirmationDialogRef,
      );
    }
  };

  const handleStartActionClick = () => {
    if (election && confirmationDialogRef && onElectionUpdate) {
      startElectionAction(
        election,
        async () => {
          await onElectionUpdate();
          enqueueSnackbar('Голосування почалося', { variant: 'success' });
        },
        async (message) => {
          enqueueSnackbar(message ?? 'Помилка початку голосування', {
            variant: 'error',
          });
        },
        confirmationDialogRef,
      );
    }
  };

  const handleEditActionClick = async () => {
    if (election) {
      await router.push(
        `${config.routes.viewElection.path}?name=${election.urlKey}&edit=true`,
        undefined,
        {
          shallow: true,
        },
      );
    }
  };

  const handleCancelActionClick = async () => {
    if (election && confirmationDialogRef && onElectionUpdate) {
      cancelElectionAction(
        election,
        async () => {
          await onElectionUpdate();
          enqueueSnackbar('Голосування скасовано', { variant: 'success' });
        },
        async (message) => {
          enqueueSnackbar(message ?? 'Помилка скасування голосування', {
            variant: 'error',
          });
        },
        confirmationDialogRef,
      );
    }
  };

  const handleCompleteActionClick = async () => {
    if (election && confirmationDialogRef && onElectionUpdate) {
      completeElectionAction(
        election,
        async () => {
          await onElectionUpdate();
          enqueueSnackbar('Голосування завершено', { variant: 'success' });
        },
        async (message) => {
          enqueueSnackbar(message ?? 'Помилка завершення голосування', {
            variant: 'error',
          });
        },
        confirmationDialogRef,
      );
    }
  };

  const handlePauseActionClick = async () => {
    if (election && confirmationDialogRef && onElectionUpdate) {
      pauseElectionAction(
        election,
        async () => {
          await onElectionUpdate();
          enqueueSnackbar('Голосування призупинено', { variant: 'success' });
        },
        async (message) => {
          enqueueSnackbar(message ?? 'Помилка призупинення голосування', {
            variant: 'error',
          });
        },
        confirmationDialogRef,
      );
    }
  };

  const handleResumeActionClick = async () => {
    if (election && confirmationDialogRef && onElectionUpdate) {
      resumeElectionAction(
        election,
        async () => {
          await onElectionUpdate();
          enqueueSnackbar('Голосування відновлено', { variant: 'success' });
        },
        async (message) => {
          enqueueSnackbar(message ?? 'Помилка відновлення голосування', {
            variant: 'error',
          });
        },
        confirmationDialogRef,
      );
    }
  };

  const handleEditElectionFormSubmit = async (
    electionDataDto: ElectionDataDto,
  ) => {
    if (election) {
      await updateElection(election.id, electionDataDto);
      setShowEditElectionDialog(false);
      await router.push(
        `${config.routes.viewElection.path}?name=${electionDataDto.electionDto.urlKey}`,
        undefined,
        {
          shallow: true,
        },
      );
      await onElectionUpdate?.();
    }
  };

  const handleEditElectionFormClose = async () => {
    if (election && onElectionUpdate) {
      await onElectionUpdate();
      setShowEditElectionDialog(false);
      await router.push(
        `${config.routes.viewElection.path}?name=${election.urlKey}`,
        undefined,
        { shallow: true },
      );
    }
  };

  const handleEditElectionFormSubmitError = (e: any) => {
    enqueueSnackbar(e.response?.data?.message || 'Помилка сервера', {
      variant: 'error',
    });
  };

  const filteredActions: Action[] = election
    ? getFilteredAdminActions(election, {
        onDeleteActionClick: handleDeleteActionClick,
        onHideActionClick: handleHideActionClick,
        onEditActionClick: handleEditActionClick,
        onStartActionClick: handleStartActionClick,
        onCancelActionClick: handleCancelActionClick,
        onCompleteActionClick: handleCompleteActionClick,
        onPauseActionClick: handlePauseActionClick,
        onResumeActionClick: handleResumeActionClick,
      })
    : [];

  useEffect(() => {
    if (router.query.edit) {
      onElectionEditOpen?.();
      setTimeout(() => {
        setShowEditElectionDialog(true);
      }, 1000);
    }
  }, [router.query.edit]);

  return (
    <section className={s.electionPageAdminPanel}>
      {election && (
        <Zoom in>
          <SpeedDial
            ariaLabel="More"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<MoreVertIcon />}
          >
            {filteredActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.onClick}
              />
            ))}
          </SpeedDial>
        </Zoom>
      )}
      {election && (
        <EditElectionForm
          election={election}
          onSubmit={handleEditElectionFormSubmit}
          onError={handleEditElectionFormSubmitError}
          onClose={handleEditElectionFormClose}
          open={showEditElectionDialog}
        />
      )}
      {[ElectionStatus.IN_PROGRESS || ElectionStatus.PAUSED].includes(
        election?.status,
      ) && <ElectionProgress election={election} />}
    </section>
  );
}
