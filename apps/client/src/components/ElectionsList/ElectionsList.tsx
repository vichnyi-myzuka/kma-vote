import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

// Libs
import config from '@libs/configs/next';
import { ElectionsFilterModel } from '@libs/core';
import { Election } from '@libs/core/database/entities';

// Client
import { sortElectionsByStatusPriority } from '@app/client/utils/elections';
import {
  cancelElectionAction,
  completeElectionAction,
  deleteElectionAction,
  PaginationModel,
  pauseElectionAction,
  resumeElectionAction,
  startElectionAction,
  toggleElectionViewAction,
  useElections,
} from '@app/client/components/ElectionsList/utils';
import ElectionStatusTabs, {
  allTab,
  TabModel,
  tabs,
  userTabs,
} from '@app/client/components/ElectionStatusTabs/ElectionStatusTabs';
import EmptyState from '@app/client/components/EmptyState';
import ElectionListItem from '@app/client/components/ElectionsList/ElectionListItem';
import { ConfirmationContext } from '@app/client/components/ConfirmationDialog/ConfirmationContext';

import s from './ElectionsList.module.scss';

export type ElectionsListProps = {
  isAdmin?: boolean;
};

const getFilterModel = (tab: TabModel) => {
  if (tab.status) {
    return { status: tab.status };
  }
  return {};
};

export default function ElectionsList({ isAdmin = false }: ElectionsListProps) {
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 6,
  });
  const defaultTab = isAdmin ? allTab : userTabs.available;
  const [currentTab, setCurrentTab] = useState<TabModel>(defaultTab);
  const [filterModel, setFilterModel] = useState<ElectionsFilterModel>(
    getFilterModel(defaultTab),
  );
  const [isAvailable, setIsAvailable] = useState<boolean>(!isAdmin);
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { confirmationDialogRef } = useContext(ConfirmationContext);

  const { elections, pageInfo, update } = useElections(
    paginationModel,
    filterModel,
    { isAvailable, isVoted },
  );
  const { total, pageSize, page } = pageInfo;
  const pagesCount = Math.ceil(total / pageSize);
  const router = useRouter();

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setPaginationModel({ ...paginationModel, page: page - 1 });
  };

  const changeFilterModel = (tab: TabModel) => {
    setFilterModel(getFilterModel(tab));
  };

  const updateAdditionalTabs = (tab: TabModel) => {
    if (tab.id === tabs.available.id) {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
    }
    if (tab.id === tabs.voted.id) {
      setIsVoted(true);
    } else {
      setIsVoted(false);
    }
  };

  const handleTabChange = (
    event: React.ChangeEvent<unknown>,
    newValue: TabModel,
  ) => {
    updateAdditionalTabs(newValue);
    changeFilterModel(newValue);
    setCurrentTab(newValue);
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  const handleShowButtonClick = async (election: Election) => {
    toggleElectionViewAction(
      election,
      async () => {
        enqueueSnackbar('Голосування показано', { variant: 'success' });
        await update();
      },
      async (message) => {
        enqueueSnackbar(message ?? 'Помилка показу голосування', {
          variant: 'error',
        });
      },
      async () => {
        enqueueSnackbar('Голосування приховано', { variant: 'success' });
        await update();
      },
      async (message) => {
        enqueueSnackbar(message ?? 'Помилка приховування голосування', {
          variant: 'error',
        });
      },
      confirmationDialogRef,
    );
  };

  const handleEditButtonClick = async (election: Election) => {
    await router.push(
      `${config.routes.viewElection.path}?name=${election.urlKey}&edit=true`,
    );
  };

  const handleDeleteButtonClick = async (election: Election) => {
    deleteElectionAction(
      election,
      async () => {
        await update();
        enqueueSnackbar('Голосування видалено', { variant: 'success' });
      },
      async (message) => {
        enqueueSnackbar(message ?? 'Помилка видалення голосування', {
          variant: 'error',
        });
      },
      confirmationDialogRef,
    );
  };

  const handleCancelActionClick = async (election: Election) => {
    cancelElectionAction(
      election,
      async () => {
        await update();
        enqueueSnackbar('Голосування скасовано', { variant: 'success' });
      },
      async (message) => {
        enqueueSnackbar(message ?? 'Помилка скасування голосування', {
          variant: 'error',
        });
      },
      confirmationDialogRef,
    );
  };

  const handleCompleteActionClick = async (election: Election) => {
    completeElectionAction(
      election,
      async () => {
        await update();
        enqueueSnackbar('Голосування завершено', { variant: 'success' });
      },
      async (message) => {
        enqueueSnackbar(message ?? 'Помилка завершення голосування', {
          variant: 'error',
        });
      },
      confirmationDialogRef,
    );
  };

  const handlePauseActionClick = async (election: Election) => {
    pauseElectionAction(
      election,
      async () => {
        await update();
        enqueueSnackbar('Голосування призупинено', { variant: 'success' });
      },
      async (message) => {
        enqueueSnackbar(message ?? 'Помилка призупинення голосування', {
          variant: 'error',
        });
      },
      confirmationDialogRef,
    );
  };

  const handleResumeActionClick = async (election: Election) => {
    resumeElectionAction(
      election,
      async () => {
        await update();
        enqueueSnackbar('Голосування відновлено', { variant: 'success' });
      },
      async (message) => {
        enqueueSnackbar(message ?? 'Помилка відновлення голосування', {
          variant: 'error',
        });
      },
      confirmationDialogRef,
    );
  };

  const handleStartButtonClick = async (election: Election) => {
    startElectionAction(
      election,
      async () => {
        await update();
        enqueueSnackbar('Голосування почалося', { variant: 'success' });
      },
      async (message) => {
        enqueueSnackbar(message ?? 'Помилка початку голосування', {
          variant: 'error',
        });
      },
      confirmationDialogRef,
    );
  };

  return (
    <div className={s.electionsList}>
      <ElectionStatusTabs
        value={currentTab}
        onChange={handleTabChange}
        isAdmin={isAdmin}
      />
      {elections.length ? (
        <TableContainer
          component={({ children }) => (
            <Box
              sx={{
                width: '100%',
                border: '1px solid var(--blue)',
                borderRadius: 'var(--border-radius)',
                overflowX: 'auto',
              }}
            >
              {children}
            </Box>
          )}
        >
          <Table sx={{ minWidth: 650 }} aria-label="Progress" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }}>Назва</TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: '600', width: '140px' }}
                >
                  Статус
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: '600', width: '140px' }}
                >
                  Початок
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: '600', width: '140px' }}
                >
                  Кінець
                </TableCell>
                {isAdmin && (
                  <TableCell
                    align="right"
                    sx={{ fontWeight: '600', width: '60px' }}
                  >
                    Дії
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {elections.sort(sortElectionsByStatusPriority).map((election) => (
                <ElectionListItem
                  isAdmin={isAdmin}
                  key={election.id}
                  election={election}
                  onDeleteButtonClick={handleDeleteButtonClick}
                  onEditButtonClick={handleEditButtonClick}
                  onShowButtonClick={handleShowButtonClick}
                  onStartButtonClick={handleStartButtonClick}
                  onCancelButtonClick={handleCancelActionClick}
                  onCompleteButtonClick={handleCompleteActionClick}
                  onPauseButtonClick={handlePauseActionClick}
                  onResumeButtonClick={handleResumeActionClick}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <EmptyState message={'Немає голосувань'} />
      )}
      <Pagination
        count={pagesCount}
        onChange={handlePageChange}
        page={page + 1}
      />
    </div>
  );
}
