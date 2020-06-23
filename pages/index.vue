<template>
  <div class="container">
    <div v-show="load">
      <loading></loading>
    </div>
    <div style="width:100%">
      breaks
      <div class="d-flex text-center">
        <div v-for="(item, index) in breaks" class="px-3" :class="[{'bg-success': breakAtual === index}]">
          {{item}}
        </div>
      </div>
      timers
      <div class="d-flex text-center">
        <div v-for="(item, index) in timers" :class="[{'bg-success': timerAtual === index}]">
          {{item}}
        </div>
      </div>
    </div>
    <client-only>
      <div v-if="breakIniciado">
        <div class="break d-flex justify-content-center align-items-center">
          <div>
            <h1>BREAK INICIADO</h1>
            <h1 class="mt-4">
              {{ tempoRestante }}
            </h1>
            <button
              v-if="pausado"
              class="button--green"
              @click="iniciarRelogio"
            >
              INICIAR BREAK
            </button>
          </div>
        </div>
      </div>
      <div v-if="!breakIniciado">
        <h1 class="subtitle">
          POMODORO
        </h1>
        <h1 class="title">
          {{ tempoRestante }}
        </h1>
        <b-form-checkbox
          id="auto-break"
          v-model="autoBreak"
          name="auto-break"
          @input="salvar"
        >
          AUTO BREAK
        </b-form-checkbox>
        <div class="links">
          <button
            class="button--green"
            @click="pausar"
            v-if="!pausado && (timerIniciado || breakIniciado)"
          >
            PAUSAR
          </button>
          <button
            class="button--green"
            @click="voltar"
            v-if="pausado"
          >
            VOLTAR
          </button>
          <button
            v-if="!timerIniciado"
            class="button--green"
            @click="iniciarPomodoro"
          >
            INICIAR
          </button>
          <button
            v-else
            class="button--green"
            @click="pararPomodoro"
          >
            REINICIAR
          </button>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import Loading from '~/components/Loading.vue'
