import { fetchProducts, fetchProductById } from '../../api/products'

export default {
  namespaced: true,
  state: () => ({
    list: [],
    currentProduct: null,
    loading: false
  }),
  mutations: {
    setLoading(state, v) { state.loading = v },
    setProducts(state, products) { state.list = products },
    setCurrentProduct(state, p) { state.currentProduct = p }
  },
  actions: {
    async loadProducts({ commit }) {
      commit('setLoading', true)
      const res = await fetchProducts()
      commit('setProducts', res.products)
      commit('setLoading', false)
    },
    async loadProduct({ commit }, id) {
      commit('setLoading', true)
      const res = await fetchProductById(id)
      commit('setCurrentProduct', res)
      commit('setLoading', false)
    }
  }
}
