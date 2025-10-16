import { createRouter, createWebHistory } from 'vue-router'
import ProductList from '../components/ProductList.vue'
import ProductPage from '../components/ProductPage.vue'
import Cart from '../components/Cart.vue'
import Favorites from '../components/Favorites.vue'

const routes = [
  { path: '/', component: ProductList },
  { path: '/product/:id', component: ProductPage, props: true },
  { path: '/cart', component: Cart },
  { path: '/favorites', component: Favorites }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
