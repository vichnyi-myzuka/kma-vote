import { Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

import { ElectionStatus } from '@libs/core/database/enums';

export type ElectionStatusTabsProps = {
  value: TabModel;
  onChange: (event: React.ChangeEvent<unknown>, newValue: TabModel) => void;
  isAdmin?: boolean;
};

type ElectionStatusValuesType =
  (typeof ElectionStatus)[keyof typeof ElectionStatus];

export type TabModel = {
  id: number;
  label: string;
  status?: ElectionStatus;
};

export const allTab: TabModel = {
  id: -1,
  label: 'Всі',
};

export const tabs: Record<
  ElectionStatusValuesType | 'available' | 'voted',
  TabModel
> = {
  available: {
    id: -2,
    label: 'Доступні для голосування',
  },
  voted: {
    id: -3,
    label: 'Проголосовані',
  },
  [ElectionStatus.IN_PROGRESS]: {
    id: 1,
    label: 'В процесі',
    status: ElectionStatus.IN_PROGRESS,
  },
  [ElectionStatus.NOT_STARTED]: {
    id: 2,
    label: 'Не розпочаті',
    status: ElectionStatus.NOT_STARTED,
  },
  [ElectionStatus.COMPLETED]: {
    id: 3,
    label: 'Завершені',
    status: ElectionStatus.COMPLETED,
  },
  [ElectionStatus.PAUSED]: {
    id: 4,
    label: 'Призупинені',
    status: ElectionStatus.PAUSED,
  },
  [ElectionStatus.CANCELLED]: {
    id: 5,
    label: 'Скасовані',
    status: ElectionStatus.CANCELLED,
  },
};

export const userTabs: Partial<typeof tabs> = {
  available: tabs.available,
  voted: tabs.voted,
  [ElectionStatus.IN_PROGRESS]: tabs[ElectionStatus.IN_PROGRESS],
  [ElectionStatus.NOT_STARTED]: tabs[ElectionStatus.NOT_STARTED],
  [ElectionStatus.COMPLETED]: tabs[ElectionStatus.COMPLETED],
};

export const getTabs = (isAdmin: boolean) => (isAdmin ? tabs : userTabs);

const CustomizedTab = styled(Tab)`
  & {
    text-transform: none;
  }
`;

export default function ElectionStatusTabs({
  value,
  onChange,
  isAdmin,
}: ElectionStatusTabsProps) {
  return (
    <Tabs value={value} onChange={onChange} aria-label="Election Status Tabs">
      {isAdmin ? <CustomizedTab label={allTab.label} value={allTab} /> : null}
      {Object.values(getTabs(!!isAdmin)).map((tab) => (
        <CustomizedTab key={tab.id} label={tab.label} value={tab} />
      ))}
    </Tabs>
  );
}
