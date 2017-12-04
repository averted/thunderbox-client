// @flow
import React from 'react'
import { bindActionCreators } from 'redux'

import * as appActions from 'actions'

export default (modules: Array<string>) => (DecoratedComponent: Function) => {
  return class extends React.Component<{}> {
    modules: Object

    constructor(props: Object) {
      super(props)
      this.modules = {}
      const actions = { ...appActions }

      modules.map((module) => {
        const action = actions[module]

        if (!action) {
          throw new Error(`Module Injection Error: Could not find '${ module }' in actions.`)
        }

        this.modules[module] = bindActionCreators(action, props.dispatch)
      })
    }

    render() {
      return <DecoratedComponent modules={this.modules} {...this.props} />
    }
  }
}
