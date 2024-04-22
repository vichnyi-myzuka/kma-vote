import { Box } from '@mui/material';
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// }
// import { ElectionOptionProgressDto } from '@libs/core/dto';
import React from 'react';
import { Election } from '@libs/core/database/entities';
import { useElectionProgress } from '@app/client/hooks/elections';
import Typography from '@app/client/components/Typography';

export interface ElectionProgressProps {
  election: Election;
}
export default function ElectionProgress({ election }: ElectionProgressProps) {
  const { progress } = useElectionProgress(election.id);
  const allVotes = progress.reduce(
    (acc, progressEntry) => acc + progressEntry.progress,
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
  // const sortByProgress = (
  //   a: ElectionOptionProgressDto,
  //   b: ElectionOptionProgressDto,
  // ) => {
  //   if (a.progress > b.progress) {
  //     return -1;
  //   }
  //   if (a.progress < b.progress) {
  //     return 1;
  //   }
  //   return 0;
  // };

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
        Перебіг голосування: {getAllVotesString(allVotes)}
      </Typography>
      {/*<TableContainer*/}
      {/*  component={({ children }) => (*/}
      {/*    <Box*/}
      {/*      sx={{*/}
      {/*        border: '1px solid var(--blue)',*/}
      {/*        borderRadius: 'var(--border-radius)',*/}
      {/*        overflowX: 'auto',*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      {children}*/}
      {/*    </Box>*/}
      {/*  )}*/}
      {/*>*/}
      {/*  <Table sx={{ minWidth: 650 }} aria-label="Progress">*/}
      {/*    <TableHead>*/}
      {/*      <TableRow>*/}
      {/*        <TableCell sx={{ fontWeight: '600' }}>Студент</TableCell>*/}
      {/*        <TableCell sx={{ fontWeight: '600' }} align="right">*/}
      {/*          Факультет*/}
      {/*        </TableCell>*/}
      {/*        <TableCell sx={{ fontWeight: '600' }} align="right">*/}
      {/*          Cпеціальність*/}
      {/*        </TableCell>*/}
      {/*        <TableCell sx={{ fontWeight: '600' }} align="right">*/}
      {/*          Курс*/}
      {/*        </TableCell>*/}
      {/*        <TableCell sx={{ fontWeight: '600' }} align="right">*/}
      {/*          Кількість голосів*/}
      {/*        </TableCell>*/}
      {/*      </TableRow>*/}
      {/*    </TableHead>*/}
      {/*    <TableBody>*/}
      {/*      {progress.sort(sortByProgress).map((progressEntry, index) => (*/}
      {/*        <TableRow*/}
      {/*          key={progressEntry.option.id}*/}
      {/*          sx={{*/}
      {/*            '&:last-child td, &:last-child th': { border: 0 },*/}
      {/*            '&': {*/}
      {/*              cursor: 'click',*/}
      {/*              borderLeft: index === 0 ? '10px solid var(--blue)' : 0,*/}
      {/*            },*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <TableCell*/}
      {/*            sx={{*/}
      {/*              whiteSpace: 'nowrap',*/}
      {/*            }}*/}
      {/*            component="th"*/}
      {/*            scope="row"*/}
      {/*          >*/}
      {/*            {progressEntry.option.student.name}*/}
      {/*          </TableCell>*/}
      {/*          <TableCell*/}
      {/*            sx={{*/}
      {/*              whiteSpace: 'nowrap',*/}
      {/*            }}*/}
      {/*            align="right"*/}
      {/*          >*/}
      {/*            {progressEntry.option.student.facultyname}*/}
      {/*          </TableCell>*/}
      {/*          <TableCell*/}
      {/*            sx={{*/}
      {/*              whiteSpace: 'nowrap',*/}
      {/*            }}*/}
      {/*            align="right"*/}
      {/*          >*/}
      {/*            {progressEntry.option.student.spec}*/}
      {/*          </TableCell>*/}
      {/*          <TableCell*/}
      {/*            sx={{*/}
      {/*              whiteSpace: 'nowrap',*/}
      {/*            }}*/}
      {/*            align="right"*/}
      {/*          >*/}
      {/*            {progressEntry.option.student.year}*/}
      {/*          </TableCell>*/}
      {/*          <TableCell*/}
      {/*            sx={{*/}
      {/*              whiteSpace: 'nowrap',*/}
      {/*            }}*/}
      {/*            align="right"*/}
      {/*          >*/}
      {/*            {(progressEntry.progress / (allVotes || 1)) * 100}% (*/}
      {/*            {progressEntry.progress})*/}
      {/*          </TableCell>*/}
      {/*        </TableRow>*/}
      {/*      ))}*/}
      {/*    </TableBody>*/}
      {/*  </Table>*/}
      {/*</TableContainer>*/}
    </Box>
  );
}
