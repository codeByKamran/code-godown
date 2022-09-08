const { palette, paletteDark } = require("./theming/palette");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./theming/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: palette.primary,
        primaryDark: palette.primaryDark,
        primaryLight: palette.primaryLight,
        secondary: palette.secondary,
        secondaryDark: palette.secondaryDark,
        secondaryLight: palette.secondaryLight,

        primaryText: palette.primaryText,
        secondaryText: palette.secondaryText,
        infoText: palette.infoText,

        primaryTextDark: paletteDark.primaryText,
        secondaryTextDark: paletteDark.secondaryText,
        infoTextDark: paletteDark.infoText,

        dividerColor: palette.dividerColor,
        dividerColorDark: paletteDark.dividerColor,

        borderColor: palette.borderColor,
        borderColorDark: paletteDark.borderColor,

        backgroundV1: palette.backgroundColor1,
        backgroundV2: palette.backgroundColor2,
        backgroundContrast: palette.backgroundContrastColor,

        backgroundV1Dark: paletteDark.backgroundColor1,
        backgroundV2Dark: paletteDark.backgroundColor2,
        backgroundContrastDark: paletteDark.backgroundContrastColor,

        success: palette.success,
        warning: palette.warning,
        error: palette.error,
        info: palette.info,
      },
      fontSize: {
        xs: "11px",
        sm: "13px",
        base: "15px",
        lg: "1.125rem",
        xl: "1.25rem",
      },
    },
    fontFamily: {
      sans: ["Inter", "Roboto", "sans-serif"],
    },
  },
};
