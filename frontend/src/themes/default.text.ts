import { ITheme } from '@interfaces/theme.interface'

export const text: ITheme['text'] = {
  font: {
    heading: { name: 'Roboto' },
    default: { name: 'Roboto' }
  },
  typography: {
    heading: {
      h1: {
        fontSize: '3em'
      },
      h2: {
        fontSize: '2.5em'
      },
      h3: {
        fontSize: '2.25em'
      },
      h4: {
        fontSize: '2em'
      },
      h5: {
        fontSize: '1.5em'
      },
      h6: {
        fontSize: '1.25em'
      }
    },
    default: {
      p: {
        fontSize: '1em'
      },
      small: {
        fontSize: '0.8em'
      }
    }
  },
  settings: {
    options: {
      fontSize: 16
    },
    heading: {
      color: 'inherit',
      smallColor: '#777777',
      fontWeight: 700,
      lineHeight: 1.2
    },
    default: {
      fontWeight: 400,
      lineHeight: 1
    }
  }
}
