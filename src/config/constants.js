import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyCN6obmCKRuRNpCGoQvMR8vKCC8bBGrqu4",
  authDomain: "gospel-blocks-1dcdb.firebaseapp.com",
  databaseURL: "https://gospel-blocks-1dcdb.firebaseio.com",
}

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const db = firebase.database()
export const firebaseAuth = firebase.auth
