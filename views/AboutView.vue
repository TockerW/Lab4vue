<script setup lang="ts">
const skills: string[] = ['Vue 3', 'TypeScript', 'Vue Router', 'Pinia', 'SCSS / Bootstrap', 'REST API']
</script>

<template>
  <div class="card"><div class="card-body">
    <h4>Мазур Юрій Ігорович</h4>
    <h6 class="mt-3">Technical skills</h6>
    <ul><li v-for="s in skills" :key="s">{{ s }}</li></ul>
    <a href="https://github.com/TockerW" target="_blank" rel="noopener">GitHub акаунт</a>
  </div></div>
</template>
