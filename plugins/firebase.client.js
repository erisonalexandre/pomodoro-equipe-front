import Vue from 'vue'
import VueFire from 'vuefire'
import firebase from 'firebase'
import localforage from "localforage";

Vue.use(VueFire)

let firebaseConfig = {
  apiKey: "AIzaSyDxcAemCOIZuGU7_wGN7EkNgf4UgFQ_WW4",
  authDomain: "pomodoro-equipe.firebaseapp.com",
  databaseURL: "https://pomodoro-equipe.firebaseio.com",
  projectId: "pomodoro-equipe",
  storageBucket: "pomodoro-equipe.appspot.com",
  messagingSenderId: "740024813075",
  appId: "1:740024813075:web:5070d5b754d3672629e1e6",
  measurementId: "G-YBCEZVK7YX"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var service = function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./firebase-messaging-sw.js')
      .then(registration => {
        const messaging = firebase.messaging()

        let getToken = () => {
          messaging.getToken()
            .then(currentToken => {
              if (currentToken) {
                console.log('Enviar isso para um servidor:', currentToken)
                return currentToken
              }
              console.warn('Nenhum is disponível, solicite permissão para gerar um')
            });
        }

        messaging.useServiceWorker(registration)

        messaging.requestPermission()
          .then(() => {
            getToken()
          })
        messaging.onMessage(function({data}) {
          localforage.setDriver([
            localforage.INDEXEDDB,
            localforage.WEBSQL,
            localforage.LOCALSTORAGE
          ]).then(function() {
            localforage.getItem('user-id').then(function(readValue) {
              if (data.user === readValue) {
                let audio = new Audio('goes-without-saying.mp3')
                audio.play()
              }
            })
          })
        });
      })
      .catch(err => console.warn('Erro', err))
  }
}

service()
