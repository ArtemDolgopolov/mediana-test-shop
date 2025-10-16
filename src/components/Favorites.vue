<template>
  <div>
    <Header />
    <main class="p-4">
      <h2 class="text-2xl mb-3">Избранные товары</h2>
      <div v-if="items.length === 0">Пока ничего нет</div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="p in items" :key="p.id" class="border p-3">
          <img :src="p.thumbnail" class="h-32 object-cover mb-2" />
          <h3>{{ p.title }}</h3>
          <button @click="remove(p.id)" class="text-red-500 text-sm mt-2">Удалить</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from './Header.vue'
export default {
  components: { Header },
  computed: {
    items() { return this.$store.state.favorites.items }
  },
  methods: {
    remove(id) { this.$store.commit('favorites/toggle', { id }) }
  }
}
</script>
