export default {
 namespaced: true,
 state: () => ({ items: [] }),
 getters: {
   total(state) {
     return state.items.reduce((s, i) => s + i.product.price * i.qty, 0)
   }
 },
 mutations: {
   add(state, product) {
     const existing = state.items.find(i => i.product.id === product.id)
     if (existing) existing.qty++
     else state.items.push({ product, qty: 1 })
   },
   remove(state, id) {
     state.items = state.items.filter(i => i.product.id !== id)
   },
   clear(state) { state.items = [] },
   setQty(state, { id, qty }) {
     const item = state.items.find(i => i.product.id === id)
     if (item) item.qty = qty
   },
   increaseQty(state, id) {
     const item = state.items.find(i => i.product.id === id)
     if (item) item.qty++
   },
   decreaseQty(state, id) {
     const item = state.items.find(i => i.product.id === id)
     if (item && item.qty > 1) item.qty--
   }
  }
}
