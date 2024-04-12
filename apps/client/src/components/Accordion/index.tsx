import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';

export default styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  fontFamily: 'FixelDisplay, sans-serif',
  border: `1px solid ${theme.palette.divider}`,
  borderColor: '#0046de',
  // "&:not(:last-child)": {
  //   borderBottom: 0,
  // },
  '&:before': {
    display: 'none',
  },
}));
