import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

export const TopGradientContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(80% 50% at 50% -20%, rgb(204, 230, 255), transparent)',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(80% 50% at 50% -20%, rgb(0, 41, 82), transparent)',
    }),
  },
}));