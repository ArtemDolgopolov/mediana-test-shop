<template>
 <div @scroll.passive="onScroll" ref="scrollContainer" class="overflow-auto h-screen">
   <Header />

   <main class="p-4">
     <h1 class="text-2xl font-bold mb-4">Товары</h1>

     <!-- Панель фильтров -->
     <div class="flex flex-col md:flex-row gap-3 mb-4">
       <!-- Поиск -->
       <input
         v-model="params.search"
         @input="updateFilters"
         type="text"
         placeholder="Поиск по названию..."
         class="border px-3 py-2 rounded w-full md:w-1/3"
       />

       <!-- Категории -->
       <select v-model="params.category" @change="updateFilters" class="border px-3 py-2 rounded">
         <option value="">Все категории</option>
         <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
       </select>

       <!-- Сортировка -->
       <select v-model="params.sort" @change="updateFilters" class="border px-3 py-2 rounded">
         <option value="">Без сортировки</option>
         <option value="price">По цене (дешевле)</option>
         <option value="price-desc">По цене (дороже)</option>
         <option value="date">По дате (сначала старое)</option>
         <option value="date-desc">По дате (сначала новое)</option>
       </select>
     </div>

     <!-- Список -->
     <div v-if="loading && products.length === 0">Загрузка...</div>

     <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
       <div
         v-for="p in products"
         :key="p.id"
         class="border rounded p-3 hover:shadow transition"
       >
         <img :src="p.thumbnail" class="h-40 w-full object-cover mb-2" />
         <h2 class="font-semibold">{{ p.title }}</h2>
         <p class="text-gray-500 text-sm">{{ p.price }} $</p>
         <div class="flex gap-2 mt-2">
           <button @click="addToCart(p)" class="border px-2 py-1">🛒</button>
           <button @click="toggleFav(p)" class="border px-2 py-1">⭐</button>
         </div>
         <router-link :to="'/product/' + p.id" class="text-blue-500 text-sm mt-1 inline-block">
           Подробнее
         </router-link>
       </div>
     </div>

     <!-- Индикатор загрузки -->
     <div v-if="loading && products.length > 0" class="text-center mt-4">
       <span class="animate-pulse text-gray-500">Загрузка товаров...</span>
     </div>

     <div v-if="allLoaded" class="text-center text-gray-500 mt-6">
       Все товары загружены
     </div>
   </main>
 </div>
</template>

<script>

import Header from './Header.vue'
import { mapState } from 'vuex'

export default {
 components: { Header },
 data() {
   return {
     allLoaded: false,
     observer: null
   }
 },
 computed: {
   ...mapState('products', ['list', 'loading', 'categories', 'params', 'total']),
   products() { return this.list }
 },
 watch: {
   total() {
     this.checkIfAllLoaded()
   }
 },
 methods: {
   addToCart(p) { this.$store.commit('cart/add', p) },
   toggleFav(p) { this.$store.commit('favorites/toggle', p) },

   async updateFilters() {
     this.allLoaded = false
     this.$store.commit('products/resetSkip')
     await this.$store.dispatch('products/loadProducts')
     this.checkIfAllLoaded()
   },

   async loadMore() {
     if (this.loading || this.allLoaded) return
     await this.$store.dispatch('products/loadMore')
     this.checkIfAllLoaded()
   },

   checkIfAllLoaded() {
     this.allLoaded = this.products.length >= this.total
   },

   onScroll() {
     const el = this.$refs.scrollContainer
     if (!el) return

     const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
     if (bottom && !this.loading && !this.allLoaded) {
       this.loadMore()
     }
   }
 },
 async mounted() {
   await this.$store.dispatch('products/loadCategories')
   await this.$store.dispatch('products/loadProducts')
   this.checkIfAllLoaded()
 }
}
</script>

<style scoped>
/* просто для плавного эффекта */
::-webkit-scrollbar {
 width: 8px;
}
::-webkit-scrollbar-thumb {
 background-color: #d1d5db;
 border-radius: 4px;
}
</style>
