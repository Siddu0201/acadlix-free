import { 
  // CssBaseline, 
  // StyledEngineProvider, 
  ScopedCssBaseline, 
  ThemeProvider, 
  createTheme 
} from "@mui/material";
import React from "react";

export const defaultPaletteColor = {
  main: {
    primary: "#1976d2",
    secondary: "#9c27b0",
    grey: "#d1d7dc",
    success: "#01cd00",
    error: "#f60400",
    warning: "#FFAB00",
    info: "#03C3EC",
  },
  light: {
    primary: "#66b2ff",
    secondary: "#ba68c8",
    grey: "#eeeeee",
    success: "#e7ffe7",
    error: "#ffe5e6",
    warning: "#FFB826",
    info: "#29CCEF",
  },
  dark: {
    primary: "#1565c0",
    secondary: "#7b1fa2",
    grey: "#bac2c9",
    success: "#489744",
    error: "#952e29",
    warning: "#E89C00",
    info: "#03B1D7",
  },
  contrastText: {
    primary: "#ffffff",
    secondary: "#ffffff",
    grey: "#ffffff",
    success: "#ffffff",
    error: "#ffffff",
    warning: "#ffffff",
    info: "#ffffff",
  },
  text: {
    primary: "rgba(0, 0, 0, 0.87)",
    secondary: "rgba(0, 0, 0, 0.6)",
  }
};

export const defaultTypography = {
  fontSize: {
    h1: {
      desktop: '2.25rem',
      tablet: '2rem',
      mobile: '1.75rem',
    },
    h2: {
      desktop: '1.875rem',
      tablet: '1.625rem',
      mobile: '1.5rem',
    },
    h3: {
      desktop: '1.5rem',
      tablet: '1.375rem',
      mobile: '1.25rem',
    },
    h4: {
      desktop: '1.25rem',
      tablet: '1.125rem',
      mobile: '1rem',
    },
    h5: {
      desktop: '1.125rem',
      tablet: '1rem',
      mobile: '0.9375rem',
    },
    h6: {
      desktop: '1rem',
      tablet: '0.9375rem',
      mobile: '0.875rem',
    },
    body1: {
      desktop: '1rem',
      tablet: '0.9375rem',
      mobile: '0.875rem',
    },
    body2: {
      desktop: '0.875rem',
      tablet: '0.75rem',
      mobile: '0.625rem',
    },
    subtitle1: {
      desktop: '1rem',
      tablet: '0.9375rem',
      mobile: '0.875rem',
    },
    subtitle2: {
      desktop: '0.875rem',
      tablet: '0.75rem',
      mobile: '0.625rem',
    },
  },
  fontWeight: {
    h1: {
      desktop: 700,
      tablet: 700,
      mobile: 700,
    },
    h2: {
      desktop: 600,
      tablet: 600,
      mobile: 600,
    },
    h3: {
      desktop: 600,
      tablet: 600,
      mobile: 600,
    },
    h4: {
      desktop: 600,
      tablet: 600,
      mobile: 600,
    },
    h5: {
      desktop: 600,
      tablet: 600,
      mobile: 600,
    },
    h6: {
      desktop: 600,
      tablet: 600,
      mobile: 600,
    },
    body1: {
      desktop: 400,
      tablet: 400,
      mobile: 400,
    },
    body2: {
      desktop: 400,
      tablet: 400,
      mobile: 400,
    },
    subtitle1: {
      desktop: 400,
      tablet: 400,
      mobile: 400,
    },
    subtitle2: {
      desktop: 500,
      tablet: 500,
      mobile: 500,
    },
  },
  lineHeight: {
    h1: {
      desktop: '1.25',
      tablet: '1.25',
      mobile: '1.25',
    },
    h2: {
      desktop: '1.25',
      tablet: '1.25',
      mobile: '1.25',
    },
    h3: {
      desktop: '1.25',
      tablet: '1.25',
      mobile: '1.25',
    },
    h4: {
      desktop: '1.25',
      tablet: '1.25',
      mobile: '1.25',
    },
    h5: {
      desktop: '1.25',
      tablet: '1.25',
      mobile: '1.25',
    },
    h6: {
      desktop: '1.25',
      tablet: '1.25',
      mobile: '1.25',
    },
    body1: {
      desktop: '1.5',
      tablet: '1.5',
      mobile: '1.5',
    },
    body2: {
      desktop: '1.5',
      tablet: '1.5',
      mobile: '1.5',
    },
    subtitle1: {
      desktop: '1.75',
      tablet: '1.75',
      mobile: '1.75',
    },
    subtitle2: {
      desktop: '1.5',
      tablet: '1.5',
      mobile: '1.5',
    },
  },
  letterSpacing: {
    h1: {
      desktop: '0.3px',
      tablet: '0.3px',
      mobile: '0.3px',
    },
    h2: {
      desktop: '0.3px',
      tablet: '0.3px',
      mobile: '0.3px',
    },
    h3: {
      desktop: '0.3px',
      tablet: '0.3px',
      mobile: '0.3px',
    },
    h4: {
      desktop: '0.3px',
      tablet: '0.3px',
      mobile: '0.3px',
    },
    h5: {
      desktop: '0.3px',
      tablet: '0.3px',
      mobile: '0.3px',
    },
    h6: {
      desktop: '0.3px',
      tablet: '0.3px',
      mobile: '0.3px',
    },
    body1: {
      desktop: '0.3px',
      tablet: '0.3px',
      mobile: '0.3px',
    },
    body2: {
      desktop: '0.3px',
      tablet: '0.3px',
      mobile: '0.3px',
    },
    subtitle1: {
      desktop: '0.3px',
      tablet: '0.3px',
      mobile: '0.3px',
    },
    subtitle2: {
      desktop: '0.3px',
      tablet: '0.3px',
      mobile: '0.3px',
    },
  },
}


