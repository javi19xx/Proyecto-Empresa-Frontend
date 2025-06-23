<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Topbar -->
    <header class="bg-white shadow fixed top-0 left-0 w-full z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <img src="../css/logoAzulPlenitas.png" alt="Logo de plenitas" class="h-10 w-auto object-contain" />
          <div class="text-lg font-semibold ms-20 text-gray-800">
            Bienvenido{{ username ? ', ' + username : '' }} 👋
          </div>
        </div>
        <nav class="flex items-center space-x-4">
          <button @click="logout" class="text-red-500 hover:underline">Cerrar sesión</button>
        </nav>
      </div>
    </header>

    <main class="pt-20 px-6">
      <!-- Filtros -->
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por título o fecha..."
          class="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded shadow-sm"
        />
        <select
          v-model="selectedYear"
          class="w-full md:w-1/5 px-4 py-2 border border-gray-300 rounded shadow-sm"
        >
          <option value="">Todos los años</option>
          <option v-for="year in releaseYears" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <section v-if="filteredReleases.length" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-green-700 text-white rounded-lg p-5 shadow">
          <h2 class="text-base font-semibold">Total de Releases</h2>
          <p class="text-xl font-bold">{{ filteredReleases.length }}</p>
          <p class="text-xs">Incluye todas las versiones filtradas</p>
        </div>
        <div class="bg-blue-700 text-white rounded-lg p-5 shadow">
          <h2 class="text-base font-semibold">Última Versión</h2>
          <p class="text-lg font-semibold">{{ latestRelease?.titulo || 'N/A' }}</p>
          <p class="text-xs">{{ formatDate(latestRelease?.fecha) }}</p>
        </div>
        <div class="bg-purple-700 text-white rounded-lg p-5 shadow">
          <h2 class="text-base font-semibold">Nuevas esta semana</h2>
          <p class="text-xl font-bold">{{ recentReleases.length }}</p>
        </div>
      </section>

      <div v-else class="text-center text-gray-500 text-sm mt-12">
        No se encontraron releases con los filtros seleccionados.
      </div>


  <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
        <table class="min-w-full text-left">
          <thead class="bg-gray-200 text-gray-600">
            <tr>
              <th class="px-4 py-2">Título</th>
              <th class="px-4 py-2">Fecha</th>
              <th class="px-4 py-2">Cambios</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(release, index) in filteredReleases" :key="index" class="border-b">
              <td class="px-4 py-2 font-semibold text-blue-700">{{ release.titulo }}</td>
              <td class="px-4 py-2">{{ formatDate(release.fecha) }}</td>
              <td class="px-4 py-2 text-gray-700">{{ release.bugFixes }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-base font-semibold mb-2">Resumen Diario</h2>
          <p class="text-xs text-gray-500">Fecha: {{ formatDate(new Date()) }}</p>
          <div class="flex justify-between mt-4 text-center">
            <div>
              <p class="text-sm font-bold">{{ filteredReleases.length }}</p>
              <p class="text-xs text-gray-500">Publicadas</p>
            </div>
            <div>
              <p class="text-sm font-bold text-yellow-600">{{ recentReleases.length }}</p>
              <p class="text-xs text-gray-500">Nuevas</p>
            </div>
            <div>
              <p class="text-sm font-bold text-red-600">0</p>
              <p class="text-xs text-gray-500">Errores</p>
            </div>
          </div>
        </div>

        <div class="bg-teal-100 rounded-lg shadow p-4 md:col-span-2">
          <h2 class="text-base font-semibold mb-2 flex items-center justify-between">
            Últimos Cambios
            <span class="bg-red-500 text-white text-xs rounded-full px-2">{{ recentReleases.length }}</span>
          </h2>
          <ul class="text-sm text-gray-700 divide-y divide-gray-300">
            <li v-for="(note, i) in recentReleases" :key="i" class="py-2">
              <p class="text-xs text-gray-500">{{ formatDate(note.fecha) }}</p>
              <p class="font-medium">{{ note.titulo }} - {{ note.bugFixes }}</p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-base font-semibold mb-2">Últimos 5 Releases</h2>
          <ul class="text-sm text-gray-600">
            <li v-for="(item, i) in lastFiveReleases" :key="i" class="border-b py-1">
              {{ formatDate(item.fecha) }} - {{ item.titulo }}
            </li>
          </ul>
        </div>
        <div class="bg-white rounded-lg shadow p-4 md:col-span-2">
          <h2 class="text-base font-semibold mb-2">Acciones Rápidas</h2>
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center space-x-4">
  <RouterLink
    to="/principal"
    class="bg-blue-100 text-blue-700 px-4 py-2 rounded shadow hover:bg-blue-200 transition"
  >
    Ver Releases
  </RouterLink>

</div>

          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import api from '../axios' 
import Cookies from 'js-cookie'

const router = useRouter()

const releases = ref([])
const searchTerm = ref('')
const selectedYear = ref('')
const username = ref('')

// Función de cierre de sesión
const logout = () => {
Cookies.remove('access_token', {  sameSite: 'Strict' })
Cookies.remove('jwtToken', { sameSite: 'Strict' })
  alert('Sesión cerrada')
  router.push('/')
}

// Computed para filtrar releases por búsqueda y año
const filteredReleases = computed(() => {
  return releases.value.filter(r => {
    const matchesYear = selectedYear.value
      ? new Date(r.fecha).getFullYear().toString() === selectedYear.value
      : true
    const lowerSearch = searchTerm.value.toLowerCase()
    const matchesTitle = r.titulo?.toLowerCase().includes(lowerSearch)
    const matchesDate = formatDate(r.fecha).includes(lowerSearch)
    return matchesYear && (matchesTitle || matchesDate)
  })
})

// Años disponibles
const releaseYears = computed(() => {
  const years = releases.value.map(r => new Date(r.fecha).getFullYear())
  return [...new Set(years)].sort((a, b) => b - a).map(String)
})

// Releases recientes (últimos 7 días)
const recentReleases = computed(() => {
  const now = new Date()
  return filteredReleases.value.filter(r => {
    const fecha = new Date(r.fecha)
    const diff = (now - fecha) / (1000 * 60 * 60 * 24)
    return diff <= 7
  })
})

// Últimos 5 releases
const lastFiveReleases = computed(() => {
  return [...filteredReleases.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5)
})

// Último release
const latestRelease = computed(() => {
  return [...filteredReleases.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]
})

// Función para formatear fecha
function formatDate(fecha) {
  return fecha ? new Date(fecha).toLocaleDateString('es-ES') : '—'
}

// Cargar datos al montar
onMounted(async () => {
  try {
    // Obtener usuario autenticado
    const meRes = await api.get('/users/me')
    username.value = meRes.data?.username || 'Cliente'

    // Obtener releases desde REST
    const releasesRes = await api.get('versions', {
      params: {
        'fields[0]': 'titulo',
        'fields[1]': 'fecha',
        'fields[2]': 'bugFixes',
        'pagination[pageSize]': 100,
        'sort': 'fecha:desc',
        status: 'published',
        'locale[0]': 'es'
      }
    })
    releases.value = releasesRes.data.data || []
  } catch (err) {
    console.error('❌ Error al cargar usuario o releases:', err)
  }
})
</script>
