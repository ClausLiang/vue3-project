<script setup lang="ts"></script>

<template>
  <div class="top-header">
    <span class="didit">You did it!</span>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </div>
  <RouterView />
</template>

<style>
.top-header {
  margin: 0;
}
.top-header .didit {
  font-size: 2em;
}
.top-header nav a {
  margin-right: 5px;
}
</style>
