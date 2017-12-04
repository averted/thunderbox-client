// @flow
import request from 'isomorphic-fetch'

/**
 * Action constants
 */
export const FETCH_STATE = 'FETCH_STATE'
export const FETCH_STATE_ERROR = 'FETCH_STATE_ERROR'

/**
 * Action creators
 */
export function fetchState() {
  return (dispatch: Function) => {
    return request('http://localhost:3020/status', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(x => x.json()).then(state => {
      if (!state || state.error) {
        return dispatch({ type: FETCH_STATE_ERROR, error: state.error })
      }

      dispatch({ type: FETCH_STATE, state })
    })
  }
}
