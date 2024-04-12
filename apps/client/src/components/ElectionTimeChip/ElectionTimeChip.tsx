import { Chip } from '@mui/material';

interface ElectionTimeChipProps {
  date: Date;
  className?: string;
}
export default function ElectionTimeChip({
  className,
  date,
}: ElectionTimeChipProps) {
  const dateString = new Date(date).toLocaleString();
  return (
    <Chip
      className={className}
      sx={{
        width: '140px',
      }}
      label={dateString.slice(0, -3)}
    />
  );
}
