import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import WithEthereum from './views/WithEthereum'
import LinkWithHash from './views/LinkWithHash'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/WithEthereum',
      name: 'WithEthereum',
      component: WithEthereum
    },
    {
      path: '/hash/:hash',
      name: 'hash',
      component: LinkWithHash
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/github',
      name: 'github',
      beforeEnter () { location.href = 'https://github.com/kulapio/ipfsplay' }
    }
  ]
})
