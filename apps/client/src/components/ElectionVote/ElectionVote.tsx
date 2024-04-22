import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

// Libs
import config from '@libs/configs/next';
import { Election, ElectionOption } from '@libs/core/database/entities';

// Client
import { voteForStudents } from '@app/client/api/elections';
import Typography from '@app/client/components/Typography';

export interface ElectionVoteProps {
  election: Election;
}
export default function ElectionVote({ election }: ElectionVoteProps) {
  const { minSelectedOptions, maxSelectedOptions } = election;
  const [selectedOptions, setSelectedOptions] = useState<ElectionOption[]>([]);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const checked = (option: ElectionOption) =>
    selectedOptions.some((s) => s.student.cdoc === option.student.cdoc);
  const disabled = (option: ElectionOption) =>
    selectedOptions.length >= maxSelectedOptions && !checked(option);
  const onCheckboxClick = (option: ElectionOption) => {
    if (checked(option)) {
      setSelectedOptions(
        selectedOptions.filter((s) => s.student.cdoc !== option.student.cdoc),
      );
    } else {
      if (disabled(option)) return;
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const canVote =
    selectedOptions.length >= minSelectedOptions &&
    selectedOptions.length <= maxSelectedOptions;
  const [loading, setLoading] = useState(false);
  const handleVoteButtonClick = async () => {
    setLoading(true);
    try {
      await voteForStudents(election.id, selectedOptions);
      enqueueSnackbar('Голосування успішно завершено', { variant: 'success' });
      setLoading(false);
      await router.push(config.routes.elections.path);
    } catch (e: any) {
      enqueueSnackbar(e?.response?.data?.message || 'Помилка голосування', {
        variant: 'error',
      });
      setLoading(false);
    }
  };

  return (
    <Box
      component={'section'}
      marginLeft={'auto'}
      marginRight={'auto'}
      mt={2}
      padding={'32px'}
      maxWidth={1100}
    >
      <Typography variant="h4" fontWeight={600} mb={4}>
        Проголосуйте за {minSelectedOptions === 1 ? 'кандидата' : 'кандидатів'}
      </Typography>
      <TableContainer
        component={({ children }) => (
          <Box
            sx={{
              border: '1px solid var(--blue)',
              borderRadius: 'var(--border-radius)',
              overflowX: 'auto',
            }}
          >
            {children}
          </Box>
        )}
      >
        <Table sx={{ minWidth: 650 }} aria-label="Progress">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: '600' }}>Студент</TableCell>
              <TableCell sx={{ fontWeight: '600' }} align="right">
                Факультет
              </TableCell>
              <TableCell sx={{ fontWeight: '600' }} align="right">
                Cпеціальність
              </TableCell>
              <TableCell sx={{ fontWeight: '600' }} align="right">
                Курс
              </TableCell>
            </TableRow>
          </TableHead>
          {election.options && (
            <TableBody>
              {election.options.map((option) => (
                <TableRow
                  key={option.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&': {
                      cursor: 'pointer',
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      opacity: 0.7,
                    },
                  }}
                  onClick={() => {
                    onCheckboxClick(option);
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'nowrap',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Checkbox
                      checked={checked(option)}
                      disabled={disabled(option)}
                      sx={{
                        padding: '0',
                        marginRight: '8px',
                      }}
                    />{' '}
                    {option.student.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                    align="right"
                  >
                    {option.student.facultyname}
                  </TableCell>
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                    align="right"
                  >
                    {option.student.spec}
                  </TableCell>
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                    align="right"
                  >
                    {option.student.year}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <LoadingButton
        onClick={handleVoteButtonClick}
        disabled={!canVote}
        loading={loading}
        loadingPosition="end"
        endIcon={<SendIcon />}
        variant="contained"
        color="primary"
        sx={{ textTransform: 'none', marginTop: '32px' }}
      >
        <span style={{ display: 'block' }}>Проголосувати</span>
      </LoadingButton>
    </Box>
  );
}
