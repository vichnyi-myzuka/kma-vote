import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import React from 'react';

import config from '@libs/configs/next';
import { Election } from '@libs/core/database/entities';

import { getFilteredAdminActions } from '@app/client/utils/elections';

import CustomLink from '@app/client/components/CustomLink';
import ElectionStatusChip from '@app/client/components/ElectionStatusChip';
import ElectionTimeChip from '@app/client/components/ElectionTimeChip';

import s from './ElectionListItem.module.scss';

export type ElectionListItemProps = {
  election: Election;
  onShowButtonClick: (election: Election) => void;
  onEditButtonClick: (election: Election) => void;
  onDeleteButtonClick: (election: Election) => void;
  onStartButtonClick: (election: Election) => void;
  onCancelButtonClick: (election: Election) => void;
  onCompleteButtonClick: (election: Election) => void;
  onPauseButtonClick: (election: Election) => void;
  onResumeButtonClick: (election: Election) => void;
  isAdmin?: boolean;
};
export default function ElectionListItem({
  election,
  onDeleteButtonClick,
  onShowButtonClick,
  onEditButtonClick,
  onStartButtonClick,
  onCancelButtonClick,
  onCompleteButtonClick,
  onPauseButtonClick,
  onResumeButtonClick,
  isAdmin,
}: ElectionListItemProps) {
  const getClickHandler = (fn: (election: Election) => void) => {
    return () => {
      fn(election);
    };
  };

  const filteredAdminActions = getFilteredAdminActions(election, {
    onDeleteActionClick: getClickHandler(onDeleteButtonClick),
    onHideActionClick: getClickHandler(onShowButtonClick),
    onEditActionClick: getClickHandler(onEditButtonClick),
    onStartActionClick: getClickHandler(onStartButtonClick),
    onCancelActionClick: getClickHandler(onCancelButtonClick),
    onCompleteActionClick: getClickHandler(onCompleteButtonClick),
    onPauseActionClick: getClickHandler(onPauseButtonClick),
    onResumeActionClick: getClickHandler(onResumeButtonClick),
  });
  return (
    <TableRow
      key={election.id}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        '&': {
          position: 'relative',
        },
      }}
    >
      <TableCell
        className={s.itemCell}
        sx={{
          color: 'var(--blue)',
          position: 'relative',
        }}
      >
        <Tooltip title={'asds'}>
          <CustomLink
            href={`${config.routes.viewElection.path}?name=${election.urlKey}`}
            className={s.itemLink}
          >
            {election.name}
          </CustomLink>
        </Tooltip>
      </TableCell>
      <TableCell
        sx={{
          whiteSpace: 'nowrap',
        }}
        align="right"
        className={s.itemCell}
      >
        <ElectionStatusChip status={election.status} className={s.itemChip} />
      </TableCell>
      <TableCell
        sx={{
          whiteSpace: 'nowrap',
        }}
        align="right"
        className={s.itemCell}
      >
        <ElectionTimeChip date={election.startDate} className={s.itemChip} />
      </TableCell>
      <TableCell
        sx={{
          whiteSpace: 'nowrap',
        }}
        align="right"
        className={s.itemCell}
      >
        <ElectionTimeChip date={election.endDate} className={s.itemChip} />
      </TableCell>
      {isAdmin && (
        <TableCell
          sx={{
            whiteSpace: 'nowrap',
          }}
          align="right"
          className={s.itemCell}
        >
          {filteredAdminActions.map((action) => (
            <Tooltip
              key={action.name}
              title={action.name}
              onClick={action.onClick}
            >
              <IconButton>{action.icon}</IconButton>
            </Tooltip>
          ))}
        </TableCell>
      )}
    </TableRow>
  );
}
