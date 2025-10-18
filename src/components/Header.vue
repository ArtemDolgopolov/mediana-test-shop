<template>
 <header class="sticky top-0 z-50 bg-white shadow-md border-b font-inconsolata">
   <div class="container max-w-full px-4 py-3 flex justify-between items-center">
     <router-link to="/" class="flex items-center gap-2 font-bold text-2xl text-blue-600">
       <span class="text-[#374151]">Shop</span>
     </router-link>

     <nav class="flex items-center gap-6 text-gray-700">
       <router-link to="/favorites" class="relative hover:text-red-500 transition">
         <HeartIcon class="w-6 h-6 inline-block" />
         <span class="text-sm ml-1">Избранное</span>
         <span
           v-if="$store.state.favorites.items.length"
           class="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1"
         >
           {{ $store.state.favorites.items.length }}
         </span>
       </router-link>

       <router-link to="/cart" class="relative hover:text-green-600 transition">
         <ShoppingCartIcon class="w-6 h-6 inline-block" />
         <span class="text-sm ml-1">Корзина</span>
         <span
           v-if="cartCount > 0"
           class="absolute -top-2 -right-3 bg-green-600 text-white text-xs rounded-full px-1"
         >
           {{ cartCount }}
         </span>
       </router-link>
     </nav>
   </div>
 </header>
</template>

<script>
import { ShoppingCartIcon, HeartIcon } from '@heroicons/vue/24/solid'

export default {
 components: { ShoppingCartIcon, HeartIcon },
 computed: {
   cartCount() {
     return this.$store.state.cart.items.reduce((sum, item) => sum + item.qty, 0)
   }
 }
}
</script>
