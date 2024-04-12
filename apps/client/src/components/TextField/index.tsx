import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
export default styled(TextField)(() => ({
  '& input.MuiInputBase-input': {
    fontFamily: 'FixelDisplay, sans-serif',
  },
  '& label.MuiFormLabel-root': {
    fontFamily: 'FixelDisplay, sans-serif',
  },
}));
