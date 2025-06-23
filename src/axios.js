// src/axios.js
import axios from 'axios'
import Cookies from 'js-cookie'

// Creamos una instancia de Axios con la URL base de la API que ya funciona correctamente
const api = axios.create({
  baseURL: 'http://localhost:1337/api/', // URL base de tu API REST
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para añadir automáticamente el token en cada petición
api.interceptors.request.use(config => {
  const token = Cookies.get('access_token') // Obtener token de cookie
  if (token) {
    config.headers.Authorization = `Bearer ${token}` // Añadir token al header
  }
  return config
}, error => {
  return Promise.reject(error)
})



let vueRouter = null

export const setRouter = (routerInstance) => {
  vueRouter = routerInstance
}

// Interceptor para manejar el refresh token si hay un error 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Llamada para refrescar el token
        const refreshToken = Cookies.get('refresh_token')
        const response = await axios.get('http://localhost:1337/api/aplicaciones/refresh', {
          refresh_token: refreshToken
        })
        const response2 = await axios.get('http://localhost:1337/api/versions', {
          refresh_token: refreshToken
        })
        const newToken = response.data.access_token
        Cookies.set('access_token', newToken) // Guardamos el nuevo token

        // Reintentamos la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axios(originalRequest)
      } catch (refreshError) {
        console.error('Error en token refresh:', refreshError)
        return Promise.reject(refreshError)
      }
    }

    
    //Si da error 403, te manda a la pagina /acesso-denegado
    if (error.response && error.response.status === 403) {
      if (vueRouter) {
        vueRouter.push('/acceso-denegado')
      } else {
        console.warn('Router no disponible para redirigir al acceso denegado')
      }
    }
    return Promise.reject(error)
  }
)

export default api
