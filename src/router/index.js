import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import index from '../index'
import Label from '../label'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: App,
      children:[
        {
          path: '/',
          component: index,
          name: 'index'
        },
        {
          path: '/l',
          component: Label,
          name: 'l'
        }
      ]
    }
  ]
})
