import { createStore } from 'vuex'
import products from './modules/products'
import cart from './modules/cart'
import favorites from './modules/favorites'

export default createStore({
  modules: { products, cart, favorites },
})
