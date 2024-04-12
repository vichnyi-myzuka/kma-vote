import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import { useDebounce } from 'usehooks-ts';
import slugify from 'slugify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextFieldProps,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import * as React from 'react';

import { ElectionDataDto } from '@libs/core/dto';
import { StudentFilter } from '@libs/core/database/types';
import { BaseStudent } from '@libs/core/database/entities';
import { DegreeLevel, ElectionStatus } from '@libs/core/database/enums';

import { loadAllFilterOptions } from '@app/client/api';
import Typography from '@app/client/components/Typography';
import TextField from '@app/client/components/TextField';
import {
  getBooleanInputHandler,
  getDateTimePickerHandler,
  getGridRowSelectionModel,
  getNumberInputHandler,
  getSelectHandler,
  getStringInputHandler,
  getStudentsMap,
} from '@app/client/components/ElectionForm/utils';
import CustomDateTimePicker from '@app/client/components/CustomDateTimePicker';
import SmartSelect from '@app/client/components/SmartSelect';
import StudentsTable from '@app/client/components/StudentsTable';
import StudentsList from '@app/client/components/StudentsList';

const textFieldsProps: TextFieldProps = {
  fullWidth: true,
  variant: 'standard',
  InputLabelProps: {
    shrink: true,
  },
};

export type ElectionFormProps = {
  submitButtonLabel?: string;
  onSubmit?: (electionDataDto: ElectionDataDto) => Promise<void>;
  onError?: (error: any) => void;
  edit?: boolean;
  defaultValue?: {
    voteName?: string;
    voteDescription?: string;
    voteMinOptions?: number;
    voteMaxOptions?: number;
    voteStartDate?: Date;
    voteEndDate?: Date;
    hideElection?: boolean;
    selectedStudents: BaseStudent[];
    accessScenarioParams?: StudentFilter;
  };
};
const defaultStartDate = dayjs(Date.now()).minute(0).add(1, 'day');
const defaultEndDate = dayjs(Date.now()).minute(0).add(1, 'day');

