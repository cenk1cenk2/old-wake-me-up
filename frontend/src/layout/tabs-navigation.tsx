import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tabs, Tab } from '@material-ui/core'
import React, { Component, Fragment } from 'react'

import { NavigationItems } from './index.interface'

interface Props {
  items?: NavigationItems[]
}

export class TabsNavigation extends Component<Props> {
  public render () {
    return (
      <Fragment>
        <Tabs value={1} indicatorColor="secondary" textColor="primary" variant="scrollable" scrollButtons="auto">
          {this.props.items?.map((item) => {
            return <Tab label={item.name} icon={<FontAwesomeIcon icon={item.icon} />} value={item.url} key={item.url} />
          })}
        </Tabs>
      </Fragment>
    )
  }
}
