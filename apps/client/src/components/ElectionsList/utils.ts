import { RefObject, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

// Libs
import { ElectionsFilterModel } from '@libs/core/database/types';
import { Election } from '@libs/core/database/entities';

// Client
import {
  cancelElection,
  completeElection,
  deleteElection,
  getAllAvailableElections,
  getAllElections,
  getVotedElections,
  hideElection,
  pauseElection,
  resumeElection,
  showElection,
  startElection,
} from '@app/client/api';
import { ConfirmationDialogHandle } from '@app/client/components/ConfirmationDialog/ConfirmationDialog';

export interface PaginationModel {
  page: number;
  pageSize: number;
}

export function useElections(
  paginationModel: PaginationModel,
  filterModel?: ElectionsFilterModel,
  additionalTabs?: { isAvailable: boolean; isVoted: boolean },
) {
  const [isLoading] = useState<boolean>(false);
  const [elections, setElections] = useState<Election[]>([]);
  const [pageInfo, setPageInfo] = useState({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    total: 0,
    filter: filterModel,
  });
  const { enqueueSnackbar } = useSnackbar();
  const { isAvailable, isVoted } = additionalTabs || {};

  const skip = paginationModel.page * paginationModel.pageSize;
  const take = paginationModel.pageSize;

  const getElections = async () => {
    try {
      let results: { data: Election[]; total: number };
      if (isAvailable) {
        results = await getAllAvailableElections(take, skip);
      } else if (isVoted) {
        results = await getVotedElections(take, skip);
      } else {
        results = await getAllElections(take, skip, filterModel);
      }

      const { data, total } = results;

      setElections(data);
      setPageInfo(() => ({
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        total,
        filter: filterModel,
      }));

      return { data, total };
    } catch (e: any) {
      enqueueSnackbar(e?.response?.data?.message || 'Помилка завантаження!', {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    getElections();
  }, [paginationModel, filterModel]);

  return { isLoading, elections, pageInfo, update: getElections };
}

export const toggleElectionViewAction = (
  election: Election,
  onShowSuccess: () => Promise<void>,
  onShowError: (message?: string) => Promise<void>,
  onHideSuccess: () => Promise<void>,
  onHideError: (message?: string) => Promise<void>,
  confirmationDialogRef: RefObject<ConfirmationDialogHandle> | null,
) => {
  if (confirmationDialogRef?.current) {
    confirmationDialogRef.current.open({
      title: election.hide ? 'Показати голосування' : 'Приховати голосування',
      message: `Ви впевнені, що хочете ${
        election.hide ? 'показати' : 'приховати'
      } голосування?`,
      onConfirm: async () => {
        if (election.hide) {
          try {
            await showElection(election.id);
            await onShowSuccess();
          } catch (e: any) {
            await onShowError(e?.response?.data?.message as string);
          }
        } else {
          try {
            await hideElection(election.id);
            await onHideSuccess();
          } catch (e: any) {
            await onHideError(e?.response?.data?.message as string);
          }
        }
      },
    });
  }
};

export const deleteElectionAction = (
  election: Election,
  onDeleteSuccess: () => Promise<void>,
  onDeleteError: (message?: string) => Promise<void>,
  confirmationDialogRef: RefObject<ConfirmationDialogHandle> | null,
) => {
  if (confirmationDialogRef?.current) {
    confirmationDialogRef.current.open({
      title: 'Видалити голосування',
      message: 'Ви впевнені, що хочете видалити голосування?',
      onConfirm: async () => {
        try {
          await deleteElection(election.id);
          await onDeleteSuccess();
        } catch (e: any) {
          await onDeleteError(e?.response?.data?.message as string);
        }
      },
    });
  }
};

export const startElectionAction = (
  election: Election,
  onStartSuccess: () => Promise<void>,
  onStartError: (message?: string) => Promise<void>,
  confirmationDialogRef: RefObject<ConfirmationDialogHandle> | null,
) => {
  if (confirmationDialogRef?.current) {
    confirmationDialogRef.current.open({
      title: 'Почати голосування',
      message: 'Ви впевнені, що хочете почати голосування?',
      onConfirm: async () => {
        try {
          await startElection(election.id);
          await onStartSuccess();
        } catch (e: any) {
          await onStartError(e?.response?.data?.message as string);
        }
      },
    });
  }
};

export const cancelElectionAction = (
  election: Election,
  onCancelSuccess: () => Promise<void>,
  onCancelError: (message?: string) => Promise<void>,
  confirmationDialogRef: RefObject<ConfirmationDialogHandle> | null,
) => {
  if (confirmationDialogRef?.current) {
    confirmationDialogRef.current.open({
      title: 'Скасувати голосування',
      message: 'Ви впевнені, що хочете скасувати голосування?',
      onConfirm: async () => {
        try {
          await cancelElection(election.id);
          await onCancelSuccess();
        } catch (e: any) {
          await onCancelError(e?.response?.data?.message as string);
        }
      },
    });
  }
};

export const completeElectionAction = (
  election: Election,
  onCompleteSuccess: () => Promise<void>,
  onCompleteError: (message?: string) => Promise<void>,
  confirmationDialogRef: RefObject<ConfirmationDialogHandle> | null,
) => {
  if (confirmationDialogRef?.current) {
    confirmationDialogRef.current.open({
      title: 'Завершити голосування',
      message: 'Ви впевнені, що хочете завершити голосування?',
      onConfirm: async () => {
        try {
          await completeElection(election.id);
          await onCompleteSuccess();
        } catch (e: any) {
          await onCompleteError(e?.response?.data?.message as string);
        }
      },
    });
  }
};

export const pauseElectionAction = (
  election: Election,
  onPauseSuccess: () => Promise<void>,
  onPauseError: (message?: string) => Promise<void>,
  confirmationDialogRef: RefObject<ConfirmationDialogHandle> | null,
) => {
  if (confirmationDialogRef?.current) {
    confirmationDialogRef.current.open({
      title: 'Призупинити голосування',
      message: 'Ви впевнені, що хочете призупинити голосування?',
      onConfirm: async () => {
        try {
          await pauseElection(election.id);
          await onPauseSuccess();
        } catch (e: any) {
          await onPauseError(e?.response?.data?.message as string);
        }
      },
    });
  }
};

export const resumeElectionAction = (
  election: Election,
  onResumeSuccess: () => Promise<void>,
  onResumeError: (message?: string) => Promise<void>,
  confirmationDialogRef: RefObject<ConfirmationDialogHandle> | null,
) => {
  if (confirmationDialogRef?.current) {
    confirmationDialogRef.current.open({
      title: 'Відновити голосування',
      message: 'Ви впевнені, що хочете відновити голосування?',
      onConfirm: async () => {
        try {
          await resumeElection(election.id);
          await onResumeSuccess();
        } catch (e: any) {
          await onResumeError(e?.response?.data?.message as string);
        }
      },
    });
  }
};
