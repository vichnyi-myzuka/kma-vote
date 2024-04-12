import { Chip, ChipProps } from '@mui/material';

import { ElectionStatus } from '@libs/core/database/enums';

export type ElectionStatusChipProps = {
  status: ElectionStatus;
  hidden?: boolean;
  className?: string;
};
export default function ElectionStatusChip({
  status,
  className,
  hidden,
}: ElectionStatusChipProps) {
  const getChipLabel = (status: ElectionStatus) => {
    switch (status) {
      case ElectionStatus.CANCELLED:
        return 'Скасовано';
      case ElectionStatus.COMPLETED:
        return 'Завершено';
      case ElectionStatus.IN_PROGRESS:
        return 'В процесі';
      case ElectionStatus.NOT_STARTED:
        return 'Не розпочато';
      case ElectionStatus.PAUSED:
        return 'Призупинено';
      default:
        return 'Невідомий статус';
    }
  };

  const getChipColor = (status: ElectionStatus): ChipProps['color'] => {
    switch (status) {
      case ElectionStatus.CANCELLED:
        return 'error';
      case ElectionStatus.COMPLETED:
        return 'success';
      case ElectionStatus.IN_PROGRESS:
        return 'info';
      case ElectionStatus.NOT_STARTED:
        return 'secondary';
      case ElectionStatus.PAUSED:
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      sx={{
        fontWeight: 400,
      }}
      className={className}
      label={hidden ? 'Приховано' : getChipLabel(status)}
      color={hidden ? 'default' : getChipColor(status)}
    />
  );
}
