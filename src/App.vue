<template>
  <div class="app-wrapper">
    <NavBar />
    <main class="container">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'

export default defineComponent({
  components: { NavBar, Footer },
})
</script>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
}

@media (max-width: 768px) {
  .container {
    padding: var(--spacing-md);
  }
}
</style>
