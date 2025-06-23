import { createRouter, createWebHashHistory } from 'vue-router'
import { createApp } from 'vue'
import './css/main.css'
import { setRouter } from './axios' 

// Importamos el componente App y las vistas
import App from './App.vue'
import Login from '../src/components/Login.vue'
import Principal from './Principal.vue'
import Dashboard from '../src/components/DashBoard.vue'
import States from '../src/components/States.vue'
import Version from '../src/components/Version.vue'
import DashboardCliente from '../src/components/DashboardCliente.vue'
import VersionCliente from '../src/components/VersionCliente.vue'
import '@fortawesome/fontawesome-free/css/all.css'




// Usamos js-cookie para comprobar si hay un token de acceso
import Cookies from 'js-cookie'

// Función para verificar si el usuario está autenticado leyendo de las cookies
function isAuthenticated() {
    return Cookies.get('access_token') !== undefined
}

// Definimos las rutas de la aplicación
const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
    },
    {
        path: '/principal',
        component: Principal,
        meta: { requiresAuth: true }
    },
    {
        path: '/states',
        component: States,
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboardCliente',
        component: DashboardCliente,
        meta: { requiresAuth: true }
    },
    {
        path: '/version',
        component: Version,
        meta: { requiresAuth: true }
    },
    {
        path: '/versionCliente',
        component: VersionCliente,
        meta: { requiresAuth: true }
    },
    {
        path: '/acceso-denegado',
        name: 'AccesoDenegado',
        component: () => import('../src/components/acceso_denegado.vue')
    }
]

// Creamos el router y añadimos navegación protegida por autenticación
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// Verificación previa a cada ruta protegida para asegurar autenticación
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next('/')
    } else {
        next()
    }
})


//Llamamos al router para ir a acceso-denegado
setRouter(router)

// Inicializamos y montamos la app
const app = createApp(App)
app.use(router)
app.mount('#app')


