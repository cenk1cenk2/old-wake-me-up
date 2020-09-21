import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CastEvent } from '@interfaces/event.interface'
import { AppBar as BaseAppBar, Button, Grid, Toolbar as BaseToolbar, Hidden } from '@material-ui/core'
import clsx from 'clsx'
import { debounce } from 'lodash'
import React, { Component, Fragment, FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import styled, { css, DefaultTheme, withTheme } from 'styled-components'

import { Consumer } from './index'
import { ActionTypes, NavigationTypes, NavigationStates, NavigationItems } from './index.interface'
import { TabsNavigation } from './tabs-navigation'

export interface Props {
  transperent?: boolean
  narrow?: boolean
  theme?: DefaultTheme
  project?: {
    name: string
    version: string
    author: string
  }
  extend?: {
    left: FunctionComponent<any>
    right: FunctionComponent<any>
    props: {
      left: any
      right: any
    }
  }
  items?: NavigationItems[]
}

export interface State {
  headerSolid: boolean
}

@(withTheme as any)
export class Header extends Component<Props, State> {
  static defaultProps: Props = {
    transperent: true,
    narrow: true
  }

  static state: State = {
    headerSolid: false
  }

  private watchScroll = debounce(this.handleScroll.bind(this), 100, { leading: true })

  public componentDidMount () {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.watchScroll)
    }
  }

  public componentWillUnmount () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.watchScroll)
    }
  }

  public render () {
    return (
      <Fragment>
        <Consumer>
          {(context) => (
            <Fragment>
              <AppBar
                position="fixed"
                color="transparent"
                className={clsx({ 'reset-shadow': this.props.transperent && !this.state?.headerSolid && context.navigation.state !== NavigationStates.overlay })}
              >
                <Toolbar
                  className={clsx({
                    'transperent-toolbar': this.props?.transperent && !this.state?.headerSolid && context.navigation.state !== NavigationStates.overlay,
                    'narrow-toolbar': this.props.narrow
                  })}
                >
                  <Grid container direction="row" justify="space-between" alignItems="center" spacing={2} wrap="nowrap">
                    <Grid item className="logoField">
                      <Link to="/">
                        <Grid container direction="row" alignItems="center" wrap="nowrap">
                          <Logo>
                            <img src="/imgs/logo/logo.svg" alt={this.props?.project.name} />
                          </Logo>
                          <Title>{this.props?.project.name}</Title>
                        </Grid>
                      </Link>
                    </Grid>
                    {this.props?.extend?.left ? <this.props.extend.left {...this.props.extend.props.left} /> : null}
                    {context.navigation?.type === NavigationTypes.menu && (
                      <Fragment>
                        <Hidden mdUp>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              context.dispatch({ type: ActionTypes['navigation:toggle'] })
                            }}
                          >
                            <FontAwesomeIcon icon={faBars} />
                          </Button>
                        </Hidden>
                      </Fragment>
                    )}
                    {context.navigation?.type === NavigationTypes.header && (
                      <Fragment>
                        <TabsNavigation items={this.props.items} />
                      </Fragment>
                    )}
                    {this.props?.extend?.right ? <this.props.extend.right {...this.props.extend.props.right} /> : null}
                  </Grid>
                </Toolbar>
              </AppBar>
            </Fragment>
          )}
        </Consumer>
      </Fragment>
    )
  }

  private handleScroll (e: Event) {
    const event = e as CastEvent<Window>
    if (event.target.pageYOffset > 50) {
      this.setState({ headerSolid: true })
    } else {
      this.setState({ headerSolid: false })
    }
  }
}

const AppBar = styled(BaseAppBar)(
  ({ theme }) => css`
    overflow: hidden;

    .MuiToolbar-gutters {
      padding-left: ${theme.spacing(2)}px;
      padding-right: ${theme.spacing(2)}px;
    }

    .transperent-toolbar {
      background-color: transparent;
    }

    .MuiPaper-root {
      background-color: ${theme.template.body[2]};
    }

    .narrow-toolbar {
      ${theme.breakpoints.up('lg')} {
        &.MuiToolbar-gutters {
          padding-left: calc((100% - ${theme.breakpoints.values.lg}px) / 2);
          padding-right: calc((100% - ${theme.breakpoints.values.lg}px) / 2);
        }
      }
    }
  `
)

const Toolbar = styled(BaseToolbar)(
  ({ theme }) => css`
    ${animations('headerTransperency', 'background-color')}

    ${theme.breakpoints.up('xs')} {
      &.logoField {
        min-width: ${theme.template.header.logoFieldWidth};
      }
    }
  `
)

const Title = styled.div(
  ({ theme }) => css`
    font-family: ${theme.text.font.heading.name};
    font-size: 28px;
    font-weight: 700;
    line-height: 0;
  `
)

const Logo = styled.div(
  ({ theme }) => css`
    width: 28px;
    margin-right: ${theme.spacing(1)}px;
    padding-top: ${theme.spacing(1)}px;

    img {
      display: inline-block;
    }
  `
)

type AnimationTypes = 'headerTransperency'

export function animations (type: AnimationTypes, property) {
  const o = {
    headerTransperency: css`
      transition: ${property} 0.5s ease-in-out;
    `
  }
  return o[type]
}
