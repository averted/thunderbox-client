// @flow
import React from 'react'
import type { Element } from 'react'
import Helmet from 'react-helmet'
import moment from 'moment'
import { connect } from 'react-redux'
import { inject } from 'decorators'
import type { IRoute, ILocation } from 'types/route'

import { Alerts, Header, Modal } from 'components'
import styles from './styles.css'

@connect((state) => {
  return {
    date: state.App.date,
    error: state.App.error,
    available: state.App.available,
  }
})
@inject(['App'])
export default class AppRoot extends React.Component<{
  children: Element<*>,
  available: boolean,
  date: string,
  error: string,
  modules: {
    App: {
      fetchState: () => {}
    }
  }
}>{
  componentWillMount() {
    const { modules: { App } } = this.props
    App.fetchState()
    //setInterval(() => App.fetchState(), 3000)
  }

  render() {
    const { available, date, error } = this.props

    return (
      <div className={styles.app}>
        <Helmet
          title="Thunderbox"
          meta={[
            { name: 'description', content: 'Thunderbox live status updates' },
            { name: 'keywords', content: 'thunderbox, live, status, updates' },
          ]}
        />

        <span>Available: {available ? 'true' : 'false'}</span>
        <span>Date: {moment(date).fromNow()}</span>

        { error ? (
          <span>Error: {error}</span>
        ) : null }
      </div>
    )
  }
}
