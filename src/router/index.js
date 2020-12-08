import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login')
const Home = () => import('../components/Home')
const Welcome = () => import('../components/home/Welcome')
const User = () => import('../components/user/User')
const Rights = () => import('../components/power/Rights')
const Roles = () => import('../components/power/Roles')

Vue.use(VueRouter)

const routes = [{
  path: '',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  children: [{
    path: '',
    redirect: 'welcome'
  },
  {
    path: 'welcome',
    component: Welcome
  }, {
    path: 'users',
    component: User
  }, {
    path: 'rights',
    component: Rights
  }, {
    path: 'roles',
    component: Roles
  }
  ]
}
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const keytoken = window.sessionStorage.getItem('token')
  if (!keytoken) return next('/login')
  next()
})


export default router
