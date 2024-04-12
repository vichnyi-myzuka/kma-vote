import Typography from '@app/client/components/Typography';
import s from './EmptyState.module.scss';

export type EmptyStateProps = {
  message: string;
};
export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className={s.container}>
      <Typography variant={'h4'}>{message}</Typography>
    </div>
  );
}
