<template>
  <div>
    <!-- SIDEBAR -->
    <div
      :class="{ 'w-64': !isSidebarCollapsed, 'w-16': isSidebarCollapsed }"
      class="fixed top-0 left-0 h-screen text-white p-4 transition-all z-40"
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

    <!-- MAIN CONTENT -->
    <div :class="{ 'ml-16': isSidebarCollapsed, 'ml-64': !isSidebarCollapsed }" class="transition-all">
      <!-- TOPBAR -->
      <div class="sticky top-0 z-30 bg-blue-900 shadow px-6 py-4 mb-6 flex justify-between items-center text-white">
        <div class="ml-10 text-3xl font-semibold"> Bienvenido{{ username ? ', ' + username : '' }}</div>
        <div class="flex space-x-10 text-4xl font-bold mb-6">
          <div class="flex flex-col items-center"><span class="text-red-400">{{ totalPendientes }}</span><span class="text-sm">Pendiente</span></div>
          <div class="flex flex-col items-center"><span class="text-orange-400">{{ totalProcesando }}</span><span class="text-sm">Procesando</span></div>
          <div class="flex flex-col items-center"><span class="text-green-400">{{ totalCompletados }}</span><span class="text-sm">Completado</span></div>
        </div>
      </div>

      <!-- FILTROS -->
      <div class="bg-blue-800 p-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <label for="plataforma-select" class="text-white text-sm">Selecciona plataforma:</label>
          <select id="plataforma-select" v-model="selectedPlataforma" class="bg-white text-gray-700 px-4 py-2 rounded">
            <option value="">Todas</option>
            <option v-for="plataforma in plataformas" :key="plataforma" :value="plataforma">{{ plataforma }}</option>
          </select>
        </div>
        <div class="flex items-center space-x-4">
          <label for="prioridad-select" class="text-white text-sm">Selecciona prioridad:</label>
          <select id="prioridad-select" v-model="selectedPrioridad" class="bg-white text-gray-700 px-4 py-2 rounded">
            <option value="">Todas</option>
            <option v-for="prioridad in prioridades" :key="prioridad" :value="prioridad">{{ prioridad }}</option>
          </select>
        </div>
        <div class="flex items-center space-x-4">
          <input type="text" v-model="searchQuery" placeholder="Buscar..." class="bg-white text-gray-700 px-4 py-2 rounded" />
        </div>
      </div>

      <!-- SOLICITUDES -->
      <div class="p-6 bg-gray-100">
        <h1 class="text-2xl font-bold mb-4">Solicitud de Aplicaciones</h1>
        <div v-if="loading">Cargando...</div>

        <div v-else>
          <div v-if="filteredAplicaciones.length">
            <div v-for="app in filteredAplicaciones" :key="app.id" class="border shadow-xl border-gray-300 p-6 mb-8 rounded-lg">
              <h2 class="text-2xl font-semibold text-blue-700 mb-2">Plataforma: {{ app.plataforma }}</h2>
              <p class="mb-4 text-gray-700"><strong class="text-gray-800">Usuarios:</strong> {{ app.users?.map((u) => u.username).join(', ') || 'N/A' }}</p>

              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-3">Solicitudes:</h3>
                <div v-if="app.solicitudes?.length">
                  <table class="min-w-full text-sm table-auto border-collapse mb-6">
                    <thead class="bg-gray-100 text-left">
                      <tr>
                        <th class="border border-gray-300 px-4 py-2">Título</th>
                        <th class="border border-gray-300 px-4 py-2">Prioridad</th>
                        <th class="border border-gray-300 px-4 py-2">Descripción</th>
                        <th class="border border-gray-300 px-4 py-2">Fecha</th>
                        <th class="border border-gray-300 px-4 py-2">Actuaciones</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white">
                      <tr v-for="(solicitud, i) in app.solicitudes" :key="i" class="hover:bg-gray-50">
                        <td class="border border-gray-300 px-4 py-2">{{ solicitud.Titulo }}</td>
                        <td class="border border-gray-300 px-4 py-2 text-center rounded" :class="getPrioridadColor(solicitud.prioridad)">
                          {{ solicitud.prioridad }}
                        </td>
                        <td class="border border-gray-300 px-4 py-2 text-gray-700">{{ solicitud.descripcion }}</td>
                        <td class="border border-gray-300 px-4 py-2 text-gray-700">{{ formatFecha(solicitud.fecha) }}</td>
                        <td class="border border-gray-300 px-4 py-2">
                          <div v-if="solicitud.actuacions?.length">
                            <button @click="toggleActuaciones(i)" class="text-blue-700 hover:underline mb-2">
                              {{ expandedActuaciones[i] ? 'Ocultar Actuaciones' : 'Ver Actuaciones' }}
                            </button>
                            <div v-if="expandedActuaciones[i]">
                              <table class="w-full text-xs table-fixed border border-gray-200 bg-gray-50 mt-2">
                                <thead>
                                  <tr class="text-gray-600 bg-gray-100">
                                    <th class="border border-gray-300 px-2 py-1">Fecha</th>
                                    <th class="border border-gray-300 px-2 py-1">Título</th>
                                    <th class="border border-gray-300 px-2 py-1">Descripción</th>
                                    <th class="border border-gray-300 px-2 py-1">Tipo - Estado</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="(act, j) in solicitud.actuacions" :key="j" class="hover:bg-gray-100">
                                    <td class="border border-gray-300 px-2 py-1">{{ formatFecha(act.fecha) }}</td>
                                    <td class="border border-gray-300 px-2 py-1">{{ act.titulo }}</td>
                                    <td class="border border-gray-300 px-2 py-1">{{ act.descripcion }}</td>
                                    <td class="border border-gray-300 px-2 py-1">{{ act.tipo_actuacion?.tipo || 'N/A' }} - {{ act.tipo_actuacion?.estado?.estado || 'N/A' }}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div v-else class="italic text-gray-500">Sin actuaciones</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else class="italic text-gray-500">Sin solicitudes</div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500">No se encontraron aplicaciones válidas.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import api from '../axios'
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie'

