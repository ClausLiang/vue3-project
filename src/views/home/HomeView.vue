<template>
  <div class="home-page">
    <a-card>
      <a-button @click="showTag" type="primary">打标签</a-button>
      <EditTagsDialog ref="editTagRef"></EditTagsDialog>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import EditTagsDialog from './components/EditTagsDialog.vue'
import { ref } from 'vue'

const editTagRef = ref<InstanceType<typeof EditTagsDialog> | null>(null)
const showTag = () => {
  if (editTagRef.value) {
    editTagRef.value.showDialog()
  }
}
</script>
