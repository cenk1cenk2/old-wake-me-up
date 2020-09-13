import { ITheme } from '@interfaces/theme.interface'
import { createMuiTheme } from '@material-ui/core/styles'

import { text } from './default.text'

const colors: ITheme['colors'] = {
  primary: '#F0CE5C',
  secondary: '#E3B505',
  success: '#78F029',
  warning: '#F0CE5C',
  error: '#F01C34',
  text: '#efefef',
  muted: '#777777'
}

const template: ITheme['template'] = {
  body: {
    0: '#121212',
    1: '#1c1c1c',
    2: '#282828'
  },
  header: {
    headerSizeMin: '60px',
    logoFieldWidth: '230px'
  },
  navigation: {
    width: '230px',
    collapseWidth: '60px'
  }
}

const muiTheme = createMuiTheme({
  spacing: 8,
  palette: {
    type: 'dark',
    background: {
      default: template.body[0],
      paper: template.body[1]
    },
    text: {
      primary: colors.text
    },
    primary: {
      main: colors.primary
    },
    secondary: {
      main: colors.secondary
    },
    success: {
      main: colors.success
    },
    warning: {
      main: colors.warning
    },
    error: {
      main: colors.error
    }
  },
  typography: {
    fontFamily: 'Roboto',
    fontSize: 16,
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    subtitle1: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.1
    },
    subtitle2: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.1
    },
    body1: {
      fontSize: '1.1rem',
      fontWeight: 400,
      lineHeight: 1
    },
    body2: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1
    },
    button: {
      fontSize: '1.1rem'
    },
    caption: {
      fontSize: '1.1rem'
    },
    overline: {
      fontSize: '1rem'
    }
  },
  mixins: {
    toolbar: {
      minHeight: template.header.headerSizeMin,
      background: template.body[2]
    }
  },
  overrides: {
    MuiCssBaseline: {

    }
  },
  shape: {
    borderRadius: 0
  },
  zIndex: {
    drawer: 1050,
    appBar: 1100
  }
})

export const DarkTheme: ITheme = {
  colors,
  text,
  template,
  ...muiTheme
}
