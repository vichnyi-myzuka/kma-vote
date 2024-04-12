import { GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, IconButton, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export type StudentsListProps = {
  studentsSelectionModel: GridRowSelectionModel;
  studentsData: Map<GridRowId, string>;
  onDeleteIconClick: (student: GridRowId) => void;
};
export default function StudentsList({
  studentsSelectionModel,
  studentsData,
  onDeleteIconClick,
}: StudentsListProps) {
  return (
    <Box>
      <List
        sx={{
          maxHeight: '400px',
          height: '400px',
          overflow: 'auto',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(224, 224, 224, 1)',
          borderRadius: '4px',
          padding: 0,
        }}
      >
        {studentsSelectionModel.map((student) => (
          <ListItem
            key={student}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => {
                  onDeleteIconClick(student);
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={studentsData.get(student)} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
