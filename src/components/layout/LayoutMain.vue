<template>
  <div class="layout-main">
    <div class="layout-main-menu"></div>
    <div class="layout-main-content">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped lang="less">
.layout-main {
  display: flex;
  height: 100vh;
  .layout-main-menu {
    width: 200px;
    background-color: #f5f5f5;
  }
  .layout-main-content {
    flex: 1;
  }
}
</style>
