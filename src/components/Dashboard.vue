<template>
  <div class="flex bg-gray-100 min-h-screen overflow-x-hidden">
    <!-- Sidebar -->
    <div
      :class="{ 'w-64': !isSidebarCollapsed, 'w-16': isSidebarCollapsed }"
      class="bg-white fixed top-0 left-0 h-screen text-white p-4 transition-all z-40"
    >
      <div class="flex items-center justify-between mb-6">
        <img
          v-if="!isSidebarCollapsed"
          src="../css/img2.png"
          alt="Imagen de plenitas"
          class="w-full h-auto object-contain mb-4"
        />
        <button @click="toggleSidebar" class="text-black">
          <i :class="isSidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
        </button>
      </div>

      <nav class="space-y-4" v-if="!isSidebarCollapsed">
        <router-link to="/dashboard" class="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700">Dashboard</router-link>
        <router-link to="/dashboardCliente" class="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700">Dashboard Cliente</router-link>
        <router-link to="/principal" class="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700">Released Notes</router-link>
        <router-link to="/states" class="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700">Solicitudes</router-link>
        <button @click="logout" class="block w-full text-left py-2 px-4 rounded hover:bg-red-100 text-red-600">Cerrar sesión</button>
      </nav>
    </div>

    <!-- Main Content -->
    <div :class="['transition-all w-full', isSidebarCollapsed ? 'ml-16' : 'ml-64']">
      <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>

        <!-- Métricas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-gradient-to-tr from-pink-500 to-red-400 text-white p-6 rounded-2xl shadow">
            <h2 class="text-lg font-medium">Total Aplicaciones</h2>
            <p class="text-3xl font-bold mt-2">{{ totalAplicaciones }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow">
            <h2 class="text-lg text-gray-600 font-medium">Total Releases</h2>
            <p class="text-3xl font-bold text-purple-600 mt-2">{{ totalReleases }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow">
            <h2 class="text-lg text-gray-600 font-medium">Solicitudes "Procesando"</h2>
            <p class="text-3xl font-bold text-orange-500 mt-2">{{ totalProcesando }}</p>
          </div>
        </div>

        <!-- Chart + Posts -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="col-span-2 bg-white p-4 rounded-2xl shadow overflow-hidden">
            <h2 class="text-lg font-semibold text-gray-700 mb-2">Solicitudes por Estado</h2>
            <div class="h-64">
              <LineChart :data="estadoChartData" />
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow">
            <h2 class="text-lg font-semibold text-gray-700 mb-4">Últimos Releases</h2>
            <ul>
              <li v-for="(entry, index) in ultimosReleases" :key="index" class="mb-4 border-b pb-2">
                <h3 class="text-md font-bold">{{ entry.titulo }}</h3>
                <p class="text-xs text-gray-500">{{ new Date(entry.fecha).toLocaleDateString() }}</p>
              </li>
            </ul>
          </div>
        </div>

        <!-- Solicitudes recientes -->
        <div class="mt-8 bg-white p-6 rounded-2xl shadow">
          <h2 class="text-lg font-semibold text-gray-700 mb-4">Solicitudes Recientes</h2>
          <ul>
            <li v-for="(sol, index) in ultimasSolicitudes" :key="index" class="mb-3 border-b pb-2 flex justify-between items-center">
              <div>
                <p class="text-md font-semibold">{{ sol.Titulo }}</p>
                <p class="text-sm text-gray-600">{{ sol.app }} - {{ new Date(sol.fecha).toLocaleDateString() }}</p>
              </div>
              <span
                class="text-xs font-medium px-3 py-1 rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-700': sol.estado === 'Pendiente',
                  'bg-orange-100 text-orange-700': sol.estado === 'Procesando',
                  'bg-green-100 text-green-700': sol.estado === 'Completado'
                }"
              >
                {{ sol.estado || 'Sin estado' }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import LineChart from '../components/LineChart.vue'
import { ref, onMounted, computed } from 'vue'
import api from '../axios'
import Cookies from 'js-cookie'


export default {
  components: { Sidebar, LineChart },
  setup() {
    const isSidebarCollapsed = ref(false)
    const aplicaciones = ref([])
    const releases = ref([])
    const loading = ref(false)

    const toggleSidebar = () => {
      isSidebarCollapsed.value = !isSidebarCollapsed.value
    }

    // Métricas computadas
    const totalAplicaciones = computed(() => aplicaciones.value.length)
    const totalReleases = computed(() => releases.value.length)

    const totalProcesando = computed(() =>
      aplicaciones.value.reduce((total, app) =>
        total + app.solicitudes?.reduce((acc, sol) => {
          const ultima = sol.actuacions?.slice(-1)[0]
          return acc + (ultima?.tipo_actuacion?.estado?.estado === 'Procesando' ? 1 : 0)
        }, 0), 0)
    )

    // Releases recientes
    const ultimosReleases = computed(() => {
      return [...releases.value]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5)
    })

    // Solicitudes recientes
    const ultimasSolicitudes = computed(() => {
      const todas = aplicaciones.value.flatMap(app =>
        app.solicitudes?.map(sol => {
          const ultima = sol.actuacions?.slice(-1)[0]
          return {
            ...sol,
            app: app.plataforma,
            estado: ultima?.tipo_actuacion?.estado?.estado || 'Desconocido'
          }
        }) || []
      )
      return [...todas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5)
    })

    // Datos para el gráfico
    const estadoChartData = computed(() => {
      const estados = { Pendiente: 0, Procesando: 0, Completado: 0 }
      aplicaciones.value.forEach(app => {
        app.solicitudes?.forEach(sol => {
          const ultima = sol.actuacions?.slice(-1)[0]
          const estado = ultima?.tipo_actuacion?.estado?.estado
          if (estado && estados[estado] !== undefined) estados[estado]++
        })
      })
      return estados
    })

    // Cargar datos al montar el componente
    async function loadData() {
      loading.value = true
      try {
        const resApp = await api.get('aplicaciones', {
          params: {
            'populate[solicitudes][populate][actuacions][populate][tipo_actuacion][populate][estado]': true,
            'fields[0]': 'plataforma'
          }
        })
        aplicaciones.value = resApp.data.data

        const resReleases = await api.get('versions', {
        params: {
          'fields[0]': 'titulo',
          'fields[1]': 'fecha',
          'fields[2]': 'bugFixes',
          'pagination[pageSize]': 5,
          'sort': 'fecha:desc',
          status: 'published',
          'locale[0]': 'es'
        }
      })
releases.value = resReleases.data.data

      } catch (error) {
        console.error('Error cargando datos del dashboard:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      isSidebarCollapsed,
      toggleSidebar,
      totalAplicaciones,
      totalReleases,
      totalProcesando,
      ultimosReleases,
      estadoChartData,
      ultimasSolicitudes,
      loading
    }
  },
  methods: {
    logout() {
      alert('Sesión cerrada');
      localStorage.clear('token');
      Cookies.remove('access_token')
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
</style>
