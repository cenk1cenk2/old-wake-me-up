import { createGlobalStyle, css, DefaultTheme } from 'styled-components'

export const GlobalStyles = createGlobalStyle(
  ({ theme }) => css`
    ${body()}
    ${icons()}
    ${links(theme)}
  `
)

function body () {
  const o = `
  body {
    overflow-x: hidden;
    height: 100%;
    width: 100%;
    margin: 0;
    z-index: 0;
  }
  `
  return css`
    ${o}
  `
}

function icons () {
  return css`
    .svg-inline--fa {
      font-size: 0.85em;
    }
  `
}

function links (theme: DefaultTheme) {
  return css`
    // Links
    a {
      color: ${theme.colors.primary};
      transition: color 0.12s ease-out;
      &.subtle {
        color: ${theme.colors.text};
        text-decoration: none;
        &:hover,
        &:focus {
          color: ${theme.colors.text};
          text-decoration: none;
        }
      }
      &.link-effect {
        position: relative;
        &:before {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          content: '';
          background-color: ${theme.colors.success};
          visibility: hidden;
          transform: scaleX(0);
          transition: transform 0.12s ease-out;
        }
      }
      &:hover,
      &:focus {
        color: ${theme.colors.primary};
        text-decoration: ${theme.colors.primary};
        &.link-effect:before {
          visibility: visible;
          transform: scaleX(1);
        }
      }
      &:active {
        color: ${theme.colors.primary};
      }
      &.inactive {
        cursor: not-allowed;
        &:focus {
          background-color: transparent !important;
        }
      }
    }
  `
}

function progress (theme: DefaultTheme) {
  return css`
    /* Make clicks pass-through */
    #nprogress {
      pointer-events: none;
    }
    #nprogress .bar {
      background: #efefef;
      position: fixed;
      z-index: 9999;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
    }
    /* Fancy blur effect */
    #nprogress .peg {
      display: block;
      position: absolute;
      right: 0px;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 5px ${theme.colors.secondary}, 0 0 5px ${theme.colors.primary};
      opacity: 1;
      -webkit-transform: rotate(3deg) translate(0px, -4px);
      -ms-transform: rotate(3deg) translate(0px, -4px);
      transform: rotate(3deg) translate(0px, -4px);
    }
    /* Remove these to get rid of the spinner */
    #nprogress .spinner {
      display: block;
      position: fixed;
      z-index: 9999;
      top: 15px;
      right: 15px;
    }
    #nprogress .spinner-icon {
      width: 18px;
      height: 18px;
      box-sizing: border-box;
      border: solid 2px transparent;
      border-top-color: #efefef;
      border-left-color: #efefef;
      border-radius: 50%;
      -webkit-animation: nprogress-spinner 400ms linear infinite;
      animation: nprogress-spinner 400ms linear infinite;
    }
    .nprogress-custom-parent {
      overflow: hidden;
      position: relative;
    }
    .nprogress-custom-parent #nprogress .spinner,
    .nprogress-custom-parent #nprogress .bar {
      position: absolute;
    }
    @-webkit-keyframes nprogress-spinner {
      0% {
        -webkit-transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
    @keyframes nprogress-spinner {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `
}
