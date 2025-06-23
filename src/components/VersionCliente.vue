<template>
  <div class="w-full">
    <header class="bg-white shadow fixed top-0 left-0 w-full z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <img src="../css/logoAzulPlenitas.png" alt="Logo de plenitas" class="h-10 w-auto object-contain" />
          <div class="text-lg font-semibold ms-20 text-gray-800">
            Bienvenido{{ username ? ', ' + username : '' }} 👋
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <RouterLink
            to="/dashboardCliente"
            class="bg-blue-100 text-blue-700 px-4 py-2 rounded shadow hover:bg-blue-200 transition"
          >
            Dashboard
          </RouterLink>
 <button @click="logout" class="block w-full text-left py-2 px-4 rounded hover:bg-red-100 text-red-600">
          Cerrar sesión
        </button>        </div>
      </div>
    </header>

   <div class="flex pt-20 min-h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="w-64 bg-blue-900 text-white p-5">
        <h1 class="text-2xl font-bold mb-8">Releases</h1>
        <nav class="space-y-4">

          <router-link to="/dashboardCliente" class="block py-2 px-4 rounded hover:bg-blue-100 text-white">
          Dashboard
        </router-link>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="flex-1 p-8">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-blue-700 mb-2">Versiones del Sistema</h2>
          <p class="text-sm text-gray-500">Listado de cambios y actualizaciones</p>
        </div>

        <!-- Barra de búsqueda -->
        <div class="flex flex-wrap gap-4 mb-6 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700">Buscar por título:</label>
            <input
              v-model="filtroTitulo"
              type="text"
              placeholder="Ej. versión 1.0"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Filtrar por fecha:</label>
            <input
              v-model="filtroFecha"
              type="date"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        <!-- Lista filtrada -->
        <div v-for="entrada in filteredEntradas" :key="entrada.id" class="bg-white p-6 rounded-lg shadow mb-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-blue-700">{{ entrada.titulo }}</h2>
            <p class="text-gray-600 text-sm">Fecha: {{ new Date(entrada.fecha).toLocaleDateString() }}</p>
          </div>
          <div class="mt-4 text-gray-800 text-base">
            <ul class="list-disc ml-6">
              <li>BugFixes: {{ entrada.bugFixes }}</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const entradas = ref([]);
    const username = ref('');
    const token = localStorage.getItem('token');
    const filtroTitulo = ref('');
    const filtroFecha = ref('');

    const filteredEntradas = computed(() =>
      entradas.value.filter((entrada) => {
        const matchTitulo = entrada.titulo.toLowerCase().includes(filtroTitulo.value.toLowerCase());
        const matchFecha = !filtroFecha.value || entrada.fecha.startsWith(filtroFecha.value);
        return matchTitulo && matchFecha;
      })
    );

    const logout = () => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    };

    onMounted(async () => {
      try {
        const response = await axios.post(
          'http://localhost:1337/graphql',
          {
            query: `
              query {
                versions {
                  titulo
                  fecha
                  bugFixes
                }
              }
            `,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        entradas.value = response.data?.data?.versions?.sort((a, b) => (a.titulo < b.titulo ? 1 : -1)) || [];
      } catch (error) {
        console.error('Error al cargar versiones:', error.response?.data || error.message);
      }

      try {
        const resUser = await axios.post(
          'http://localhost:1337/graphql',
          {
            query: `
              query {
                me {
                  username
                }
              }
            `,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        username.value = resUser.data?.data?.me?.username || '';
      } catch (error) {
        console.error('Error al obtener el usuario:', error.response?.data || error.message);
      }
    });

    return { entradas, username, logout, filtroTitulo, filtroFecha, filteredEntradas };
  },
};
</script>
