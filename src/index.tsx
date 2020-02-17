import firebase from 'firebase/app'
import 'firebase/auth'
import React from 'react'
import ReactDOM from 'react-dom'
import firebaseConfig from 'resources/firebaseConfig'
import App from './App'
import './index.css'
import * as serviceWorker from './serviceWorker'

firebase.initializeApp(firebaseConfig)

const unsubscribe = firebase.auth()
	.onAuthStateChanged(x => {
		unsubscribe()
		ReactDOM.render(<App />, document.getElementById('root'))
	})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()