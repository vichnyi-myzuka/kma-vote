import { useMemo } from 'react';
import {
  AppBar,
  Box,
  Dialog,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { Election } from '@libs/core/database/entities';
import { ElectionDataDto } from '@libs/core/dto';
import { useElectionSelectedStudents } from '@app/client/hooks/elections';
import ElectionForm from '@app/client/components/ElectionForm';
import { ElectionFormProps } from '@app/client/components/ElectionForm/ElectionForm';

export type EditElectionFormProps = {
  election: Election;
  onSubmit: (electionDataDto: ElectionDataDto) => Promise<void>;
  onError: (e: any) => void;
  onClose: () => void;
  open: boolean;
};
export default function EditElectionForm({
  election,
  onSubmit,
  onClose,
  onError,
  open,
}: EditElectionFormProps) {
  const { students } = useElectionSelectedStudents(election.id);
  const handleSubmit = async (electionDataDto: ElectionDataDto) => {
    await onSubmit(electionDataDto);
  };

  const handleError = (e: any) => {
    onError(e);
  };

  const defaultValue: ElectionFormProps['defaultValue'] = useMemo(() => {
    return {
      voteName: election.name,
      voteDescription: election.description,
      voteStartDate: election.startDate,
      voteEndDate: election.endDate,
      hideElection: election.hide,
      voteMinOptions: election.minSelectedOptions,
      voteMaxOptions: election.maxSelectedOptions,
      accessScenarioParams: election.accessScenarioParams.student,
      selectedStudents: students,
    };
  }, [election, students]);

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Редагування
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component={'main'}
        marginLeft={'auto'}
        marginRight={'auto'}
        mt={2}
        padding={'32px'}
        maxWidth={1100}
      >
        <ElectionForm
          submitButtonLabel={'Оновити'}
          onSubmit={handleSubmit}
          onError={handleError}
          edit
          defaultValue={defaultValue}
        />
      </Box>
    </Dialog>
  );
}
