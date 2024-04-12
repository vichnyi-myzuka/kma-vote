import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowSelectionModel,
} from '@mui/x-data-grid';

import { BaseStudentOutputDto } from '@libs/core/dto';

interface PaginationModel {
  page: number;
  pageSize: number;
}

export function useStudents(paginationModel: PaginationModel, name: string) {
  const [isLoading, setLoading] = useState(false);
  const [rows, setRows] = useState<BaseStudentOutputDto[]>([]);
  const [pageInfo, setPageInfo] = useState({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    total: 0,
  });

  useEffect(() => {
    const getRows = async () => {
      setLoading(true);
      const {
        data: { data, total },
      } = await axios.get(`${process.env.DOMAIN}/api/student/search`, {
        params: {
          skip: paginationModel.page * paginationModel.pageSize,
          take: paginationModel.pageSize,
          name,
        },
      });
      setRows(data as BaseStudentOutputDto[]);
      setPageInfo(() => ({
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        total,
      }));
      setLoading(false);
    };
    getRows();
  }, [paginationModel, name]);

  return { isLoading, rows, pageInfo };
}

interface StudentTableProps {
  searchQuery: string;
  selectedStudents: GridRowSelectionModel;
  setSelectedStudents: (newRowSelectionModel: GridRowSelectionModel) => void;
  studentsMap: Map<GridRowId, string>;
}

export default function StudentsTable({
  searchQuery,
  selectedStudents,
  setSelectedStudents,
  studentsMap,
}: StudentTableProps) {
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [isPageChanged, setPageChanged] = useState(false);
  const [isSearchQueryChangedFirstTime, setSearchQueryChangedFirstTime] =
    useState(false);
  const [isSearchQueryChanged, setSearchQueryChanged] = useState(false);

  const { isLoading, rows, pageInfo } = useStudents(
    paginationModel,
    searchQuery,
  );

  const [rowCountState, setRowCountState] = useState(pageInfo?.total || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pageInfo?.total !== undefined ? pageInfo?.total : prevRowCountState,
    );
  }, [pageInfo?.total, setRowCountState]);

  useEffect(() => {
    if (isSearchQueryChangedFirstTime) {
      setSearchQueryChanged(true);
    } else {
      setSearchQueryChangedFirstTime(true);
    }
  }, [searchQuery]);

  useEffect(() => {
    setRowSelectionModel(selectedStudents);
  }, [selectedStudents]);

  const data: { columns: GridColDef[] } = {
    columns: [
      { field: 'cdoc', headerName: 'ID' },
      { field: 'name', headerName: 'ПІБ', width: 300 },
      { field: 'year', headerName: 'Рік вступу', width: 100 },
      { field: 'level', headerName: 'Ступінь', width: 150 },
      { field: 'facultyname', headerName: 'Факультет', width: 300 },
      { field: 'spec', headerName: 'Спеціальність', width: 300 },
      { field: 'ukma_email', headerName: 'Email', width: 300 },
    ],
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        {...data}
        rowCount={rowCountState}
        loading={isLoading}
        pageSizeOptions={[5, 10, 20, 50]}
        paginationModel={paginationModel}
        paginationMode="server"
        getRowId={(row) => row.cdoc}
        onPaginationModelChange={(newPaginationModel) => {
          setPaginationModel(newPaginationModel);
          setPageChanged(true);
        }}
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          if (isPageChanged || isSearchQueryChanged) {
            setRowSelectionModel(selectedStudents);
            setPageChanged(false);
            setSearchQueryChanged(false);
          } else {
            setSelectedStudents(newRowSelectionModel);
            setRowSelectionModel(newRowSelectionModel);
            newRowSelectionModel.forEach((id) => {
              if (!studentsMap.has(id)) {
                const student = rows.find((row) => row.cdoc === id);
                if (student) {
                  studentsMap.set(id, student.name);
                }
              }
            });
          }
        }}
        rowSelectionModel={rowSelectionModel}
      />
    </div>
  );
}
