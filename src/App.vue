<template>
 
    <NavBar />
<main :class="$route.path.includes('dashboard') ? 'container-fluid' : 'container'">

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
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: var(--spacing-lg);
}

.container-fluid {
  width: 100%;
  padding: var(--spacing-lg);
}


@media (max-width: 768px) {
  .container {
    padding: var(--spacing-md);
  }
}
</style>
