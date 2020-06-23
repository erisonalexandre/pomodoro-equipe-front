<template>
  <div class="background-escuro">
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-nav-item to="/">Pomodoro</b-nav-item>
        <b-nav-item to="/usuarios">usuarios</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <nuxt/>
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
  methods: {
    createPusher() {
      // this.pusher = new Pusher(process.env.PUSHER_API_KEY, {
      //   cluster: 'us2'
      // });
      //
      // this.channel = this.pusher.subscribe('my-channel');
      // this.channel.bind('my-event', function (data) {
      //   console.log(data)
      //   // app.messages.push(JSON.stringify(data));
      // });
      // console.log('criado')
    },
    destroyPusher() {
      if (this.pusher) {
        this.pusher.unsubscribe('my-chanel');
      }
    }
  },
  created() {
    this.createPusher()
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
  },
  beforeDestroy() {
    this.destroyPusher()
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

  .background-escuro {
    background-color: #2b3740;
    min-height: 100vh;
    color: #e5e5e5;
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    border-color: #52ab96;
    background-color: #52ab96;
  }
</style>
