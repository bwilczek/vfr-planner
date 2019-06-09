import React from 'react' // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom'

import Root from './components/Root.jsx'
import store from './store'

const app = document.getElementById('application')

ReactDOM.render(<Root store={store} />, app)
