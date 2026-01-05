<template>
  <div class="demo-container">
    <h3>带变量的文本框示例</h3>

    <div class="form-item">
      <label>消息模板：</label>
      <VariableTextarea v-model:modelValue="messageTemplate" :available-variables="variables" @change="handleChange"
        @focus="handleFocus" @blur="handleBlur" />
    </div>

    <div class="preview">
      <h4>预览效果：</h4>
      <div class="preview-content">{{ parsedMessage }}</div>
    </div>

    <div class="current-value">
      <h4>当前值（纯文本）：</h4>
      <pre>{{ messageTemplate }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VariableTextarea from './components/VariableTextarea.vue'

// 响应式数据
const messageTemplate = ref('亲爱的{用户名}，您的订单{订单号}已于{日期}发货。')

// 可用变量列表
const variables = ref([
  { name: '{用户名}', label: '用户名' },
  { name: '{订单号}', label: '订单号' },
  { name: '{日期}', label: '日期' },
  { name: '{金额}', label: '金额' },
  { name: '{地址}', label: '地址' },
])

// 解析消息模板（模拟真实数据）
const parsedMessage = computed(() => {
  return messageTemplate.value
    .replace('{用户名}', '张三')
    .replace('{订单号}', 'ORD2023123456')
    .replace('{日期}', '2023-12-20')
    .replace('{金额}', '¥258.00')
    .replace('{地址}', '北京市朝阳区')
})

// 事件处理
const handleChange = (value: any) => {
  console.log('内容变化:', value)
  messageTemplate.value = value
}

const handleFocus = (event: any) => {
  console.log('获得焦点', event)
}

const handleBlur = (event: any) => {
  console.log('失去焦点', event)
}
</script>

<style scoped>
.demo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.preview,
.current-value {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background-color: #fafafa;
}

.preview-content {
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  min-height: 40px;
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
