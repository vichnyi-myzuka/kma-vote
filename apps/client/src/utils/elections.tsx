import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlagIcon from '@mui/icons-material/Flag';
import CancelIcon from '@mui/icons-material/Cancel';
import StartIcon from '@mui/icons-material/Start';
import PauseIcon from '@mui/icons-material/Pause';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ElectionStatus } from '@libs/core/database/enums';
import { Election } from '@libs/core/database/entities';

export type Action = {
  icon: JSX.Element;
  name: string;
  onClick: () => void;
};
export const filterActionByStatus = (
  action: Action,
  allowedStatuses: ElectionStatus[],
  disallowedStatuses: ElectionStatus[] = [],
  electionStatus?: ElectionStatus,
): Action | null => {
  if (electionStatus && disallowedStatuses.includes(electionStatus)) {
    return null;
  }

  if (
    allowedStatuses.length === 0 ||
    (electionStatus && allowedStatuses.includes(electionStatus))
  ) {
    return action;
  }

  return null;
};

enum AdminAction {
  DELETE = 'delete',
  HIDE = 'hide',
  EDIT = 'edit',
  START = 'start',
  CANCEL = 'cancel',
  COMPLETE = 'complete',
  PAUSE = 'pause',
  RESUME = 'resume',
}

type ActionsHandler = {
  onDeleteActionClick: () => void;
  onHideActionClick: () => void;
  onEditActionClick: () => void;
  onStartActionClick: () => void;
  onCancelActionClick: () => void;
  onCompleteActionClick: () => void;
  onPauseActionClick: () => void;
  onResumeActionClick: () => void;
};
export const getAdminActions = (
  election: Election,
  actionsHandler: ActionsHandler,
): Record<AdminAction, Action> => {
  return {
    [AdminAction.DELETE]: {
      icon: <DeleteIcon />,
      name: 'Видалити',
      onClick: actionsHandler.onDeleteActionClick,
    },
    [AdminAction.HIDE]: {
      icon: election?.hide ? <VisibilityOffIcon /> : <VisibilityIcon />,
      name: election?.hide ? 'Показати' : 'Приховати',
      onClick: actionsHandler.onHideActionClick,
    },
    [AdminAction.EDIT]: {
      icon: <EditIcon />,
      name: 'Редагувати',
      onClick: actionsHandler.onEditActionClick,
    },
    [AdminAction.START]: {
      icon: <StartIcon />,
      name: 'Почати голосування',
      onClick: actionsHandler.onStartActionClick,
    },
    [AdminAction.CANCEL]: {
      icon: <CancelIcon />,
      name: 'Скасувати',
      onClick: actionsHandler.onCancelActionClick,
    },
    [AdminAction.COMPLETE]: {
      icon: <FlagIcon />,
      name: 'Завершити',
      onClick: actionsHandler.onCompleteActionClick,
    },
    [AdminAction.PAUSE]: {
      icon: <PauseIcon />,
      name: 'Призупинити',
      onClick: actionsHandler.onPauseActionClick,
    },
    [AdminAction.RESUME]: {
      icon: <PlayArrowIcon />,
      name: 'Відновити',
      onClick: actionsHandler.onResumeActionClick,
    },
  };
};

export const getFilteredAdminActions = (
  election: Election,
  actionsHandler: ActionsHandler,
): Action[] => {
  const actions = getAdminActions(election, actionsHandler);
  return [
    filterActionByStatus(
      actions.delete,
      [ElectionStatus.NOT_STARTED, ElectionStatus.PAUSED],
      [],
      election?.status,
    ),
    filterActionByStatus(
      actions.edit,
      [ElectionStatus.NOT_STARTED],
      [],
      election?.status,
    ),
    filterActionByStatus(
      actions.cancel,
      [],
      [ElectionStatus.COMPLETED, ElectionStatus.CANCELLED],
      election?.status,
    ),
    filterActionByStatus(
      actions.start,
      [ElectionStatus.NOT_STARTED],
      [],
      election?.status,
    ),
    filterActionByStatus(
      actions.complete,
      [ElectionStatus.IN_PROGRESS],
      [],
      election?.status,
    ),
    filterActionByStatus(
      actions.pause,
      [ElectionStatus.IN_PROGRESS],
      [],
      election?.status,
    ),
    filterActionByStatus(
      actions.resume,
      [ElectionStatus.PAUSED],
      [],
      election?.status,
    ),
    actions.hide,
  ].filter((election) => election !== null) as Action[];
};

export const sortElectionsByStatusPriority = (
  a: Election,
  b: Election,
): number => {
  const statuses = [
    ElectionStatus.IN_PROGRESS,
    ElectionStatus.NOT_STARTED,
    ElectionStatus.PAUSED,
    ElectionStatus.COMPLETED,
    ElectionStatus.CANCELLED,
  ];
  // Should be sorted by priority
  return statuses.indexOf(a.status) - statuses.indexOf(b.status);
};

export const getShortDate = (date: Date): string => {
  const dateString = new Date(date).toLocaleString();
  return dateString.slice(0, dateString.length - 3);
};

export const getDaysLeft = (date: Date): number => {
  const diff = new Date(date).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getDaysLeftString = (date: Date): string => {
  const days = getDaysLeft(date);
  const absDays = Math.abs(days);
  if (days < 0) {
    return `Закінчився ${absDays} ${absDays === 1 ? 'день' : 'днів'} тому`;
  }

  if (days === 0) {
    return 'Сьогодні';
  }

  if (days === 1) {
    return 'Залишився 1 день';
  }

  return `Залишилось ${days} днів`;
};
