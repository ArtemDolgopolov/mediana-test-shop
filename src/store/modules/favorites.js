export default {
 namespaced: true,
 state: () => ({ items: [] }),
 mutations: {
   toggle(state, product) {
     const i = state.items.find(p => p.id === product.id)
     if (i) state.items = state.items.filter(p => p.id !== product.id)
     else state.items.push(product)
   }
 }
}
