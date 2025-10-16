<template>
  <div>
    <Header />
    <main class="p-4">
      <h1 class="text-2xl mb-4 font-bold">Товары</h1>
      <div v-if="loading">Загрузка...</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="p in products" :key="p.id" class="border rounded p-3">
          <img :src="p.thumbnail" class="h-40 w-full object-cover mb-2" />
          <h2 class="font-semibold">{{ p.title }}</h2>
          <p class="text-gray-500 text-sm">{{ p.price }} $</p>
          <div class="flex gap-2 mt-2">
            <button @click="addToCart(p)" class="border px-2 py-1">В корзину</button>
            <button @click="toggleFav(p)" class="border px-2 py-1">☆</button>
          </div>
          <router-link :to="'/product/' + p.id" class="text-blue-500 text-sm mt-1 inline-block">Подробнее</router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from './Header.vue'
import { mapState } from 'vuex'

export default {
  components: { Header },
  computed: {
    ...mapState('products', ['list', 'loading']),
    products() { return this.list }
  },
  methods: {
    addToCart(p) { this.$store.commit('cart/add', p) },
    toggleFav(p) { this.$store.commit('favorites/toggle', p) }
  },
  mounted() {
    this.$store.dispatch('products/loadProducts')
  }
}
</script>
