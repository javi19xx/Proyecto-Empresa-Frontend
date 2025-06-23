//muestra los gráficos del Dashboard

<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'LineChart',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null

    const renderChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
      }

      chartInstance = new Chart(chartCanvas.value, {
        type: 'line', // ✅ CAMBIADO A 'line'
        data: {
          labels: Object.keys(props.data),
          datasets: [
            {
              label: 'Cantidad',
              data: Object.values(props.data),
              fill: false,
              tension: 0.3,
              borderColor: '#3b82f6',
              backgroundColor: '#3b82f6',
              pointRadius: 5,
              pointHoverRadius: 7
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }
      })
    }

    onMounted(() => {
      renderChart()
    })

    watch(() => props.data, () => {
      renderChart()
    })

    return {
      chartCanvas
    }
  }
}
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
