<template>
    <header v-if="username == 'Viewer'" class=" bg-white w-full z-50 ">
      <div class=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class=" flex items-center space-x-4">
          <img src="../src/css/logoAzulPlenitas.png" alt="Logo de plenitas" class="h-10 w-auto object-contain" />
          <div class="text-lg font-semibold ms-20 text-gray-800">
            Bienvenido{{ username ? ', ' + username : '' }} 👋
          </div>
        </div>
         <nav class="flex items-center space-x-4">
          <a href="#/dashboardCliente" class="bg-blue-100 text-blue-700 px-4 py-2 rounded shadow hover:bg-blue-200 transition"> Página Principal </a>
        </nav>

        
        <nav class="flex items-center space-x-4">
          <button @click="logout" class="text-red-500 hover:underline">Cerrar sesión</button>
        </nav>
      </div>
    </header>
    <div class="flex min-h-screen ">
        <Sidebar  v-if="username !== 'Viewer'" class="fixed"></Sidebar>
        <div class="flex-1 ml-64 p-6 bg-linear-to-r/srgb from-white to-cyan-100 ">
            <div class="flex justify-center ">
                <h1 class="mt-2 text-5xl font-bold text-gray-800">Released Notes</h1>
            </div>
            <Version class="ml-50"></Version>
        </div>
    </div>
    
</template>

<script setup>
import { ref ,onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Version from './components/Version.vue'
import Cookies from 'js-cookie'
import { useRouter, RouterLink } from 'vue-router'
import api from '../src/axios' 


const router = useRouter()
const username = ref('')


const logout = () => {
Cookies.remove('access_token', {  sameSite: 'Strict' })
Cookies.remove('jwtToken', { sameSite: 'Strict' })
  alert('Sesión cerrada')
  router.push('/')
}

onMounted(async () =>{

    try{
         const meRes = await api.get('/users/me')
        username.value = meRes.data?.username || 'Cliente'
    }catch(err){
         console.error('❌ Error al cargar usuario o releases:', err)
    }
})




</script>