import { styled } from '@mui/material/styles';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

export default styled(MuiAccordionDetails)(({ theme }) => ({
  fontFamily: 'FixelDisplay, sans-serif',
  padding: theme.spacing(2),
  borderTop: '1px solid #0046de',
}));
