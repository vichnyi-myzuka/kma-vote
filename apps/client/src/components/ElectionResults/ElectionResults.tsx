import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';

import { Election, ElectionResult } from '@libs/core/database/entities';

import { useElectionResults } from '@app/client/hooks/elections';
import Typography from '@app/client/components/Typography';

export interface ElectionResultsProps {
  election: Election;
}
export default function ElectionResults({ election }: ElectionResultsProps) {
  const { results } = useElectionResults(election.id);
  const allVotes = results.reduce(
    (acc, progressEntry) => acc + progressEntry.votes,
    0,
  );
  const getAllVotesString = (allVotes: number) => {
    if (allVotes === 0) {
      return 'Голосів немає';
    }

    if (allVotes === 1) {
      return '1 голос';
    }
    if (allVotes > 1 && allVotes < 5) {
      return `${allVotes} голоси`;
    }
    return `${allVotes} голосів`;
  };
  const sortByElectionResult = (a: ElectionResult, b: ElectionResult) => {
    if (a.votes > b.votes) {
      return -1;
    }
    if (a.votes < b.votes) {
      return 1;
    }
    return 0;
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
        Результати голосування: {getAllVotesString(allVotes)}
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
              <TableCell sx={{ fontWeight: '600' }} align="right">
                Кількість голосів
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.sort(sortByElectionResult).map((result, index) => (
              <TableRow
                key={result.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&': {
                    borderLeft: index === 0 ? '10px solid var(--blue)' : 0,
                  },
                }}
              >
                <TableCell
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                  component="th"
                  scope="row"
                >
                  {result.student.name}
                </TableCell>
                <TableCell
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                  align="right"
                >
                  {result.student.facultyname}
                </TableCell>
                <TableCell
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                  align="right"
                >
                  {result.student.spec}
                </TableCell>
                <TableCell
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                  align="right"
                >
                  {result.student.year}
                </TableCell>
                <TableCell
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                  align="right"
                >
                  {(result.votes / (allVotes || 1)) * 100}% ({result.votes})
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
