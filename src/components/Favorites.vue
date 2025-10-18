<template>
  <div>
    <Header />

    <main class="max-w-6xl mx-auto p-4 font-inconsolata">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <HeartIconSolid class="w-7 h-7 text-pink-500" />
        Избранные товары
      </h2>

      <div v-if="items.length === 0" class="text-gray-500 text-center py-10">
        Пока ничего нет 💔
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="p in items"
          :key="p.id"
          class="border border-gray-400 rounded-xl p-3 hover:shadow-xl transition flex flex-col justify-between bg-white"
        >
          <!-- Ссылка на товар -->
          <router-link
            :to="'/product/' + p.id"
            class="flex-1 flex flex-col"
          >
            <div class="aspect-[4/3] w-full overflow-hidden rounded-lg">
              <img
                :src="p.thumbnail"
                alt=""
                class="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div class="mt-2 flex-1 flex flex-col justify-between">
              <h2 class="font-semibold text-gray-800">{{ p.title }}</h2>
              <p class="text-gray-500 text-sm">{{ p.price }} $</p>
            </div>
          </router-link>

          <!-- Кнопки управления -->
          <div class="flex gap-2 mt-3 justify-end">
            <!-- Добавить в корзину -->
            <button
              @click.stop="addToCart(p)"
              class="border-transparent px-2 py-1 hover:text-green-600 transition"
              title="Добавить в корзину"
            >
              <ShoppingCartIcon class="w-6 h-6 inline-block" />
            </button>

            <!-- Избранное -->
            <button
              @click.stop="toggleFav(p)"
              class="border-transparent px-2 py-1 hover:text-red-500 transition"
              title="Убрать из избранного"
            >
              <HeartIconSolid
                v-if="isFav(p)"
                class="w-6 h-6 inline-block text-red-500"
              />
              <HeartIconOutline
                v-else
                class="w-6 h-6 inline-block"
              />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from './Header.vue'
import { mapState } from 'vuex'
import {
  ShoppingCartIcon,
  HeartIcon as HeartIconSolid,
} from '@heroicons/vue/24/solid'
import { HeartIcon as HeartIconOutline } from '@heroicons/vue/24/outline'

export default {
  components: { Header, ShoppingCartIcon, HeartIconSolid, HeartIconOutline },
  computed: {
    ...mapState('favorites', ['items']),
  },
  methods: {
    toggleFav(p) {
      this.$store.commit('favorites/toggle', p)
    },
    isFav(p) {
      return this.items.some(item => item.id === p.id)
    },
    addToCart(p) {
      this.$store.commit('cart/add', p)
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
