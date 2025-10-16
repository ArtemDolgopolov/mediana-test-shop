<template>
  <div>
    <Header />
    <main class="p-4" v-if="product">
      <img :src="product.thumbnail" class="h-64 object-cover mb-4" />
      <h2 class="text-2xl font-bold">{{ product.title }}</h2>
      <p class="text-gray-600">{{ product.description }}</p>
      <div class="mt-4 flex gap-3">
        <button @click="addToCart(product)" class="border px-4 py-2">В корзину</button>
        <button @click="toggleFav(product)" class="border px-4 py-2">В избранное</button>
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
    ...mapState('products', ['currentProduct']),
    product() { return this.currentProduct }
  },
  mounted() {
    this.$store.dispatch('products/loadProduct', this.$route.params.id)
  },
  methods: {
    addToCart(p) { this.$store.commit('cart/add', p) },
    toggleFav(p) { this.$store.commit('favorites/toggle', p) }
  }
}
</script>