import moment from 'moment'
export default {
  components: {
    Logo,
    Loading
  },
  data () {
    return {
      timers: [ 45, 45, 45, 45],
      breaks: [ 4, 4, 4, 10],
      timerAtual: 0,
      breakAtual: 0,
      segundos: 0,
      pausado: false,
      segundosPausado: null,
      timerIniciado: false,
      breakIniciado: false,
      dataHoraInicio: null,
      atualizar: false,
      relogio: null,
      autoBreak: true,
      load: true,
      audio: null
    }
  },
  computed: {
    tempoPomodoro () {
      return this.timerIniciado ? this.timers[this.timerAtual]: this.breaks[this.breakAtual]
    },
    tempoRestanteMinutos () {
      return Math.floor(this.segundos / 60)
    },
    tempoRestante () {
      if (!this.timerIniciado && !this.breakIniciado) {
        return 'Pomodoro não iniciado'
      }
      if (!this.relogio && this.pausado && this.segundosPausado === 0) {
        return this.tempoPomodoro + ':00'
      }
      let minutos = this.tempoRestanteMinutos
      let segundos = this.segundos - (minutos * 60)
      let stringMinutos = String((this.tempoPomodoro - minutos - 1 )).padStart(2, '0')
      let stringSegundos = String((59 - segundos)).padStart(2, '0')
      return   stringMinutos + ':' + stringSegundos
    }
  },
  methods: {
    pausar () {
      this.pausado = true
      this.segundosPausado = this.segundos
      this.pararRelogio()
      this.$axios.post('pausar-pomodoro')
      this.salvar()
    },
    voltar () {
      this.pausado = false
      this.segundos = this.segundosPausado
      this.iniciarRelogio()
      this.$axios.post('voltar-pomodoro')
      this.salvar()
    },
    salvar () {
      this.salvarLocalStorage(this.$data, true)
    },
    iniciarPomodoro () {
      this.$axios.post('iniciar-pomodoro')
      this.dataHoraInicio = moment().format('YYYY-MM-DD HH:mm:ss')
      this.timerIniciado = true
      this.segundos = 0
      this.pausado = false
      this.timerAtual = 0
      this.breakAtual = 0
      this.salvar()
      this.iniciarRelogio()
    },
    pararPomodoro () {
      this.pararRelogio()
      this.pausado = false
      this.timerIniciado = false
      this.breakIniciado = false
      this.$axios.post('reiniciar-pomodoro')
      this.salvar()
    },
    atualizarRelogio () {
      this.segundos = this.segundos + 1;
      if (this.tempoPomodoro <= this.tempoRestanteMinutos) {
        if(this.autoBreak) {
          this.pausado = true
          this.segundosPausado = 0
          this.pararRelogio()
          this.proximoTempo()
        } else {
          this.proximoTempo()
        }
      }
    },
    proximoTempo () {
      if (this.timerIniciado) {
        this.dataHoraInicio = moment().format('YYYY-MM-DD HH:mm:ss')
        this.timerIniciado = false
        this.breakIniciado = true
        this.segundos = 0
        this.timerAtual = this.timerAtual + 1
        this.audio.play()
        if(this.timers.length <= this.timerAtual) {
          this.timerAtual = 0
        }
      } else {
        this.audio.play()
        this.dataHoraInicio = moment().format('YYYY-MM-DD HH:mm:ss')
        this.timerIniciado = true
        this.breakIniciado = false
        this.segundos = 0
        this.breakAtual = this.breakAtual + 1
        if(this.breaks.length <= this.breakAtual) {
          this.breakAtual = 0
        }
      }
      this.salvar()
    },
    salvarLocalStorage (itens, salvarObjeto = false) {
      if (salvarObjeto) {
        if (typeof itens === 'object' && itens !== null) {
          itens = Object.entries(itens).forEach((item, index) => {
            localStorage.setItem('pomodoro-' + item[0], item[1])
          })
        }
      }
    },
    async carregarLocalStorage() {
      await this.carregarDadosUsuarioLogado()
      if (this.dataHoraInicio && (this.timerIniciado || this.breakIniciado)) {
        if ((this.breakIniciado || this.timerIniciado) && !this.pausado) {
          console.log(this.dataHoraInicio)
          this.segundos = moment().diff(moment(this.dataHoraInicio, 'YYYY-MM-DD HH:mm:ss'), 'seconds')
          if (this.tempoPomodoro <= this.tempoRestanteMinutos) {
            this.proximoTempo()
          }
          this.iniciarRelogio()
        } else {
          this.segundosPausado = parseInt(localStorage.getItem('pomodoro-segundosPausado'))
          this.segundos = this.segundosPausado
        }
      }
    },
    async carregarDadosUsuarioLogado() {
      this.$auth.fetchUser()
      this.$auth.refreshTokens()
      console.log(this.$auth.user.user)
      this.dataHoraInicio = this.$auth.user.user.pomodoro.data_hora_inicio
      this.timerIniciado = this.$auth.user.user.pomodoro.timer_iniciado
      this.breakIniciado = this.$auth.user.user.pomodoro.break_iniciado
      this.autoBreak = this.$auth.user.user.pomodoro.auto_break
      this.pausado = this.$auth.user.user.pomodoro.pausado
      let atual = 0
      this.timers = this.$auth.user.user.timers.map((timer, index) => {
        if (timer.atual) {
          atual = index
        }
        return timer.tempo
      })
      this.timerAtual = atual
      atual = 0
      this.breaks = this.$auth.user.user.breaks.map((timer, index) => {
        if (timer.atual) {
          atual = index
        }
        return timer.tempo
      })
      this.breakAtual = atual
    },
    pararRelogio () {
      clearInterval(this.relogio)
      this.relogio = null
    },
    iniciarRelogio () {
      this.pausado = false
      this.relogio = setInterval(this.atualizarRelogio, 1000);
    }
  },
  mounted() {
    if (process.client) {
      this.carregarLocalStorage()
    }
  },
  created() {
    if (process.client) {
      this.audio = new Audio('goes-without-saying.mp3')
      this.load = false
      // chrome.permissions.request({
      //   permissions: ['tabs'],
      //   origins: ['http://www.google.com/']
      // }, function(granted) {
      //   // The callback argument will be true if the user granted the permissions.
      //   if (granted) {
      //     doSomething();
      //   } else {
      //     doSomethingElse();
      //   }
      // });
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #66e1c4;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #66e1c4;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 600;
  font-size: 60px;
  color: #4be1aa;
  word-spacing: 5px;
}

.links {
  padding-top: 15px;
}
.break {
  position:fixed;
  width:100%;
  color: #fff;
  left:0;right:0;top:0;bottom:0;
  background-color: #4c4d53c4;
  z-index:9998;
}
</style>
