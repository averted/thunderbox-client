// @flow
import React from 'react'
import type { Element } from 'react'
import { findDOMNode } from 'react-dom'
import Helmet from 'react-helmet'
import moment from 'moment'
import Chart from 'chart.js'

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
    graph: state.App.graph,
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
    setInterval(() => App.fetchState(), 3000)
  }

  componentDidMount() {
    this._node = findDOMNode(this.chart)
    this._chart = null
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

  renderGraph() {
    const { graph } = this.props

    if (this._chart) {
      this._chart.data.datasets[0].data = Object.values(graph)
      return this._chart.update()
    }

    const data = {
      labels: Object.keys(graph).map(x => `${x}:00`),
      datasets: [{
        data: Object.values(graph),
        fill: false,
        borderWidth: 2,
        borderColor: 'red',
        lineTension: 0.2,
        borderJoinStyle: 'round',
        pointBorderColor: 'red',
        pointBackgroundColor: 'black',
        pointHoverBorderColor: 'red', // TODO (style config bg color)
        pointHoverBackgroundColor: 'black', // TODO (style config bg color)
      }]
    }

    const options = {
      responsive: true,
      layout: {
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        }
      },
      legend: {
        display: false,
      },
      tooltips: {
        titleFontFamily: "'Fira Mono', monospace",
        bodyFontFamily: "'Fira Mono', monospace",
        bodySpacing: 5,
      },
      scales: {
        yAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false,
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            fontColor: '#777',
            fontStyle: 'bold',
            fontFamily: "'Fira Mono', monospace",
          }
        }]
      },
      elements: {
        point: {
          pointStyle: 'circle',
          borderWidth: 1,
          radius: 3,
          hoverRadius: 5,
          hoverBorderWidth: 0,
          hitRadius: 50,
        }
      }
    }

    this._chart = new Chart(this._node.getContext('2d'), {
      type: 'line',
      data,
      options
    })
  }

  render() {
    if (this._node) {
      this.renderGraph()
    }

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
          <a href="https://github.com/averted" target="_blank">github.com/averted</a>
          <a href="https://github.com/thunderbox-client" target="_blank">github.com/thunderbox-client</a>
          <a href="https://github.com/thunderbox-server" target="_blank">github.com/thunderbox-server</a>
        </footer>

        <canvas ref={x => this.chart = x} width="400" height="160"></canvas>
      </div>
    )
  }
}
