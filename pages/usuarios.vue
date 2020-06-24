<template>
  <div class="container">
    <b-table striped hover :items="usuarios" :fields="fields" :key="atualizar" :tbody-tr-class="rowClass">
      <template v-slot:cell(tempo)="data">
        <div>{{calcularTempoPomodoro(data)}}</div>
      </template>
      <template v-slot:cell(status)="data">
        <div>{{ data.item.pomodoro.timer_iniciado ? 'Pomodoro' : 'Break' }}</div>
      </template>
    </b-table>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: "usuarios",
    data() {
      return {
        fields: [
          {
            key: 'name',
            label: 'Nome',
          },
          {
            key: 'tempo',
          },
          {
            key: 'status'
          }
        ],
        usuarios: [],
        atualizar: 0,
        intervalo: null
      }
    },
    methods: {
      rowClass(item, type) {
        if (!item || type !== 'row') return
        if (item.pomodoro.break_iniciado) return 'table-break'
      },
      tempoPomodoro(pomodoro, breaks, timers) {
        return pomodoro.timer_iniciado ? timers.find((item) => item.atual).tempo: breaks.find((item) => item.atual).tempo
      },
      tempoRestante({pomodoro, breaks, timers}) {
        if (!pomodoro.timer_iniciado && !pomodoro.break_iniciado) {
          return 'Pomodoro não iniciado'
        }
        if (pomodoro.pausado) {
          return pomodoro.timer_iniciado ? 'pomodoro pausado' : 'break esperando inicio'
        }
        let minutos = Math.floor(pomodoro.segundos / 60)
        let segundos = pomodoro.segundos - (minutos * 60)
        let minutosRestantes = (this.tempoPomodoro(pomodoro, breaks, timers) - minutos - 1)
        if (minutosRestantes < 0) {
          this.getUsuarios()
        }
        let stringMinutos = String(minutosRestantes).padStart(2, '0')
        let stringSegundos = String((59 - segundos)).padStart(2, '0')
        return stringMinutos + ':' + stringSegundos
      },
      calcularTempoPomodoro({item}) {
        item.pomodoro.segundos = moment().diff(moment(item.pomodoro.data_hora_inicio, 'YYYY-MM-DD HH:mm:ss'), 'seconds')
        return this.tempoRestante(item)
      },
      atualizarTabela() {
        this.intervalo = setInterval(() => {
          this.atualizar++;
        }, 1000)
      },
      async getUsuarios() {
        try {
          let {data} = await this.$axios.get('usuarios')
          this.usuarios = data.usuarios
        } catch (e) {
          console.error(e)
        }
      },
    },
    created() {
      this.getUsuarios()
      this.atualizarTabela()
    },
    beforeDestroy() {
      clearInterval(this.intervalo)
    }
  }
</script>

<style lang="scss">
  .container {
    color: #e5e5e5;
  }

  .table {
    color: #e5e5e5;
  }

  .table-hover tbody tr:hover {
    color: #d2d2d2;
  }
  .table-break td{
    background-color: #4be1aa;
    color: black;
  }
</style>
