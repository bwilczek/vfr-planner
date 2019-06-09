import React from 'react'
import { setGlobal } from 'reactn'
import addReactNDevTools from 'reactn-devtools'
import ReactDOM from 'react-dom'
import App from './App'

setGlobal({
  point: {name: 'loading...'},
  error: 'none'
})

addReactNDevTools()
ReactDOM.render(<App />, document.getElementById('root'))
