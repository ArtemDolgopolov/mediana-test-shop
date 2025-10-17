// src/store/modules/products.js
import { fetchProducts, fetchProductById, fetchCategories } from '../../api/products'

export default {
  namespaced: true,
  state: () => ({
    list: [],
    currentProduct: null,
    loading: false,
    categories: [],
    total: 0,
    params: {
      search: '',
      category: '',
      sort: '',
      limit: 12,
      skip: 0
    }
  }),
  mutations: {
    setLoading(state, v) { state.loading = v },
    setProducts(state, { products, total }) {
      state.list = products
      state.total = total
    },
    addProducts(state, products) {
      state.list.push(...products)
    },
    setCurrentProduct(state, p) { state.currentProduct = p },
    setCategories(state, cats) { state.categories = cats },
    setParam(state, { key, value }) { state.params[key] = value },
    resetSkip(state) { state.params.skip = 0 }
  },
  // внутри actions:
actions: {
 // loadProducts: загрузить страницу (reset = true => заменить список, reset = false => добавить)
 async loadProducts({ commit, state }, { reset = true } = {}) {
   commit('setLoading', true)
   const skip = reset ? 0 : state.params.skip
   // передаём в fetchProducts все параметры из state.params,
   // но явно переопределяем skip/limit для безопасности
   const res = await fetchProducts({ 
     ...state.params,
     skip,
     limit: state.params.limit
   })

   if (reset) {
     commit('setProducts', res)
     commit('setParam', { key: 'skip', value: res.products.length >= res.total ? state.params.limit : 0 })
     // лучше явно установить skip = res.products.length (но поскольку мы ставим 0 при reset,
     // мы сразу после этого установим корректно в loadMore)
     // Для простоты: установим skip = res.products.length (обычно = limit)
     commit('setParam', { key: 'skip', value: res.products.length })
   } else {
     // мы добавляем следующую страницу
     commit('addProducts', res.products)
     // обновляем skip на новое значение (текущее + limit)
     const newSkip = state.params.skip + state.params.limit
     commit('setParam', { key: 'skip', value: newSkip })
   }

   commit('setLoading', false)
 },

 // Более простая и надёжная реализация loadMore
 async loadMore({ dispatch, state }) {
   if (state.loading) return
   // вызываем loadProducts с reset = false
   await dispatch('loadProducts', { reset: false })
 },

 async loadCategories({ commit }) {
   const cats = await fetchCategories()
   // если endpoint другой, возможно нужно взять res.data или res (зависит от API)
   commit('setCategories', cats)
 }
}

}
