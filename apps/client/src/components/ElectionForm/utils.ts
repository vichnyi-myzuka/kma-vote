import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { Dayjs } from 'dayjs';
import { GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';

import { BaseStudent } from '@libs/core/database/entities';

export const getNumberInputHandler =
  (setter: Dispatch<SetStateAction<number>>) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(parseInt(event.target.value) || 0);
  };

export const getStringInputHandler =
  (setter: Dispatch<SetStateAction<string>>) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
  };

export const getBooleanInputHandler =
  (setter: Dispatch<SetStateAction<boolean>>) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.checked);
  };

export const getSelectHandler =
  <T>(setter: (value: T) => void) =>
  (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value as T;
    setter(value);
  };

export const getDateTimePickerHandler =
  (setter: (value: Dayjs) => void) => (value: Dayjs | null) => {
    if (value) {
      setter(value);
    }
  };

export const getGridRowSelectionModel = (
  students: BaseStudent[],
): GridRowSelectionModel => {
  return students.map((student) => student.cdoc) as GridRowSelectionModel;
};

export const getStudentsMap = (
  students: BaseStudent[],
): Map<GridRowId, string> => {
  return new Map(students.map((student) => [student.cdoc, student.name]));
};
