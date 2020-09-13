import { inject as mobxInject, Provider } from 'mobx-react'
import * as React from 'react'

import { AllStores, StoreMapping } from './inject-stores.interface'

export function inject<I extends AllStores> (...stores: I[]) {
  return <P extends unknown>(node: React.ComponentType<P>): React.ComponentType<Pick<P, Exclude<keyof P, I>>> => {
    return mobxInject(...stores)(node) as any
  }
}

export const InjectProvider: React.FunctionComponent<{ stores: StoreMapping }> = ({ children, stores }) => {
  return <Provider {...stores}>{children}</Provider>
}
