<template>
  <div class="home-page">
    <a-card>
      <div>
        2025年10月份做了一个可插入变量的文本框 <a-button type="link" @click="toVariablePage">查看示例</a-button>
      </div>
      <div>
        2025年12月做了一个打标签的功能
        <a-button @click="showTag" type="primary">打标签</a-button>
        <EditTagsDialog ref="editTagRef"></EditTagsDialog>
      </div>

    </a-card>
  </div>
</template>
<script setup lang="ts">
import EditTagsDialog from './components/EditTagsDialog.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const toVariablePage = () => {
  router.push({ path: '/variableTextArea' })
}
const editTagRef = ref<InstanceType<typeof EditTagsDialog> | null>(null)
const showTag = () => {
  if (editTagRef.value) {
    editTagRef.value.showDialog()
  }
}
</script>
