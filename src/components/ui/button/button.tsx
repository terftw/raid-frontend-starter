import deepMerge from '@/utils/deepMerge';
import styled from '@emotion/styled';
import type { ButtonProps, PaletteColorOptions, Theme } from '@mui/material';
import { Button as MuiButton, useTheme } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

type Props = ButtonProps & {
  gradient?: boolean;
  shape?: 'rounded' | 'default';
  customColor?: 'success' | 'warning' | 'info' | 'error' | 'invert';
};

const makeGradientStyles = ({ disabled, variant }: Props) => {
  if (variant !== 'contained') {
    return {};
  }

  return {
    primary: {
      color: '#fff !important',
      background: `linear-gradient(90deg, rgba(143, 51, 255, 0.76) 28.95%, rgba(215, 11, 251, 0.79) 100%)`,
      opacity: disabled ? '0.5 !important' : undefined,
    },
    secondary: undefined,
    default: undefined,
    inherit: undefined,
  };
};

const getInvertPaletteColor = (theme: Theme) => {
  const bgColor =
    theme.palette.mode === 'light'
      ? theme.palette.common.black
      : theme.palette.common.white;

  const palette: PaletteColorOptions = {
    main: bgColor,
    contrastText: theme.palette.getContrastText(bgColor),
  };

  return palette;
};

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (property) =>
    !['shape', 'gradient'].includes(property.toString()),
})<Props>((props) => {
  const { color = 'default', gradient, shape } = props;

  const gradientStyles = makeGradientStyles(props) as Record<
    string,
    { color: string; background: string; opacity?: string }
  >;

  return {
    borderRadius: shape === 'rounded' ? '25px' : undefined,
    ...(gradient && gradientStyles[color]),
  };
});

const Button: React.FunctionComponent<Props> = ({
  color,
  customColor,
  ...props
}) => {
  const theme = useTheme();
  let customPrimaryPalette: PaletteColorOptions = {};

  if (customColor) {
    customPrimaryPalette =
      customColor === 'invert'
        ? getInvertPaletteColor(theme)
        : theme.palette[customColor];
  }

  return (
    <MuiThemeProvider
      theme={(defaultTheme) =>
        deepMerge({}, defaultTheme, {
          palette: {
            primary: customPrimaryPalette,
          },
        })
      }
    >
      <StyledButton {...props} color={customColor ? 'primary' : color} />
    </MuiThemeProvider>
  );
};

export type { Props };
export default Button;
