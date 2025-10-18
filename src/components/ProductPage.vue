<template>
 <div>
   <Header />
   <main class="p-4 font-inconsolata">
     <!-- Спиннер -->
     <div v-if="loading" class="flex justify-center items-center py-20">
       <div class="w-10 h-10 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
     </div>

     <!-- Ошибка при загрузке -->
     <div v-else-if="error" class="text-center text-red-500 py-8">
       {{ error }}
     </div>

     <!-- Успешно загруженный продукт -->
     <div v-else-if="product" class="grid md:grid-cols-2 gap-6 items-start">
       <!-- Изображение -->
       <div class="flex justify-center">
         <img
           :src="product.thumbnail"
           alt=""
           class="w-full max-w-sm h-auto object-contain rounded-lg shadow-sm"
         />
       </div>

       <!-- Информация -->
       <div class="flex flex-col justify-center">
         <h1 class="text-3xl font-bold text-gray-800">{{ product.title }}</h1>
         <p class="text-gray-600 mt-3 leading-relaxed">{{ product.description }}</p>

         <div class="mt-6">
           <div class="text-2xl font-semibold text-gray-900">{{ product.price }} $</div>

           <!-- Кнопки -->
           <div class="mt-4 flex gap-3 items-center">
             <!-- Добавить в корзину -->
             <button
               @click="addToCart(product)"
               class="border-transparent px-3 py-2 hover:text-green-600 transition"
               title="Добавить в корзину"
             >
               <ShoppingCartIcon class="w-7 h-7 inline-block" />
             </button>

             <!-- Избранное -->
             <button
               @click="toggleFav(product)"
               class="border-transparent px-3 py-2 hover:text-red-500 transition"
               title="Добавить в избранное"
             >
               <HeartIconSolid
                 v-if="isFav(product)"
                 class="w-7 h-7 inline-block text-red-500"
               />
               <HeartIconOutline
                 v-else
                 class="w-7 h-7 inline-block"
               />
             </button>
           </div>
         </div>
       </div>
     </div>

     <div v-else class="text-center text-gray-500 py-8">
       Продукт не найден.
     </div>
   </main>
 </div>
</template>

<script>
import Header from './Header.vue'
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { fetchProductById } from '../api/products'

import {
 ShoppingCartIcon,
 HeartIcon as HeartIconSolid,
} from '@heroicons/vue/24/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/vue/24/outline'

export default {
 components: { Header, ShoppingCartIcon, HeartIconSolid, HeartIconOutline },
 setup() {
   const route = useRoute()
   const store = useStore()

   const product = ref(null)
   const loading = ref(false)
   const error = ref('')

   const favorites = computed(() => store.state.favorites.items)

   const loadProduct = async (id) => {
     if (!id) {
       product.value = null
       error.value = 'Неверный id продукта'
       return
     }

     product.value = null
     error.value = ''
     loading.value = true

     try {
       const res = await fetchProductById(id)
       product.value = res
     } catch (err) {
       console.error('Ошибка при загрузке продукта:', err)
       error.value = 'Не удалось загрузить продукт. Попробуйте ещё раз.'
       product.value = null
     } finally {
       loading.value = false
     }
   }

   onMounted(() => {
     loadProduct(route.params.id)
   })

   watch(
     () => route.params.id,
     (newId, oldId) => {
       if (newId === oldId) return
       loadProduct(newId)
     }
   )

   const addToCart = (p) => store.commit('cart/add', p)
   const toggleFav = (p) => store.commit('favorites/toggle', p)
   const isFav = (p) => favorites.value.some(item => item.id === p.id)

   return {
     product,
     loading,
     error,
     addToCart,
     toggleFav,
     isFav,
   }
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
