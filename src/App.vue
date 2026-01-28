<template>
  <NavBar />
  <main class="container">
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from '@/components/NavBar.vue'

export default defineComponent({
  components: { NavBar },
})
</script>

<style scoped>
.container {
  padding: 16px;
  max-width: 1000px;
  margin: 0 auto;
}
</style>
