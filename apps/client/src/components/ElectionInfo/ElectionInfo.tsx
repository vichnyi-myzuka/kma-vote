import { Box, Chip } from '@mui/material';

import { Election } from '@libs/core/database/entities';

import { getShortDate } from '@app/client/utils/elections';
import Typography from '@app/client/components/Typography';
import ElectionStatusChip from '@app/client/components/ElectionStatusChip';
import s from './ElectionInfo.module.scss';

export type ElectionInfoProps = {
  election: Election;
  isVoted?: boolean;
};

export default function ElectionInfo({ election, isVoted }: ElectionInfoProps) {
  const { facultyName, specialtyName, degreeLevel, degreeYear } =
    election.accessScenarioParams.student;
  const hasFilter: boolean =
    !!facultyName ||
    !!degreeLevel ||
    !!degreeYear?.length ||
    !!specialtyName?.length;

  return (
    <Box
      component={'section'}
      marginLeft={'auto'}
      marginRight={'auto'}
      mt={2}
      padding={'32px'}
      maxWidth={1100}
    >
      <div className={s.electionInfo}>
        <Typography
          variant="h2"
          fontWeight={600}
          mb={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {election.name}
          <div className={s.electionInfoChipsContainer}>
            <ElectionStatusChip status={election.status} />
            {election.hide && (
              <ElectionStatusChip
                hidden={election.hide}
                status={election.status}
              />
            )}
            <Chip
              sx={{
                fontWeight: 400,
              }}
              label={`Обмеження голосів: ${
                election.minSelectedOptions === election.maxSelectedOptions
                  ? election.minSelectedOptions
                  : `від ${election.minSelectedOptions} до ${election.maxSelectedOptions}`
              }`}
            />
            {isVoted && (
              <Chip
                sx={{
                  fontWeight: 400,
                }}
                color={'success'}
                label="Ви вже проголосували"
              />
            )}
          </div>
        </Typography>
        <div className={s.electionInfoContainer}>
          <div
            className={s.electionInfoContent}
            style={{
              flexShrink: 0,
            }}
          >
            {election.description && (
              <div className={s.electionInfoContentRow}>
                <>
                  <Typography variant="h6" fontWeight={600}>
                    Опис:
                  </Typography>
                  <Typography>{election.description}</Typography>
                </>
              </div>
            )}
            <div className={s.electionInfoContentColumns}>
              <div className={s.electionInfoContentRow}>
                <Typography variant="h6" fontWeight={600}>
                  Початок голосування:
                </Typography>
                <Typography>{getShortDate(election.startDate)}</Typography>
              </div>
              <div className={s.electionInfoContentRow}>
                <Typography variant="h6" fontWeight={600}>
                  Кінець голосування:
                </Typography>
                <Typography>{getShortDate(election.endDate)}</Typography>
              </div>
            </div>
          </div>
          {hasFilter && (
            <div
              className={s.electionInfoContent}
              style={{
                maxWidth: '400px',
              }}
            >
              <div className={s.electionInfoContentRow}>
                <Typography variant="h6" fontWeight={600}>
                  Доступ до голосування:
                </Typography>
                {facultyName ? (
                  <Typography>{`${facultyName}`}</Typography>
                ) : null}
                {degreeLevel ? (
                  <Typography>{`Рівень: ${degreeLevel}`}</Typography>
                ) : null}
                {degreeYear?.length ? (
                  <Typography>{`Курс: ${degreeYear.join(', ')}`}</Typography>
                ) : null}
                {specialtyName?.length ? (
                  <Typography>{`Спеціальність: ${specialtyName.join(
                    ', ',
                  )}`}</Typography>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
}
