<template>
  <div class="flex min-h-screen bg-gray-100">
    <div :class="[
      'bg-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform transition duration-200 ease-in-out z-50',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'md:relative md:translate-x-0'
    ]">
      <nav class="space-y-4">
        <img src="../css/img2.png" alt="Imagen de plenitas">
        <router-link to="/dashboard" class="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700">
          Dashboard
        </router-link>

        <router-link to="/dashboardCliente" class="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700">
          Dashboard Cliente
        </router-link>
        <router-link to="/principal" class="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700">
          Released Notes
        </router-link>
        <router-link to="/states" class="block py-2 px-4 rounded hover:bg-blue-100 text-gray-700">
          Solicitudes
        </router-link>
        <button @click="logout" class="block w-full text-left py-2 px-4 rounded hover:bg-red-100 text-red-600">
          Cerrar sesión
        </button>
      </nav>
    </div>

    <div class="flex-1 flex flex-col">
      <header class="bg-white shadow-md p-4 flex items-center justify-between md:hidden">
        <button @click="toggleSidebar" class="text-gray-600 focus:outline-none">
          ☰
        </button>
        <h1 class="text-lg font-semibold text-gray-700">Sidebar</h1>
      </header>

      <main class="flex-1 p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen
    },
    logout() {
      alert('Sesión cerrada');
      Cookies.remove('access_token', {  sameSite: 'Strict' })
      Cookies.remove('jwtToken', { sameSite: 'Strict' })
      this.$router.push('/');
      
    }
  

  }
}
</script>
