import React, { Component } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import {
  Provider as MatiProvider,
  reducer as matiReducer
} from './components/mati'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import App from './App'

const MATI_CLIENT_ID = '5b50cd531a76d77ba81818e2'

const reducers = combineReducers({
  mati: matiReducer
})
const store = createStore(reducers, applyMiddleware(ReduxThunk))

class Root extends Component {
  render() {
    return (
      <ReduxProvider store={store}>
        <MatiProvider value={{ clientId: MATI_CLIENT_ID }}>
          <App />
        </MatiProvider>
      </ReduxProvider>
    )
  }
}

export default Root
