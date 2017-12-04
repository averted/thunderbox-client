// @flow
import React from 'react'
import cn from 'classnames'

import styles from './styles.css'

export default class Button extends React.Component<{
  type: 'text' | 'submit',
  danger?: boolean,
  success?: boolean,
  children: any,
  className: string,
}>{
  static defaultProps = {
    type: 'button'
  }

  render() {
    const { type, danger, success, className, children, ...rest } = this.props

    return (
      <button
        type={type}
        className={cn('sp-button', styles.button, className, {
          [styles.danger]: danger,
          [styles.success]: success
        })}
        {...rest}>
        { children }
      </button>
    )
  }
}
