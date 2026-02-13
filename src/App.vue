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
  display: flex;
  justify-content: center;
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
