<template>
  <div>
    <Header />
    <main class="p-4">
      <h2 class="text-2xl mb-3">Корзина</h2>
      <div v-if="items.length === 0">Корзина пуста</div>
      <div v-else>
        <div v-for="i in items" :key="i.product.id" class="border-b py-2 flex justify-between">
          <div>{{ i.product.title }} ({{ i.qty }} шт.)</div>
          <div>{{ i.product.price * i.qty }} $</div>
          <button @click="remove(i.product.id)" class="text-red-500">Удалить</button>
        </div>
        <div class="mt-4 font-bold">Итого: {{ total }} $</div>
        <button @click="clear" class="mt-2 border px-3 py-1">Очистить корзину</button>
      </div>
    </main>
  </div>
</template>

<script>
import Header from './Header.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  components: { Header },
  computed: {
    ...mapState('cart', ['items']),
    ...mapGetters('cart', ['total'])
  },
  methods: {
    remove(id) { this.$store.commit('cart/remove', id) },
    clear() { this.$store.commit('cart/clear') }
  }
}
</script>
