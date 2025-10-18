<template>
 <div>
   <Header />
   <main class="max-w-6xl mx-auto p-4 font-inconsolata">
     <h2 class="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
       <ShoppingCartIcon class="w-7 h-7 text-gray-700" />
       Корзина
     </h2>

     <div v-if="items.length === 0" class="text-gray-500 text-center py-10">
       Корзина пуста 😔
     </div>

     <div
       v-else
       class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
     >
       <div
         v-for="i in items"
         :key="i.product.id"
         class="border border-gray-400 rounded-xl p-3 hover:shadow-xl transition flex flex-col justify-between bg-white"
       >
         <!-- Товар -->
         <router-link
           :to="'/product/' + i.product.id"
           class="flex-1 flex flex-col"
         >
           <div class="aspect-[4/3] w-full overflow-hidden rounded-lg">
             <img
               :src="i.product.thumbnail"
               alt=""
               class="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
             />
           </div>

           <div class="mt-2 flex-1 flex flex-col justify-between">
             <h2 class="font-semibold text-gray-800">{{ i.product.title }}</h2>
             <p class="text-gray-500 text-sm">{{ i.product.price }} $ / шт.</p>
           </div>
         </router-link>

         <!-- Количество -->
         <div class="flex items-center justify-center gap-2 mt-3">
           <button
             @click="decreaseQty(i.product.id)"
             class="px-2 py-1 border rounded-lg hover:bg-gray-100 text-lg leading-none"
           >
             −
           </button>
           <span class="text-lg font-semibold">{{ i.qty }}</span>
           <button
             @click="increaseQty(i.product.id)"
             class="px-2 py-1 border rounded-lg hover:bg-gray-100 text-lg leading-none"
           >
             +
           </button>
         </div>

         <!-- Цена -->
         <div class="mt-2 text-center font-bold text-gray-800">
           {{ (i.product.price * i.qty).toFixed(2) }} $
         </div>

         <!-- Кнопки -->
         <div class="flex justify-end gap-2 mt-3">
           <button
             @click.stop="toggleFav(i.product)"
             class="border-transparent px-2 py-1 hover:text-red-500 transition"
             :title="isFav(i.product) ? 'Убрать из избранного' : 'Добавить в избранное'"
           >
             <HeartIconSolid v-if="isFav(i.product)" class="w-6 h-6 inline-block text-red-500" />
             <HeartIconOutline v-else class="w-6 h-6 inline-block" />
           </button>

           <button
             @click.stop="remove(i.product.id)"
             class="border-transparent px-2 py-1 hover:text-red-600 transition"
             title="Удалить из корзины"
           >
             <TrashIcon class="w-6 h-6 inline-block" />
           </button>
         </div>
       </div>
     </div>

     <div v-if="items.length > 0" class="mt-10 text-right font-bold text-lg">
       Итого: <span>{{ formattedTotal }} $</span>
     </div>

     <div v-if="items.length > 0" class="text-right mt-4">
       <button
         @click="clear"
         class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
       >
         Очистить корзину
       </button>
     </div>
   </main>
 </div>
</template>

<script>
import Header from './Header.vue'
import { mapState, mapGetters } from 'vuex'
import { ShoppingCartIcon, TrashIcon, HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/vue/24/outline'

export default {
 components: {
   Header,
   ShoppingCartIcon,
   TrashIcon,
   HeartIconSolid,
   HeartIconOutline,
 },
 computed: {
   ...mapState('cart', ['items']),
   ...mapGetters('cart', ['total']),

   favorites() {
     return this.$store.state.favorites.items || []
   },
   formattedTotal() {
     return this.total.toFixed(2)
   },
 },
 methods: {
   remove(id) {
     this.$store.commit('cart/remove', id)
   },
   clear() {
     this.$store.commit('cart/clear')
   },
   increaseQty(id) {
     this.$store.commit('cart/increaseQty', id)
   },
   decreaseQty(id) {
     this.$store.commit('cart/decreaseQty', id)
   },
   toggleFav(product) {
     this.$store.commit('favorites/toggle', product)
   },
   isFav(product) {
     return this.favorites.some(f => f.id === product.id)
   },
 },
}
</script>

<style scoped>
img {
 transition: transform 0.3s ease;
}
img:hover {
 transform: scale(1.05);
}
</style>
