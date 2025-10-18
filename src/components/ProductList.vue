<template>
 <div @scroll.passive="onScroll" ref="scrollContainer" class="overflow-auto h-screen">
   <Header />

   <main class="min-h-screen p-6 font-inconsolata">
     <h1 class="text-3xl font-bold mb-6 text-gray-800">Каталог товаров</h1>

     <!-- Панель фильтров -->
     <div class="flex flex-col md:flex-row gap-3 mb-4">
       <input
         v-model="params.search"
         @input="updateFilters"
         type="text"
         placeholder="Поиск по названию..."
         class="border border-gray-400 px-3 py-2 rounded w-full md:w-1/3"
       />

       <select v-model="params.category" @change="updateFilters" class="border border-gray-400 px-3 py-2 rounded">
         <option value="">Все категории</option>
         <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
       </select>

       <select v-model="params.sort" @change="updateFilters" class="border border-gray-400 px-3 py-2 rounded">
         <option value="">Без сортировки</option>
         <option value="price">По цене (дешевле)</option>
         <option value="price-desc">По цене (дороже)</option>
         <option value="date">По дате (сначала старое)</option>
         <option value="date-desc">По дате (сначала новое)</option>
       </select>
     </div>

     <!-- Спиннер при первой загрузке -->
     <div v-if="loading && products.length === 0" class="flex justify-center items-center py-20">
       <div class="w-10 h-10 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
     </div>

     <div
       v-else-if="initialized && !loading && products.length === 0"
       class="text-center py-20 text-gray-500"
     >
       Товар не найден 💔
     </div>

     <!-- Сетка товаров -->
     <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
       <div
         v-for="p in products"
         :key="p.id"
         class="border border-gray-400 rounded-xl p-3 hover:shadow-xl transition flex flex-col"
       >
         <router-link :to="'/product/' + p.id" class="flex-1 flex flex-col">
           <div class="aspect-[4/3] w-full overflow-hidden rounded-lg">
             <img
               :src="p.thumbnail"
               alt=""
               class="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
             />
           </div>

           <div class="mt-2 flex-1 flex flex-col justify-between">
             <h2 class="font-semibold">{{ p.title }}</h2>
             <p class="text-gray-500 text-sm">{{ p.price }} $</p>
           </div>
         </router-link>

         <div class="flex gap-2 mt-3 justify-end">
           <button
             @click.stop="addToCart(p)"
             class="border-transparent px-2 py-1 hover:text-green-600 transition"
           >
             <ShoppingCartIcon class="w-6 h-6 inline-block" />
           </button>
           <button
             @click.stop="toggleFav(p)"
             class="border-transparent px-2 py-1 hover:text-red-500 transition"
           >
             <HeartIconSolid v-if="isFav(p)" class="w-6 h-6 inline-block text-red-500" />
             <HeartIconOutline v-else class="w-6 h-6 inline-block" />
           </button>
         </div>
       </div>
     </div>

     <!-- Спиннер при подгрузке -->
     <div v-if="loading && products.length > 0" class="flex justify-center items-center py-20">
       <div class="w-10 h-10 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
     </div>
   </main>
 </div>
</template>

<script>
import Header from './Header.vue'
import { mapState } from 'vuex'
import { ShoppingCartIcon, HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/vue/24/outline'

export default {
 components: { Header, ShoppingCartIcon, HeartIconSolid, HeartIconOutline },
 data() {
   return {
     allLoaded: false,
     initialized: false
   }
 },
 computed: {
   ...mapState('products', ['list', 'loading', 'categories', 'params', 'total']),
   ...mapState('favorites', ['items']),
   products() {
     return this.list
   }
 },
 watch: {
   total() {
     this.checkIfAllLoaded()
   }
 },
 methods: {
   addToCart(p) {
     this.$store.commit('cart/add', p)
   },
   toggleFav(p) {
     this.$store.commit('favorites/toggle', p)
   },
   isFav(p) {
     return this.items.some(item => item.id === p.id)
   },
   async updateFilters() {
     this.allLoaded = false
     this.initialized = false
     this.$store.commit('products/resetSkip')
     await this.$store.dispatch('products/loadProducts')
     this.initialized = true
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
     if (bottom && !this.loading && !this.allLoaded) this.loadMore()
   }
 },
 async mounted() {
   await this.$store.dispatch('products/loadCategories')
   await this.$store.dispatch('products/loadProducts')
   this.initialized = true
   this.checkIfAllLoaded()
 }
}
</script>

<style scoped>
::-webkit-scrollbar {
 width: 8px;
}
::-webkit-scrollbar-thumb {
 background-color: #d1d5db;
 border-radius: 4px;
}
</style>
