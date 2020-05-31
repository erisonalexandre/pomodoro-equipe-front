import Vue from 'vue'
import VueFire from 'vuefire'
import firebase from 'firebase'

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
  console.log('ast')
  if ('serviceWorker' in navigator) {
    console.log('navigator')
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
        messaging.onMessage((payload) => {
          console.log('Message received. ', payload);
        });
      })
      .catch(err => console.warn('Erro', err))
  }
}

service()
