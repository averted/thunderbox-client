// @flow
import update from 'react-addons-update'
import * as App from 'actions/app'

type State = {
  date: any,
  error: any,
  available: boolean
}

type Action = {
  type: string,
  error?: string,
  state: {
    date: string,
    available: boolean
  }
}

const initialState = {
  date: null,
  error: null,
  available: true
}

export default function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case App.FETCH_STATE:
      return update(state, {
        date: { $set: action.state.date },
        error: { $set: null },
        available: { $set: action.state.available },
      })

    case App.FETCH_STATE_ERROR:
      return update(state, {
        error: { $set: action.error }
      })

    default:
      return state
  }
}
