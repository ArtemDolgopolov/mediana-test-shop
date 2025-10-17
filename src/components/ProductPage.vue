<template>
 <div>
   <Header />
   <main class="p-4">
     <div v-if="loading" class="flex items-center justify-center h-64">
       <div class="text-gray-500">Загрузка продукта...</div>
     </div>

     <!-- Ошибка при загрузке -->
     <div v-else-if="error" class="text-center text-red-500 py-8">
       {{ error }}
     </div>

     <!-- Успешно загруженный продукт -->
     <div v-else-if="product" class="grid md:grid-cols-2 gap-6">
       <img :src="product.thumbnail" alt="" class="w-full h-80 object-cover rounded" />
       <div>
         <h1 class="text-2xl font-bold">{{ product.title }}</h1>
         <p class="text-gray-600 mt-2">{{ product.description }}</p>
         <div class="mt-4">
           <div class="text-xl font-semibold">{{ product.price }} $</div>
           <div class="mt-2 flex gap-2">
             <button @click="addToCart(product)" class="px-4 py-2 border rounded">В корзину</button>
             <button @click="toggleFav(product)" class="px-4 py-2 border rounded">В избранное</button>
           </div>
         </div>
       </div>
     </div>

     <!-- Если продукт не найден или не загружен -->
     <div v-else class="text-center text-gray-500 py-8">
       Продукт не найден.
     </div>
   </main>
 </div>
</template>

<script>

import Header from './Header.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { fetchProductById } from '../api/products'

export default {
 components: { Header },
 setup() {
   const route = useRoute()
   const store = useStore()

   // Локальные рефы, чтобы избежать гонок с глобальным state
   const product = ref(null)
   const loading = ref(false)
   const error = ref('')

   // Функция загрузки — отменяем старые данные и загружаем новые
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
       // fetchProductById должен возвращать объект продукта (api/products.js)
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

   // При первой загрузке страницы
   onMounted(() => {
     loadProduct(route.params.id)
   })

   // При изменении id в адресной строке (когда пользователь кликает другой товар)
   watch(
     () => route.params.id,
     (newId, oldId) => {
       if (newId === oldId) return
       loadProduct(newId)
     }
   )

   // Методы для cart/favorites (через Vuex)
   const addToCart = (p) => store.commit('cart/add', p)
   const toggleFav = (p) => store.commit('favorites/toggle', p)

   return {
     product,
     loading,
     error,
     addToCart,
     toggleFav
   }
 }
}
</script>

<style scoped>

</style>