export default function ElectionForm({
  onSubmit,
  onError,
  defaultValue,
  submitButtonLabel,
  edit,
}: ElectionFormProps) {
  const [voteName, setVoteName] = useState<string>(
    defaultValue?.voteName ?? '',
  );
  const [voteDescription, setVoteDescription] = useState<string>(
    defaultValue?.voteDescription ?? '',
  );
  const [voteMinOptions, setVoteMinOptions] = useState<number>(
    defaultValue?.voteMinOptions ?? 1,
  );
  const [voteMaxOptions, setVoteMaxOptions] = useState<number>(
    defaultValue?.voteMaxOptions ?? 1,
  );
  const [voteStartDate, setVoteStartDate] = useState<Dayjs>(
    defaultValue?.voteStartDate
      ? dayjs(defaultValue.voteStartDate)
      : defaultStartDate,
  );
  const [voteEndDate, setVoteEndDate] = useState<Dayjs>(
    defaultValue?.voteEndDate
      ? dayjs(defaultValue.voteEndDate)
      : defaultEndDate,
  );
  const [hideElection, setHideElection] = useState<boolean>(
    defaultValue?.hideElection ?? false,
  );
  const [selectedStudents, setSelectedStudents] =
    useState<GridRowSelectionModel>(
      edit
        ? getGridRowSelectionModel(defaultValue?.selectedStudents ?? [])
        : [],
    );
  const [studentsMap, setStudentsMap] = useState<Map<GridRowId, string>>(
    edit
      ? getStudentsMap(defaultValue?.selectedStudents ?? [])
      : new Map<GridRowId, string>(),
  );

  // Filter states
  const [facultyName, setFacultyName] = useState<string>(
    defaultValue?.accessScenarioParams?.facultyName ?? '',
  );
  const [specialtyName, setSpecialtyName] = useState<string[]>(
    defaultValue?.accessScenarioParams?.specialtyName ?? [],
  );
  const [degreeLevel, setDegreeLevel] = useState<string>(
    defaultValue?.accessScenarioParams?.degreeLevel ?? '',
  );
  const [degreeYear, setDegreeYear] = useState<number[]>(
    defaultValue?.accessScenarioParams?.degreeYear ?? [],
  );

  // Filter options data
  const [facultiesData, setFacultiesData] = useState<string[]>([]);
  const [specialtiesData, setSpecialtiesData] = useState(
    new Map<string, Map<string, string>>(),
  );
  const [degreeLevelsData, setDegreeLevelsData] = useState(
    new Map<string, string>(),
  );
  const [degreeYearsData, setDegreeYearsData] = useState(
    new Map<string, string>(),
  );

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce<string>(searchQuery, 500);

  const getUrlSlug = (name: string) => {
    return slugify(name).toLocaleLowerCase();
  };

  const removeSelectedStudentHandler = (student: GridRowId) => {
    const newSelectedStudents = [...selectedStudents];
    const index = newSelectedStudents.indexOf(student);
    if (index > -1) {
      newSelectedStudents.splice(index, 1);
    }
    setSelectedStudents(newSelectedStudents);
  };

  const resetFilter = () => {
    setFacultyName('');
    setSpecialtyName([]);
    setDegreeLevel('');
    setDegreeYear([]);
  };

  useEffect(() => {
    loadAllFilterOptions(
      (faculties, specialties, degreeLevels, degreeYears) => {
        setFacultiesData(faculties);
        setSpecialtiesData(specialties);
        setDegreeLevelsData(degreeLevels);
        setDegreeYearsData(degreeYears);
      },
    );
  }, []);

  useEffect(() => {
    if (defaultValue?.selectedStudents) {
      setSelectedStudents(
        getGridRowSelectionModel(defaultValue.selectedStudents),
      );
      setStudentsMap(getStudentsMap(defaultValue.selectedStudents));
    }
  }, [defaultValue?.selectedStudents]);
  // States for creating election
  const [loading, setLoading] = useState(false);
  const areAllFieldsFilled =
    voteName &&
    voteMinOptions &&
    voteMaxOptions &&
    voteStartDate &&
    voteEndDate &&
    selectedStudents.length > 0;
  const canSend =
    areAllFieldsFilled &&
    voteStartDate < voteEndDate &&
    voteStartDate > dayjs(Date.now());

  const getElectionDataDto = (): ElectionDataDto => {
    return {
      electionDto: {
        name: voteName,
        urlKey: getUrlSlug(voteName),
        description: voteDescription,
        minSelectedOptions: voteMinOptions,
        maxSelectedOptions: voteMaxOptions,
        startDate: voteStartDate.toDate(),
        endDate: voteEndDate.toDate(),
        hide: hideElection,
        accessScenarioParams: {
          student: {
            facultyName: facultyName,
            degreeLevel: degreeLevel as DegreeLevel,
            specialtyName: specialtyName,
            degreeYear: degreeYear,
          },
        },
        status: ElectionStatus.NOT_STARTED,
      },
      electionOptionDtos: selectedStudents.map((studentId: GridRowId) => {
        return {
          studentId:
            typeof studentId === 'string' ? parseInt(studentId) : studentId,
        };
      }),
    };
  };

  const handleSendButtonClick = async () => {
    setLoading(true);
    try {
      await onSubmit?.(getElectionDataDto());
    } catch (e: any) {
      onError?.(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" autoComplete="off">
        <Box mb={6}>
          <Typography variant="h4" mb={4} mt={2}>
            Загальна інформація
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                id="election-name-input"
                label="Назва голосування"
                {...textFieldsProps}
                disabled={edit}
                value={voteName}
                onChange={getStringInputHandler(setVoteName)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="election-url-key-input"
                label="Ключ посилання голосування"
                disabled
                {...textFieldsProps}
                value={getUrlSlug(voteName)}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="election-description-input"
                    multiline
                    rows={4}
                    label="Опис голосування"
                    sx={{
                      '.MuiInputBase-root': {
                        paddingBottom: '8px',
                      },
                    }}
                    {...textFieldsProps}
                    value={voteDescription}
                    onChange={getStringInputHandler(setVoteDescription)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        type={'number'}
                        error={
                          voteMaxOptions < voteMinOptions &&
                          voteMaxOptions !== 0
                        }
                        id="election-max-options-count-input"
                        label="Максимальна кількість опцій вибору"
                        required
                        {...textFieldsProps}
                        value={voteMaxOptions}
                        onChange={getNumberInputHandler(setVoteMaxOptions)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type={'number'}
                        error={
                          voteMinOptions > voteMaxOptions &&
                          voteMinOptions !== 0
                        }
                        id="election-min-options-count-input"
                        label="Мінімальна кількість опцій вибору"
                        required
                        {...textFieldsProps}
                        value={voteMinOptions}
                        onChange={getNumberInputHandler(setVoteMinOptions)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} mt={4}>
              <CustomDateTimePicker
                label="Дата початку голосування"
                value={voteStartDate}
                minDateTime={dayjs(Date.now())}
                onChange={getDateTimePickerHandler(setVoteStartDate)}
              />
            </Grid>
            <Grid item xs={6} mt={4}>
              <CustomDateTimePicker
                label="Дата закінчення голосування"
                value={voteEndDate}
                minDateTime={voteStartDate}
                onChange={getDateTimePickerHandler(setVoteEndDate)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={hideElection}
                    onChange={getBooleanInputHandler(setHideElection)}
                  />
                }
                label="Приховати голосування"
              />
            </Grid>
          </Grid>
        </Box>
        <Box mt={8}>
          <Typography variant="h4" mb={4}>
            Доступ до голосування
          </Typography>
          <Grid container spacing={2} mb={4}>
            <Grid item xs={6}>
              <SmartSelect
                innerSelectProps={{
                  label: 'Назва факультету',
                  labelId: 'faculty-name-select-label',
                  id: 'faculty-name-select',
                  value: facultyName,
                  onChange: getSelectHandler((value: string) => {
                    setFacultyName(value);
                    setDegreeLevel('');
                    setSpecialtyName([]);
                  }),
                }}
                optionsData={facultiesData}
                optionsDeps={[facultiesData]}
              />
            </Grid>
            <Grid item xs={6}>
              <SmartSelect
                innerSelectProps={{
                  label: 'Ступінь',
                  labelId: 'degree-level-select-label',
                  id: 'degree-level-select',
                  disabled: !facultyName,
                  value: degreeLevel,
                  onChange: getSelectHandler((value: string) => {
                    setDegreeLevel(value);
                    setSpecialtyName([]);
                    setDegreeYear([]);
                  }),
                }}
                optionsData={degreeLevelsData}
                optionsDeps={[facultyName, degreeLevelsData]}
                hasGroupRoot={true}
                groupRoot={facultyName}
              />
            </Grid>
            <Grid item xs={6}>
              <SmartSelect
                innerSelectProps={{
                  label: 'Назва cпеціальності',
                  labelId: 'specialty-name-select-label',
                  id: 'specialty-name-select',
                  multiple: true,
                  disabled: !facultyName || !degreeLevel,
                  value: specialtyName,
                  onChange: getSelectHandler((value: string[]) => {
                    if (value.includes('')) {
                      setSpecialtyName([]);
                    } else {
                      setSpecialtyName(value);
                    }
                  }),
                }}
                hasGroupRoot={true}
                hasSecondaryGroupRoot={true}
                optionsData={specialtiesData}
                optionsDeps={[facultyName, degreeLevel, specialtiesData]}
                groupRoot={facultyName}
                secondaryGroupRoot={degreeLevel}
              />
            </Grid>
            <Grid item xs={6}>
              <SmartSelect
                innerSelectProps={{
                  label: 'Рік навчання',
                  labelId: 'degree-year-select-label',
                  id: 'degree-year-select',
                  multiple: true,
                  disabled: !degreeLevel,
                  value: degreeYear,
                  onChange: getSelectHandler((value: number[]) => {
                    setDegreeYear(value);
                  }),
                }}
                optionsData={degreeYearsData}
                optionsDeps={[degreeLevel, degreeYearsData]}
                groupRoot={degreeLevel}
                hasGroupRoot={true}
              />
            </Grid>
          </Grid>
          <Button onClick={resetFilter}>Зкинути фільтр</Button>
        </Box>
        <Box mt={8}>
          <Typography variant="h4" mb={4}>
            Кандидати
          </Typography>
          <Box mb={4}>
            <Grid container spacing={4}>
              <Grid item xs={8}>
                <TextField
                  id="search-student-input"
                  label="Пошук по ПІБ студента"
                  {...textFieldsProps}
                  value={searchQuery}
                  onChange={getStringInputHandler(setSearchQuery)}
                />
                <Box mt={4}>
                  <StudentsTable
                    searchQuery={debouncedSearchQuery}
                    selectedStudents={selectedStudents}
                    setSelectedStudents={setSelectedStudents}
                    studentsMap={studentsMap}
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" marginBottom={'46px'}>
                  Обрані Кандидати
                </Typography>
                <StudentsList
                  studentsSelectionModel={selectedStudents}
                  studentsData={studentsMap}
                  onDeleteIconClick={removeSelectedStudentHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  onClick={handleSendButtonClick}
                  disabled={!canSend}
                  loading={loading}
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: 'none', marginTop: '24px' }}
                >
                  <span style={{ display: 'block' }}>
                    {submitButtonLabel ?? 'Створити голосування'}
                  </span>
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
