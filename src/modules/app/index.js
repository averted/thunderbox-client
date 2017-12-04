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

  renderStatus() {
    const { available } = this.props
    return (
      <span className={styles.status}>
        <span>{'Status:'}</span>
        {available ? (
          <span className={styles.success}>Empty</span>
        ) : (
          <span className={styles.danger}>Occupied</span>
        )}
      </span>
    )
  }

  renderDate() {
    const { date } = this.props
    return (
      <span className={styles.date}>
        <span>{'Active:'}</span>
        <span>{moment(date).fromNow()}</span>
      </span>
    )
  }

  renderError() {
    const { error } = this.props
    return error ? (
      <span>{`Error: ${error}`}</span>
    ) : null
  }

  render() {
    return (
      <div className={styles.app}>
        <Helmet
          title="Thunderbox"
          meta={[
            { name: 'description', content: 'Thunderbox live status updates' },
            { name: 'keywords', content: 'thunderbox, live, status, updates' },
          ]}
        />

        <section>
          {this.renderStatus()}
          {this.renderDate()}
          {this.renderError()}
        </section>

        <footer>
          <span>Alexander Vitiuk</span>
          <a href="https://github.com/averted" target="_blank">github.com/averted</a>
          <a href="https://github.com/thunderbox-client" target="_blank">github.com/thunderbox-client</a>
          <a href="https://github.com/thunderbox-server" target="_blank">github.com/thunderbox-server</a>
        </footer>
      </div>
    )
  }
}
