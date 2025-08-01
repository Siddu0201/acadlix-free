import { CssBaseline, ScopedCssBaseline, StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material";
import React from "react";

export const defaultPaletteColor = {
  main: {
    primary: "#1976d2",
    grey: "#d1d7dc",
    success: "#01cd00",
    error: "#f60400",
    warning: "#FFAB00",
    info: "#03C3EC",
  },
  light: {
    primary: "#66b2ff",
    grey: "#eeeeee",
    success: "#e7ffe7",
    error: "#ffe5e6",
    warning: "#FFB826",
    info: "#29CCEF",
  },
  dark: {
    primary: "#1565c0",
    grey: "#bac2c9",
    success: "#489744",
    error: "#952e29",
    warning: "#E89C00",
    info: "#03B1D7",
  },
  contrastText: {
    primary: "#ffffff",
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


const CustomThemeProvider = ({ children }) => {
  const mode = "light";
  const themeColor = "primary";

  const themeOptions = createTheme({
    typography: {
      fontFamily: [
        '"Public Sans"',
        "san-serif",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      // fontSize: 16,
      allVariants: {
        color: acadlixOptions?.theme_settings?.palette?.text?.primary ?? defaultPaletteColor.text.primary,
      },
      // h1: {
      //   fontSize: '3rem', // your custom size
      // },
      // h2: {
      //   fontSize: '2.5rem',
      // },
      // h3: {
      //   fontSize: '2rem',
      // },
      // h4: {
      //   fontSize: '1.5rem',
      // },
      // h5: {
      //   fontSize: '1.25rem',
      // },
      // h6: {
      //   fontSize: '1rem',
      // },
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
        main: acadlixOptions?.theme_settings?.palette?.primary?.main ?? defaultPaletteColor?.main[themeColor],
        light: acadlixOptions?.theme_settings?.palette?.primary?.light ?? defaultPaletteColor.light[themeColor],
        dark: acadlixOptions?.theme_settings?.palette?.primary?.dark ?? defaultPaletteColor.dark[themeColor],
        contrastText: acadlixOptions?.theme_settings?.palette?.primary?.contrastText ?? defaultPaletteColor.contrastText[themeColor],
      },
      grey: {
        main: acadlixOptions?.theme_settings?.palette?.grey?.main ?? defaultPaletteColor.main["grey"],
        light: acadlixOptions?.theme_settings?.palette?.grey?.light ?? defaultPaletteColor.light["grey"],
        dark: acadlixOptions?.theme_settings?.palette?.grey?.dark ?? defaultPaletteColor.dark["grey"],
        contrastText: acadlixOptions?.theme_settings?.palette?.grey?.contrastText ?? defaultPaletteColor.contrastText["grey"],
      },
      success: {
        main: acadlixOptions?.theme_settings?.palette?.success?.main ?? defaultPaletteColor.main["success"],
        light: acadlixOptions?.theme_settings?.palette?.success?.light ?? defaultPaletteColor.light["success"],
        dark: acadlixOptions?.theme_settings?.palette?.success?.dark ?? defaultPaletteColor.dark["success"],
        contrastText: acadlixOptions?.theme_settings?.palette?.success?.contrastText ?? defaultPaletteColor.contrastText["success"],
      },
      error: {
        main: acadlixOptions?.theme_settings?.palette?.error?.main ?? defaultPaletteColor.main["error"],
        light: acadlixOptions?.theme_settings?.palette?.error?.light ?? defaultPaletteColor.light["error"],
        dark: acadlixOptions?.theme_settings?.palette?.error?.dark ?? defaultPaletteColor.dark["error"],
        contrastText: acadlixOptions?.theme_settings?.palette?.error?.contrastText ?? defaultPaletteColor.contrastText["error"],
      },
      warning: {
        main: acadlixOptions?.theme_settings?.palette?.warning?.main ?? defaultPaletteColor.main["warning"],
        light: acadlixOptions?.theme_settings?.palette?.warning?.light ?? defaultPaletteColor.light["warning"],
        dark: acadlixOptions?.theme_settings?.palette?.warning?.dark ?? defaultPaletteColor.dark["warning"],
        contrastText: acadlixOptions?.theme_settings?.palette?.warning?.contrastText ?? defaultPaletteColor.contrastText["warning"],
      },
      info: {
        main: acadlixOptions?.theme_settings?.palette?.info?.main ?? defaultPaletteColor.main["info"],
        light: acadlixOptions?.theme_settings?.palette?.info?.light ?? defaultPaletteColor.light["info"],
        dark: acadlixOptions?.theme_settings?.palette?.info?.dark ?? defaultPaletteColor.dark["info"],
        contrastText: acadlixOptions?.theme_settings?.palette?.info?.contrastText ?? defaultPaletteColor.contrastText["info"],
      },
      ...(mode === "light"
        ? {
          background: {
            paper: "#ffffff",
            default: "#f5f5f9",
          },
          text: {
            primary: acadlixOptions?.theme_settings?.palette?.text?.primary ?? defaultPaletteColor.text.primary,
            secondary: acadlixOptions?.theme_settings?.palette?.text?.secondary ?? defaultPaletteColor.text.secondary,
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
