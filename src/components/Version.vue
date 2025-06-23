<template>
  <div class="mt-6 mb-6 text-2xl ">
    <br>
    <div class="w-full px-4">
      <div class="mb-6">
        <input v-model="searchTerm" @input="onSearchInput" type="text" placeholder="Buscar por título:"
          class="text-orange-800  border rounded py-2 px-4 text-xl border-orange-500" />
      </div>
      
      <div class="mb-6 flex items-center gap-4">
        <label class="text-2xl text-green-500">Buscar por fecha:</label>
        <input type="date" v-model="filterDate" @change="onDateChange"
          class="border border-green-700 text-green-500 rounded py-2 px-4 text-xl" />
        <button v-if="filterDate" @click="clearDate" class="text-green-500 underline text-lg">Limpiar</button>
      </div>

      <div v-if="loading" class="text-center text-3xl">Cargando versiones...</div>

      <div v-else>
        <div v-if="versions.length === 0" class="text-center text-3xl">
          No se encontraron versiones.
        </div>

        <div v-for="entrada in versions" :key="entrada.id"
          class="p-13 rounded-lg shadow-lg py-16 mx-auto bg-linear-to-r/srgb from-white to-cyan-100 mb-10">
          <div class="flex justify-between items-center">
            <div class="text-blue-700">
              <h2 class="text-4xl font-semibold">{{ entrada.titulo }}</h2>
            </div>
            <div class="text-gray-900 text-sm ml-16">
              <p class="text-3xl">Fecha: ({{ new Date(entrada.fecha).toLocaleDateString() }})</p>
            </div>
          </div>

          <ul>
            <li class="text-3xl mt-5 mb-5 font-semibold text-green-700">BugFixes:</li>
          </ul>
          <li v-for="fix in separarBugFixes(entrada.bugFixes)" :key="fix" class="text-gray-900 ml-16 text-2xl ">
            {{ fix }}
          </li>


        </div>

        <div class="flex justify-center gap-4 my-6">
          <button @click="prevPage" :disabled="page === 1"
            class="px-4 py-2  bg-sky-300 rounded disabled:opacity-50">Anterior</button>
          <span class="text-xl mt-2 text-sky-800 font-semibold">Página {{ page }}</span>
          <button @click="nextPage" :disabled="!hasMore"
            class="px-4 py-2 bg-sky-300 rounded disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import api from '../axios';


export default {
  setup() {
    const versions = ref([]);
    const rolUsuario = ref('');
    const loading = ref(false);
    const page = ref(1);
    const pageSize = 10;
    const hasMore = ref(true);
    const searchTerm = ref('');
    const filterDate = ref('');


    //Separar los arreglos de bug en diferentes puntos
    function separarBugFixes(bugFixes) {
      if (!bugFixes) return [];
      return bugFixes.split(',').map(f => f.trim());
    }


    //Cargar las versiones y mostrar sus datos
    async function buscarVersiones() {
      loading.value = true;
      try {
        const params = {
          'fields[0]': 'titulo',
          'fields[1]': 'bugFixes',
          'fields[2]': 'fecha',
          'pagination[pageSize]': pageSize,
          'pagination[page]': page.value,
          'sort': 'fecha:desc',
          status: 'published',
          'locale[0]': 'es'
        };

        if (searchTerm.value.trim()) {
          params['filters[titulo][$containsi]'] = searchTerm.value.trim();
        }

        if (filterDate.value) {
          params['filters[fecha]'] = filterDate.value;
        }

        const { data } = await api.get('versions', { params });

        const received = data.data || [];
        versions.value = received.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        hasMore.value = received.length === pageSize;
      } catch (error) {
        console.error('❌ Error al obtener los datos:', error);
      } finally {
        loading.value = false;
      }
    }

    watch([page, searchTerm, filterDate], () => {
      buscarVersiones();
    });

    function onSearchInput() {
      page.value = 1;
    }

    function onDateChange() {
      page.value = 1;
    }

    function clearDate() {
      filterDate.value = '';
      page.value = 1;
    }

    function nextPage() {
      if (hasMore.value) {
        page.value++;
      }
    }

    function prevPage() {
      if (page.value > 1) {
        page.value--;
      }
    }

    buscarVersiones();

    return {
      versions,
      rolUsuario,
      loading,
      page,
      hasMore,
      searchTerm,
      filterDate,
      separarBugFixes,
      nextPage,
      prevPage,
      onSearchInput,
      onDateChange,
      clearDate,

    };
  },

  methods: {
    logout() {
      alert('Sesión cerrada');
      localStorage.clear('token');
      this.$router.push('/');
    }
  }
};
</script>
