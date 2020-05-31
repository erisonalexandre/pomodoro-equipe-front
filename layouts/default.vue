<template>
  <div>
    <nuxt />
  </div>
</template>
<script>
  import Pusher from 'pusher-js';
  export default {
      data() {
        return {
            channel: null,
            pusher: null
        }
      },
      created () {
          // this.pusher = new Pusher('72fe6a41884caa7595e1', {
          //     cluster: 'us2'
          // });
          //
          // this.channel = this.pusher.subscribe('my-channel');
          // this.channel.bind('my-event', function(data) {
          //     console.log(data)
          //     // app.messages.push(JSON.stringify(data));
          // });
          console.log('criado')
          // window.Echo.channel('my-channel')
          //     .listen('my-channel', e => {
          //         console.log(e);
          //     });
          // console.log('my-channel')
          // this.$pusher.subscribe('my-channel', channel => {
          //     channel.bind('channel', ({ log }) => {
          //         console.log(log)
          //     });
          // });
          // this.channel = this.$pusher.subscribe('my-channel');
          // this.channel.bind('my-channel', (log) => {
          //     console.log(log);
          // });

          console.log('ast')
          // if (process.client) {
          //     if ('serviceWorker' in navigator) {
          //         console.log('navigator')
          //         navigator.serviceWorker.register('./firebase-messaging-sw.js')
          //             .then(registration => {
          //                 const messaging = firebase.messaging()
          //
          //                 let getToken = () => {
          //                     messaging.getToken()
          //                         .then(currentToken => {
          //                             if (currentToken) {
          //                                 console.log('Enviar isso para um servidor:', currentToken)
          //                                 return currentToken
          //                             }
          //                             console.warn('Nenhum is disponível, solicite permissão para gerar um')
          //                         });
          //                 }
          //
          //                 messaging.useServiceWorker(registration)
          //
          //                 messaging.requestPermission()
          //                     .then(() => {
          //                         getToken()
          //                     })
          //
          //                 messaging.onMessage(function(payload) {
          //                     console.log("Message received. ", payload);
          //                 })
          //             })
          //             .catch(err => console.warn('Erro', err))
          //     }
          // }
      },
      beforeDestroy() {
          this.pusher.unsubscribe('my-chanel');
      }
  }
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