/* export default{
  methods:{
    logout() {
      alert('Sesión cerrada');
      Cookies.remove('access_token', {  sameSite: 'Strict' })
      Cookies.remove('jwtToken', { sameSite: 'Strict' })
      this.$router.push('/');
      
    }
  }
} */


const aplicaciones = ref([])
const loading = ref(true)
const isSidebarCollapsed = ref(false)
const expandedActuaciones = ref([])
const selectedPlataforma = ref('')
const selectedPrioridad = ref('')
const plataformas = ref([])
const prioridades = ref([])
const searchQuery = ref('')
const username = ref('')
const router = useRouter();


function logout(){
      alert('Sesión cerrada');
      Cookies.remove('access_token', {  sameSite: 'Strict' })
      Cookies.remove('jwtToken', { sameSite: 'Strict' })
      router.push('/');
}


function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

function toggleActuaciones(index) {
  expandedActuaciones.value[index] = !expandedActuaciones.value[index]
}

function formatFecha(fecha) {
  return new Date(fecha).toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  })
}


function getUltimaActuacion(sol) {
  return sol.actuacions?.slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]
}

function getPrioridadColor(prioridad) {
  switch (prioridad?.toLowerCase()) {
    case 'alta':
      return 'bg-red-300 text-black font-bold'
    case 'media':
      return 'bg-yellow-200 text-white font-semibold'
    case 'baja':
      return 'bg-green-200 text-black font-medium'
    default:
      return 'bg-gray-200 text-black'
  }
}

const totalPorEstado = estado => computed(() =>
  aplicaciones.value.reduce((total, app) =>
    total + (app.solicitudes?.filter(sol =>
      getUltimaActuacion(sol)?.tipo_actuacion?.estado?.estado === estado
    ).length || 0), 0)
)

const totalPendientes = totalPorEstado('Pendiente')
const totalProcesando = totalPorEstado('Procesando')
const totalCompletados = totalPorEstado('Completado')

const filteredAplicaciones = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return aplicaciones.value.filter(app => {
    const byPlataforma = !selectedPlataforma.value || app.plataforma === selectedPlataforma.value
    const byPrioridad = !selectedPrioridad.value || app.solicitudes?.some(s => s.prioridad === selectedPrioridad.value)
    const bySearch = app.solicitudes?.some(solicitud =>
      solicitud.Titulo?.toLowerCase().includes(query) ||
      solicitud.descripcion?.toLowerCase().includes(query) ||
      solicitud.fecha?.toLowerCase().includes(query) ||
      solicitud.actuacions?.some(act =>
        act.tipo_actuacion?.estado?.estado.toLowerCase().includes(query)
      )
    )
    return byPlataforma && byPrioridad && bySearch
  })
})

onMounted(async () => {

  const meRes = await api.get('/users/me')
    username.value = meRes.data?.username || 'Cliente'
  try {
    const { data } = await api.get('aplicaciones', {
      params: {
        'populate[users][fields][0]': 'username',
        'populate[solicitudes][fields][0]': 'Titulo',
        'populate[solicitudes][fields][1]': 'descripcion',
        'populate[solicitudes][fields][2]': 'fecha',
        'populate[solicitudes][fields][3]': 'prioridad',
        'populate[solicitudes][populate][actuacions][fields][0]': 'titulo',
        'populate[solicitudes][populate][actuacions][fields][1]': 'fecha',
        'populate[solicitudes][populate][actuacions][fields][2]': 'descripcion',
        'populate[solicitudes][populate][actuacions][populate][tipo_actuacion][fields][0]': 'tipo',
        'populate[solicitudes][populate][actuacions][populate][tipo_actuacion][populate][estado][fields][0]': 'estado',
        'fields[0]': 'plataforma',
        'pagination[pageSize]': 10,
        'pagination[page]': 1,
        status: 'published',
        'locale[0]': 'es'
      }
    })

    aplicaciones.value = data.data || []
    plataformas.value = [...new Set(aplicaciones.value.map(app => app.plataforma))]
    const allPrioridades = aplicaciones.value.flatMap(app => app.solicitudes?.map(s => s.prioridad) || [])
    prioridades.value = [...new Set(allPrioridades)]
    
  } catch (error) {
    console.error('❌ Error al obtener los datos:', error)
  } finally {
    loading.value = false
  }
})
</script>

