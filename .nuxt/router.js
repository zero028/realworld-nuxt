import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from '@nuxt/ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _63ddc9f0 = () => interopDefault(import('..\\pages\\layout' /* webpackChunkName: "" */))
const _76ed1786 = () => interopDefault(import('..\\pages\\home' /* webpackChunkName: "" */))
const _6645486a = () => interopDefault(import('..\\pages\\login' /* webpackChunkName: "" */))
const _37c734ea = () => interopDefault(import('..\\pages\\profile' /* webpackChunkName: "" */))
const _30b05c81 = () => interopDefault(import('..\\pages\\settings' /* webpackChunkName: "" */))
const _7b7b7d6a = () => interopDefault(import('..\\pages\\editor' /* webpackChunkName: "" */))
const _6a32ae50 = () => interopDefault(import('..\\pages\\article' /* webpackChunkName: "" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _63ddc9f0,
    children: [{
      path: "",
      component: _76ed1786,
      name: "home"
    }, {
      path: "/login",
      component: _6645486a,
      name: "login"
    }, {
      path: "/register",
      component: _6645486a,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _37c734ea,
      name: "profile"
    }, {
      path: "/settings",
      component: _30b05c81,
      name: "settings"
    }, {
      path: "/editor/:slug",
      component: _7b7b7d6a,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _6a32ae50,
      name: "article"
    }]
  }],

  fallback: false
}

function decodeObj(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = decode(obj[key])
    }
  }
}

export function createRouter () {
  const router = new Router(routerOptions)

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    const r = resolve(to, current, append)
    if (r && r.resolved && r.resolved.query) {
      decodeObj(r.resolved.query)
    }
    return r
  }

  return router
}
