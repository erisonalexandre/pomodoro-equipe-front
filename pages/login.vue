<template>
  <div class="text-center" id="body">
    <form class="form-signin" @submit.prevent="userLogin">
      loggin
      <h1 class="h3 mb-3 font-weight-normal">Pomodoro</h1>
      <label for="inputEmail" class="sr-only">Email</label>
      <input type="email" id="inputEmail" class="form-control" placeholder="Email" required autofocus v-model="login.email" />
      <label for="inputPassword" class="sr-only">Senha</label>
      <input type="password" id="inputPassword" class="form-control" placeholder="Senha" required v-model="login.password" />
      <button class="button--green" type="submit">Entrar</button>
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
          let response = await this.$auth.loginWith('local', { data: this.login })
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
                this.$axios.post('register-user-group', {user: this.$auth.user, token: currentToken})
              }
            });

          this.$router.replace('/')
        } catch (err) {
           if (err.response?.data?.error && err.response.data.error === 'Unauthorized') {
             this.$bvToast.toast('Email ou senha incorretos', {
               title: 'Não autorizado',
               toaster: 'b-toaster-top-center',
               variant: 'danger',
               solid: true
             })
           }

          console.log(err.response.data.error)
        }
      }
    }
  }
</script>

<style scoped>
  #body {
    min-height: 100vh;
  }

  #body {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #2b3740;
    color: #66e1c4
  }
  .button--green {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #3b8070;
    color: #3b8070;
    text-decoration: none;
    padding: 10px 30px;
  }

  .form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
  }
  .form-signin .checkbox {
    font-weight: 400;
  }
  .form-signin .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
    padding: 10px;
    font-size: 16px;
  }
  .form-signin .form-control:focus {
    z-index: 2;
  }
  .form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>
