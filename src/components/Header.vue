<template>
  <header class="flex justify-between items-center p-4 bg-white shadow">
    <router-link to="/" class="font-bold text-xl">Shop</router-link>
    <nav class="flex gap-4">
      <router-link to="/favorites">Избранные</router-link>
      <router-link to="/cart">Корзина</router-link>
    </nav>
  </header>
</template>
