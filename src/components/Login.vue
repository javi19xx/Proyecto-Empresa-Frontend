<template>
  <div class="flex min-h-screen overflow-hidden text-white bg-[#0d1128]">
    <!-- Lado izquierdo: imagen (70%) -->
    <div class="w-[70%] h-full">
      <img
        src="@/assets/illustration.png"
        alt="Ilustración corporativa"
        class="object-cover w-full h-full"
      />
    </div>
    <!-- Lado derecho: formulario (30%) -->
    <div class="w-[30%] h-full flex bg-[#141b3a]">
      <!-- Centro vertical y horizontalmente -->
      <div class="flex flex-col justify-center items-center w-full h-full mt-75 mb-65 p-10">
        <div class="w-full max-w-sm">
          <h2 class="text-2xl font-bold mb-2">¡Bienvenido a Plenitas! 👋</h2>
          <p class="text-sm text-gray-400 mb-6">Inicia sesión en tu cuenta y comienza la aventura.</p>

          <form @submit.prevent="login" class="space-y-6">
            <div>
              <label for="username" class="block text-sm mb-1">Usuario</label>
              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="Usuario"
                class="w-full px-4 py-2 bg-[#1e2749] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="password" class="block text-sm mb-1">Contraseña</label>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="Contraseña"
                class="w-full px-4 py-2 bg-[#1e2749] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <button
              type="submit"
              class="w-full py-2 px-4 bg-[#3c4fff] text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
            >
              Iniciar sesión
            </button>

            <div v-if="error" class="text-sm text-red-500 text-center">
             ⛔ {{ error }} ⛔
            <h4 class="alert-heading text-yellow-500">⚠️ El nombre de usuario o contraseña es incorrecto ⚠️</h4>
          </div>
            
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function login() {
  error.value = ''
  
  try {
    // Login y obtener JWT
    const response = await axios.post('http://localhost:1337/api/auth/local', {
      identifier: username.value,
      password: password.value
    })

    const token = response.data.jwt
    Cookies.set('access_token', token, { sameSite: 'Strict' })

    if (response.data.refresh_token) {
      Cookies.set('refresh_token', response.data.refresh_token, { sameSite: 'Strict' })
    }

    //Petición para obtener el usuario con rol (necesita el JWT en headers)
    const userRes = await axios.get('http://localhost:1337/api/users/me?populate=role', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const userRole = userRes.data.role.name

    // Redirigir según el rol
    if (userRole === 'Viewer') {
      router.push('/DashboardCliente')
    } else {
      router.push('/dashboard')
    }

  } catch (err) {
    error.value = 'Credenciales incorrectas'
    console.error('Error en login:', err)
  }
}
</script>