const CustomThemeProvider = ({ children }) => {
  const mode = "light";
  const themeColor = "primary";

  const themeSettings = window?.acadlixOptions?.theme_settings;
  const theme = createTheme();

  const themeOptions = createTheme({
    typography: {
      // fontFamily: [
      //   '"Public Sans"',
      //   "san-serif",
      //   "-apple-system",
      //   "BlinkMacSystemFont",
      //   '"Segoe UI"',
      //   "Roboto",
      //   '"Helvetica Neue"',
      //   "Arial",
      //   "sans-serif",
      //   '"Apple Color Emoji"',
      //   '"Segoe UI Emoji"',
      //   '"Segoe UI Symbol"',
      // ].join(","),
      allVariants: {
        color: themeSettings?.palette?.text?.primary ?? defaultPaletteColor.text.primary,
      },
      h1: {
        fontSize: themeSettings?.typography?.h1?.fontSize?.mobile ?? defaultTypography.fontSize.h1.mobile,
        fontWeight: themeSettings?.typography?.h1?.fontWeight?.mobile ?? defaultTypography.fontWeight.h1.mobile,
        lineHeight: themeSettings?.typography?.h1?.lineHeight?.mobile ?? defaultTypography.lineHeight.h1.mobile,
        letterSpacing: themeSettings?.typography?.h1?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.h1.mobile,
        [theme.breakpoints.up('sm')]: {
          fontSize: themeSettings?.typography?.h1?.fontSize?.tablet ?? defaultTypography.fontSize.h1.tablet,
          fontWeight: themeSettings?.typography?.h1?.fontWeight?.tablet ?? defaultTypography.fontWeight.h1.tablet,
          lineHeight: themeSettings?.typography?.h1?.lineHeight?.tablet ?? defaultTypography.lineHeight.h1.tablet,
          letterSpacing: themeSettings?.typography?.h1?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.h1.tablet,
        },
        [theme.breakpoints.up('md')]: {
          fontSize: themeSettings?.typography?.h1?.fontSize?.desktop ?? defaultTypography.fontSize.h1.desktop,
          fontWeight: themeSettings?.typography?.h1?.fontWeight?.desktop ?? defaultTypography.fontWeight.h1.desktop,
          lineHeight: themeSettings?.typography?.h1?.lineHeight?.desktop ?? defaultTypography.lineHeight.h1.desktop,
          letterSpacing: themeSettings?.typography?.h1?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.h1.desktop,
        },
      },
      h2: {
        fontSize: themeSettings?.typography?.h2?.fontSize?.mobile ?? defaultTypography.fontSize.h2.mobile,
        fontWeight: themeSettings?.typography?.h2?.fontWeight?.mobile ?? defaultTypography.fontWeight.h2.mobile,
        lineHeight: themeSettings?.typography?.h2?.lineHeight?.mobile ?? defaultTypography.lineHeight.h2.mobile,
        letterSpacing: themeSettings?.typography?.h2?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.h2.mobile,
        [theme.breakpoints.up('sm')]: {
          fontSize: themeSettings?.typography?.h2?.fontSize?.tablet ?? defaultTypography.fontSize.h2.tablet,
          fontWeight: themeSettings?.typography?.h2?.fontWeight?.tablet ?? defaultTypography.fontWeight.h2.tablet,
          lineHeight: themeSettings?.typography?.h2?.lineHeight?.tablet ?? defaultTypography.lineHeight.h2.tablet,
          letterSpacing: themeSettings?.typography?.h2?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.h2.tablet,
        },
        [theme.breakpoints.up('md')]: {
          fontSize: themeSettings?.typography?.h2?.fontSize?.desktop ?? defaultTypography.fontSize.h2.desktop,
          fontWeight: themeSettings?.typography?.h2?.fontWeight?.desktop ?? defaultTypography.fontWeight.h2.desktop,
          lineHeight: themeSettings?.typography?.h2?.lineHeight?.desktop ?? defaultTypography.lineHeight.h2.desktop,
          letterSpacing: themeSettings?.typography?.h2?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.h2.desktop,
        },
      },
      h3: {
        fontSize: themeSettings?.typography?.h3?.fontSize?.mobile ?? defaultTypography.fontSize.h3.mobile,
        fontWeight: themeSettings?.typography?.h3?.fontWeight?.mobile ?? defaultTypography.fontWeight.h3.mobile,
        lineHeight: themeSettings?.typography?.h3?.lineHeight?.mobile ?? defaultTypography.lineHeight.h3.mobile,
        letterSpacing: themeSettings?.typography?.h3?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.h3.mobile,
        [theme.breakpoints.up('sm')]: {
          fontSize: themeSettings?.typography?.h3?.fontSize?.tablet ?? defaultTypography.fontSize.h3.tablet,
          fontWeight: themeSettings?.typography?.h3?.fontWeight?.tablet ?? defaultTypography.fontWeight.h3.tablet,
          lineHeight: themeSettings?.typography?.h3?.lineHeight?.tablet ?? defaultTypography.lineHeight.h3.tablet,
          letterSpacing: themeSettings?.typography?.h3?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.h3.tablet,
        },
        [theme.breakpoints.up('md')]: {
          fontSize: themeSettings?.typography?.h3?.fontSize?.desktop ?? defaultTypography.fontSize.h3.desktop,
          fontWeight: themeSettings?.typography?.h3?.fontWeight?.desktop ?? defaultTypography.fontWeight.h3.desktop,
          lineHeight: themeSettings?.typography?.h3?.lineHeight?.desktop ?? defaultTypography.lineHeight.h3.desktop,
          letterSpacing: themeSettings?.typography?.h3?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.h3.desktop,
        },
      },
      h4: {
        fontSize: themeSettings?.typography?.h4?.fontSize?.mobile ?? defaultTypography.fontSize.h4.mobile,
        fontWeight: themeSettings?.typography?.h4?.fontWeight?.mobile ?? defaultTypography.fontWeight.h4.mobile,
        lineHeight: themeSettings?.typography?.h4?.lineHeight?.mobile ?? defaultTypography.lineHeight.h4.mobile,
        letterSpacing: themeSettings?.typography?.h4?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.h4.mobile,
        [theme.breakpoints.up('sm')]: {
          fontSize: themeSettings?.typography?.h4?.fontSize?.tablet ?? defaultTypography.fontSize.h4.tablet,
          fontWeight: themeSettings?.typography?.h4?.fontWeight?.tablet ?? defaultTypography.fontWeight.h4.tablet,
          lineHeight: themeSettings?.typography?.h4?.lineHeight?.tablet ?? defaultTypography.lineHeight.h4.tablet,
          letterSpacing: themeSettings?.typography?.h4?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.h4.tablet,
        },
        [theme.breakpoints.up('md')]: {
          fontSize: themeSettings?.typography?.h4?.fontSize?.desktop ?? defaultTypography.fontSize.h4.desktop,
          fontWeight: themeSettings?.typography?.h4?.fontWeight?.desktop ?? defaultTypography.fontWeight.h4.desktop,
          lineHeight: themeSettings?.typography?.h4?.lineHeight?.desktop ?? defaultTypography.lineHeight.h4.desktop,
          letterSpacing: themeSettings?.typography?.h4?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.h4.desktop,
        },
      },
      h5: {
        fontSize: themeSettings?.typography?.h5?.fontSize?.mobile ?? defaultTypography.fontSize.h5.mobile,
        fontWeight: themeSettings?.typography?.h5?.fontWeight?.mobile ?? defaultTypography.fontWeight.h5.mobile,
        lineHeight: themeSettings?.typography?.h5?.lineHeight?.mobile ?? defaultTypography.lineHeight.h5.mobile,
        letterSpacing: themeSettings?.typography?.h5?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.h5.mobile,
        [theme.breakpoints.up('sm')]: {
          fontSize: themeSettings?.typography?.h5?.fontSize?.tablet ?? defaultTypography.fontSize.h5.tablet,
          fontWeight: themeSettings?.typography?.h5?.fontWeight?.tablet ?? defaultTypography.fontWeight.h5.tablet,
          lineHeight: themeSettings?.typography?.h5?.lineHeight?.tablet ?? defaultTypography.lineHeight.h5.tablet,
          letterSpacing: themeSettings?.typography?.h5?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.h5.tablet,
        },
        [theme.breakpoints.up('md')]: {
          fontSize: themeSettings?.typography?.h5?.fontSize?.desktop ?? defaultTypography.fontSize.h5.desktop,
          fontWeight: themeSettings?.typography?.h5?.fontWeight?.desktop ?? defaultTypography.fontWeight.h5.desktop,
          lineHeight: themeSettings?.typography?.h5?.lineHeight?.desktop ?? defaultTypography.lineHeight.h5.desktop,
          letterSpacing: themeSettings?.typography?.h5?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.h5.desktop,
        },
      },
      h6: {
        fontSize: themeSettings?.typography?.h6?.fontSize?.mobile ?? defaultTypography.fontSize.h6.mobile,
        fontWeight: themeSettings?.typography?.h6?.fontWeight?.mobile ?? defaultTypography.fontWeight.h6.mobile,
        lineHeight: themeSettings?.typography?.h6?.lineHeight?.mobile ?? defaultTypography.lineHeight.h6.mobile,
        letterSpacing: themeSettings?.typography?.h6?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.h6.mobile,
        [theme.breakpoints.up('sm')]: {
          fontSize: themeSettings?.typography?.h6?.fontSize?.tablet ?? defaultTypography.fontSize.h6.tablet,
          fontWeight: themeSettings?.typography?.h6?.fontWeight?.tablet ?? defaultTypography.fontWeight.h6.tablet,
          lineHeight: themeSettings?.typography?.h6?.lineHeight?.tablet ?? defaultTypography.lineHeight.h6.tablet,
          letterSpacing: themeSettings?.typography?.h6?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.h6.tablet,
        },
        [theme.breakpoints.up('md')]: {
          fontSize: themeSettings?.typography?.h6?.fontSize?.desktop ?? defaultTypography.fontSize.h6.desktop,
          fontWeight: themeSettings?.typography?.h6?.fontWeight?.desktop ?? defaultTypography.fontWeight.h6.desktop,
          lineHeight: themeSettings?.typography?.h6?.lineHeight?.desktop ?? defaultTypography.lineHeight.h6.desktop,
          letterSpacing: themeSettings?.typography?.h6?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.h6.desktop,
        },
      },
      body1: {
        fontSize: themeSettings?.typography?.body1?.fontSize?.mobile ?? defaultTypography.fontSize.body1.mobile,
        fontWeight: themeSettings?.typography?.body1?.fontWeight?.mobile ?? defaultTypography.fontWeight.body1.mobile,
        lineHeight: themeSettings?.typography?.body1?.lineHeight?.mobile ?? defaultTypography.lineHeight.body1.mobile,
        letterSpacing: themeSettings?.typography?.body1?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.body1.mobile,
        [theme.breakpoints.up('sm')]: {
          fontSize: themeSettings?.typography?.body1?.fontSize?.tablet ?? defaultTypography.fontSize.body1.tablet,
          fontWeight: themeSettings?.typography?.body1?.fontWeight?.tablet ?? defaultTypography.fontWeight.body1.tablet,
          lineHeight: themeSettings?.typography?.body1?.lineHeight?.tablet ?? defaultTypography.lineHeight.body1.tablet,
          letterSpacing: themeSettings?.typography?.body1?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.body1.tablet,
        },
        [theme.breakpoints.up('md')]: {
          fontSize: themeSettings?.typography?.body1?.fontSize?.desktop ?? defaultTypography.fontSize.body1.desktop,
          fontWeight: themeSettings?.typography?.body1?.fontWeight?.desktop ?? defaultTypography.fontWeight.body1.desktop,
          lineHeight: themeSettings?.typography?.body1?.lineHeight?.desktop ?? defaultTypography.lineHeight.body1.desktop,
          letterSpacing: themeSettings?.typography?.body1?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.body1.desktop,
        },
      },
      body2: {
        fontSize: themeSettings?.typography?.body2?.fontSize?.mobile ?? defaultTypography.fontSize.body2.mobile,
        fontWeight: themeSettings?.typography?.body2?.fontWeight?.mobile ?? defaultTypography.fontWeight.body2.mobile,
        lineHeight: themeSettings?.typography?.body2?.lineHeight?.mobile ?? defaultTypography.lineHeight.body2.mobile,
        letterSpacing: themeSettings?.typography?.body2?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.body2.mobile,
        [theme.breakpoints.up('sm')]: {
          fontSize: themeSettings?.typography?.body2?.fontSize?.tablet ?? defaultTypography.fontSize.body2.tablet,
          fontWeight: themeSettings?.typography?.body2?.fontWeight?.tablet ?? defaultTypography.fontWeight.body2.tablet,
          lineHeight: themeSettings?.typography?.body2?.lineHeight?.tablet ?? defaultTypography.lineHeight.body2.tablet,
          letterSpacing: themeSettings?.typography?.body2?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.body2.tablet,
        },
        [theme.breakpoints.up('md')]: {
          fontSize: themeSettings?.typography?.body2?.fontSize?.desktop ?? defaultTypography.fontSize.body2.desktop,
          fontWeight: themeSettings?.typography?.body2?.fontWeight?.desktop ?? defaultTypography.fontWeight.body2.desktop,
          lineHeight: themeSettings?.typography?.body2?.lineHeight?.desktop ?? defaultTypography.lineHeight.body2.desktop,
          letterSpacing: themeSettings?.typography?.body2?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.body2.desktop,
        },
      },
      subtitle1: {
        fontSize: themeSettings?.typography?.subtitle1?.fontSize?.mobile ?? defaultTypography.fontSize.subtitle1.mobile,
        fontWeight: themeSettings?.typography?.subtitle1?.fontWeight?.mobile ?? defaultTypography.fontWeight.subtitle1.mobile,
        lineHeight: themeSettings?.typography?.subtitle1?.lineHeight?.mobile ?? defaultTypography.lineHeight.subtitle1.mobile,
        letterSpacing: themeSettings?.typography?.subtitle1?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.subtitle1.mobile,
        [theme.breakpoints.up('sm')]: {
          fontSize: themeSettings?.typography?.subtitle1?.fontSize?.tablet ?? defaultTypography.fontSize.subtitle1.tablet,
          fontWeight: themeSettings?.typography?.subtitle1?.fontWeight?.tablet ?? defaultTypography.fontWeight.subtitle1.tablet,
          lineHeight: themeSettings?.typography?.subtitle1?.lineHeight?.tablet ?? defaultTypography.lineHeight.subtitle1.tablet,
          letterSpacing: themeSettings?.typography?.subtitle1?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.subtitle1.tablet,
        },
        [theme.breakpoints.up('md')]: {
          fontSize: themeSettings?.typography?.subtitle1?.fontSize?.desktop ?? defaultTypography.fontSize.subtitle1.desktop,
          fontWeight: themeSettings?.typography?.subtitle1?.fontWeight?.desktop ?? defaultTypography.fontWeight.subtitle1.desktop,
          lineHeight: themeSettings?.typography?.subtitle1?.lineHeight?.desktop ?? defaultTypography.lineHeight.subtitle1.desktop,
          letterSpacing: themeSettings?.typography?.subtitle1?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.subtitle1.desktop,
        },
      },
      subtitle2: {
        fontSize: themeSettings?.typography?.subtitle2?.fontSize?.mobile ?? defaultTypography.fontSize.subtitle2.mobile,
        fontWeight: themeSettings?.typography?.subtitle2?.fontWeight?.mobile ?? defaultTypography.fontWeight.subtitle2.mobile,
        lineHeight: themeSettings?.typography?.subtitle2?.lineHeight?.mobile ?? defaultTypography.lineHeight.subtitle2.mobile,
        letterSpacing: themeSettings?.typography?.subtitle2?.letterSpacing?.mobile ?? defaultTypography.letterSpacing.subtitle2.mobile,
        [theme.breakpoints.up('sm')]: {
          fontSize: themeSettings?.typography?.subtitle2?.fontSize?.tablet ?? defaultTypography.fontSize.subtitle2.tablet,
          fontWeight: themeSettings?.typography?.subtitle2?.fontWeight?.tablet ?? defaultTypography.fontWeight.subtitle2.tablet,
          lineHeight: themeSettings?.typography?.subtitle2?.lineHeight?.tablet ?? defaultTypography.lineHeight.subtitle2.tablet,
          letterSpacing: themeSettings?.typography?.subtitle2?.letterSpacing?.tablet ?? defaultTypography.letterSpacing.subtitle2.tablet,
        },
        [theme.breakpoints.up('md')]: {
          fontSize: themeSettings?.typography?.subtitle2?.fontSize?.desktop ?? defaultTypography.fontSize.subtitle2.desktop,
          fontWeight: themeSettings?.typography?.subtitle2?.fontWeight?.desktop ?? defaultTypography.fontWeight.subtitle2.desktop,
          lineHeight: themeSettings?.typography?.subtitle2?.lineHeight?.desktop ?? defaultTypography.lineHeight.subtitle2.desktop,
          letterSpacing: themeSettings?.typography?.subtitle2?.letterSpacing?.desktop ?? defaultTypography.letterSpacing.subtitle2.desktop,
        },
      },
    },
    spacing: (factor) => `${0.25 * factor}rem`,
    shape: {
      borderRadius: 6,
    },
    palette: {
      mode,
      shape: {
        borderRadius: "6px",
      },
      customColors: {
        dark: "219, 219, 235",
        // light: "55, 71, 92",
      },
      primary: {
        main: themeSettings?.palette?.primary?.main ?? defaultPaletteColor?.main[themeColor],
        light: themeSettings?.palette?.primary?.light ?? defaultPaletteColor.light[themeColor],
        dark: themeSettings?.palette?.primary?.dark ?? defaultPaletteColor.dark[themeColor],
        contrastText: themeSettings?.palette?.primary?.contrastText ?? defaultPaletteColor.contrastText[themeColor],
      },
      secondary: {
        main: themeSettings?.palette?.secondary?.main ?? defaultPaletteColor?.main["secondary"],
        light: themeSettings?.palette?.secondary?.light ?? defaultPaletteColor.light["secondary"],
        dark: themeSettings?.palette?.secondary?.dark ?? defaultPaletteColor.dark["secondary"],
        contrastText: themeSettings?.palette?.secondary?.contrastText ?? defaultPaletteColor.contrastText["secondary"],
      },
      grey: {
        main: themeSettings?.palette?.grey?.main ?? defaultPaletteColor.main["grey"],
        light: themeSettings?.palette?.grey?.light ?? defaultPaletteColor.light["grey"],
        dark: themeSettings?.palette?.grey?.dark ?? defaultPaletteColor.dark["grey"],
        contrastText: themeSettings?.palette?.grey?.contrastText ?? defaultPaletteColor.contrastText["grey"],
      },
      success: {
        main: themeSettings?.palette?.success?.main ?? defaultPaletteColor.main["success"],
        light: themeSettings?.palette?.success?.light ?? defaultPaletteColor.light["success"],
        dark: themeSettings?.palette?.success?.dark ?? defaultPaletteColor.dark["success"],
        contrastText: themeSettings?.palette?.success?.contrastText ?? defaultPaletteColor.contrastText["success"],
      },
      error: {
        main: themeSettings?.palette?.error?.main ?? defaultPaletteColor.main["error"],
        light: themeSettings?.palette?.error?.light ?? defaultPaletteColor.light["error"],
        dark: themeSettings?.palette?.error?.dark ?? defaultPaletteColor.dark["error"],
        contrastText: themeSettings?.palette?.error?.contrastText ?? defaultPaletteColor.contrastText["error"],
      },
      warning: {
        main: themeSettings?.palette?.warning?.main ?? defaultPaletteColor.main["warning"],
        light: themeSettings?.palette?.warning?.light ?? defaultPaletteColor.light["warning"],
        dark: themeSettings?.palette?.warning?.dark ?? defaultPaletteColor.dark["warning"],
        contrastText: themeSettings?.palette?.warning?.contrastText ?? defaultPaletteColor.contrastText["warning"],
      },
      info: {
        main: themeSettings?.palette?.info?.main ?? defaultPaletteColor.main["info"],
        light: themeSettings?.palette?.info?.light ?? defaultPaletteColor.light["info"],
        dark: themeSettings?.palette?.info?.dark ?? defaultPaletteColor.dark["info"],
        contrastText: themeSettings?.palette?.info?.contrastText ?? defaultPaletteColor.contrastText["info"],
      },
      ...(mode === "light"
        ? {
          background: {
            paper: "#ffffff",
            default: "#f5f5f9",
          },
          text: {
            primary: themeSettings?.palette?.text?.primary ?? defaultPaletteColor.text.primary,
            secondary: themeSettings?.palette?.text?.secondary ?? defaultPaletteColor.text.secondary,
          },
        }
        : {
          background: {
            paper: "#2b2c40",
            default: "#232333",
          },
          text: {
            primary: "rgba(219, 219, 235, 0.87)",
            secondary: "rgba(219, 219, 235, 0.6)",
          },
        }),
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            padding: `8px 16px`,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: ({ theme }) => ({
            ...theme.typography.h4,
          }),
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: 6,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          sizeSmall: {
            height: 24,
          },
          root: {
            height: 24,
            "&.MuiChip-rounded": {
              borderRadius: "4px",
            },
          },
        },
      },
      MuiDataGrid: {
        defaultProps: {},
        styleOverrides: {
          columnHeaders: ({ theme }) => ({
            borderTop: `1px solid ${theme.palette.grey.light}`,
            borderRadius: 0,
          }),
          root: {
            border: 0,
            borderRadius: 0,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            marginBottom: "0px !important",
          },
          contained: ({ theme, ownerState }) => ({
            "&:hover, &:focus": {
              color: ownerState?.color ? theme.palette[ownerState?.color]?.contrastText : theme.palette[themeColor]?.contrastText,
              backgroundColor: ownerState?.color ? theme.palette[ownerState?.color].dark : theme.palette[themeColor]?.dark,
            },
          }),
          outlined: ({ theme, ownerState }) => ({
            "&:hover, &:focus": {
              color: ownerState?.color ? theme.palette[ownerState?.color]?.contrastText : theme.palette[themeColor]?.contrastText,
              backgroundColor: ownerState?.color ? theme.palette[ownerState?.color].main : theme.palette[themeColor]?.main,
            },
          }),
          text: ({ theme, ownerState }) => ({
            "&:hover, &:focus": {
              color: ownerState?.color ? theme.palette[ownerState?.color]?.contrastText : theme.palette[themeColor]?.contrastText,
              backgroundColor: ownerState?.color ? theme.palette[ownerState?.color].main : theme.palette[themeColor]?.main,
            },
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            "&:hover, &:focus": {
              color: ownerState?.color ? theme.palette?.[ownerState?.color]?.dark : theme.palette[themeColor].dark,
            },
          })
        }
      },
      MuiRadio: {
        root: {
          "& .MuiSvgIcon-root": {
            height: 15,
            width: 15,
          },
          "&.Mui-disabled": {
            input: {
              opacity: "0 !important",
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          img: {
            margin: "0px !important",
          }
        }
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.grey.main,
            "&:hover, &:focus": {
              backgroundColor: theme.palette.grey.dark,
              color: theme.palette.text.primary,
            },
          }),
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            minHeight: "23px !important",
            border: "0 !important",
            boxShadow: "none !important",
          }
        }
      },
    },
  });
  return (
    // <StyledEngineProvider injectFirst>
    <ScopedCssBaseline sx={{
      background: "none",
    }}>
      <ThemeProvider theme={themeOptions}>
        {/* <CssBaseline /> */}
        {children}
      </ThemeProvider>
    </ScopedCssBaseline>
    // </StyledEngineProvider>
  );
};

export default CustomThemeProvider;
