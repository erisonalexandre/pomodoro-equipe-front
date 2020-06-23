<template>
  <div>
    <div class="text-white">
      {{$auth.loggedIn}}
    </div>
    <form @submit.prevent="userLogin">
      <div>
        <label>Username</label>
        <input type="text" v-model="login.email" />
      </div>
      <div>
        <label>Password</label>
        <input type="text" v-model="login.password" />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
  import localforage from 'localforage/dist/localforage.js'
  import firebase from 'firebase'
  export default {
    name: "login",
    layout: 'semLayout',
    data() {
      return {
        login: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      async userLogin() {
        try {
          let response = await this.$auth.loginWith('laravelJWT', { data: this.login })
          localforage.setDriver([
            localforage.INDEXEDDB,
            localforage.WEBSQL,
            localforage.LOCALSTORAGE
          ]).then(() => {
            localforage.setItem('user-id', this.$auth.user.id)
          })
          const messaging = firebase.messaging()
          messaging.getToken()
            .then(currentToken => {
              if (currentToken) {
                this.$axios.post('register-user-group', {user: this.$auth.user.user, token: currentToken})
              }
            });

          // this.$router.replace('/')
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>
