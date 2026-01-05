<template>
  <div class="variable-textarea-container">
    <!-- 可编辑区域 -->
    <div ref="editableDiv" class="editable-div" contenteditable="true" @input="handleInput" @paste="handlePaste"
      @keydown="handleKeydown" @blur="handleBlur" @focus="handleFocus"></div>

    <!-- 隐藏的文本域，用于表单提交 -->
    <a-textarea v-model:value="internalValue" style="display: none" />

    <!-- 变量选择器 -->
    <div class="variable-selector">
      <span class="selector-label">插入变量：</span>
      <a-button v-for="variable in availableVariables" :key="variable.name" size="small"
        style="margin-right: 8px; margin-bottom: 4px" :disabled="internalValue.includes(variable.name)"
        @click="insertVariable(variable)">
        {{ variable.label }}
      </a-button>
      <div class="tip">{{ countInputValue.length }}/50</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'

interface Variable {
  name: string
  label: string
}
// 传入属性
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  // 可用的变量列表
  availableVariables: {
    type: Array<Variable>,
    default: () => [],
  },
})

// 事件定义
const emit = defineEmits(['change', 'focus', 'blur'])

// 响应式数据
const editableDiv = ref<HTMLDivElement | null>(null) // 可编辑的div元素引用
const internalValue = ref(props.modelValue) // 内部存储的文本值
const isFocused = ref(false) // 是否聚焦状态
const countInputValue = ref('') // 计算纯文本长度

onMounted(() => {
  // 初始化时设置可编辑div的innerHTML
  updateDivContent()
})
// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== internalValue.value) {
      internalValue.value = newVal
      // updateDivContent();
    }
  }
)
watch(
  () => props.availableVariables.length,
  (value) => {
    if (value > 0) {
      updateDivContent()
    }
  }
)

// 监听内部值变化
watch(internalValue, (newVal) => {
  emit('change', newVal)
  countInputValue.value = internalValue.value.replace(/\{([^}]+)\}/g, '')
})

// 将纯文本转换为带变量标签的HTML
const parseContentToHTML = (text: string) => {
  if (!text) return ''

  // 匹配 {variable} 格式的变量
  const regex = /\{([^}]+)\}/g
  return text.replace(regex, (match, variableName) => {
    const variable = props.availableVariables.find((v) => v.name === match)
    const label = variable ? variable.label : variableName
    return `<span class="variable-tag" contenteditable="false" data-variable="${match}">${label}</span>`
  })
}

// 将HTML内容转换为纯文本
const parseHTMLToText = (html: string) => {
  if (!html) return ''

  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // 遍历所有变量标签，恢复为 {variable} 格式
  const variableTags = tempDiv.querySelectorAll('.variable-tag')
  variableTags.forEach((tag) => {
    const variableName = tag.getAttribute('data-variable')
    tag.replaceWith(`${variableName}`)
  })

  return tempDiv.textContent || tempDiv.innerText || ''
}

// 更新可编辑div的内容
const updateDivContent = () => {
  if (editableDiv.value) {
    editableDiv.value.innerHTML = parseContentToHTML(internalValue.value)
  }
}

// 处理输入事件
const handleInput = (event: any) => {
  const html = event.target.innerHTML
  internalValue.value = parseHTMLToText(html)
}

// 处理粘贴事件（只保留纯文本）
const handlePaste = (event: any) => {
  event.preventDefault()
  const text = event.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
}

// 处理按键事件
const handleKeydown = (event: any) => {
  // 退格键或删除键处理
  if (event.key === 'Backspace' || event.key === 'Delete') {
    handleDeleteKey(event)
  }
}

// 处理删除键逻辑
const handleDeleteKey = (event: any) => {
  const selection = window.getSelection()
  if (!selection!.rangeCount) return

  const range = selection!.getRangeAt(0)
  const startContainer = range.startContainer

  // 如果光标在变量标签后面，删除整个变量标签
  if (startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
    const previousSibling = startContainer.previousSibling
    if (
      previousSibling &&
      previousSibling.nodeType === Node.ELEMENT_NODE &&
      (previousSibling as Element).classList.contains('variable-tag')
    ) {
      event.preventDefault()
      previousSibling.remove()
      handleInput({ target: editableDiv.value })
    }
  }
}

// 处理焦点事件
const handleFocus = (event: any) => {
  isFocused.value = true
  emit('focus', event)
}

// 处理失焦事件
const handleBlur = (event: any) => {
  isFocused.value = false
  emit('blur', event)
}

// 插入变量
const insertVariable = async (variable: Variable) => {
  if (!editableDiv.value) return

  // 确保可编辑区域有焦点
  if (!isFocused.value) {
    editableDiv.value.focus()
    await nextTick()
  }

  const variableHTML = `<span class="variable-tag" contenteditable="false" data-variable="${variable.name}">${variable.label}</span>`

  // 获取当前选区
  const selection = window.getSelection()

  if (selection!.rangeCount > 0) {
    const range = selection!.getRangeAt(0)

    // 检查选区是否在可编辑区域内
    if (!editableDiv.value.contains(range.commonAncestorContainer)) {
      // 如果不在，将光标移到末尾
      range.selectNodeContents(editableDiv.value)
      range.collapse(false)
    }

    // 删除选区内容（如果有）
    range.deleteContents()

    // 创建变量节点并插入
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = variableHTML
    const variableNode = tempDiv.firstChild

    range.insertNode(variableNode!)

    // 将光标移动到变量后面
    const newRange = document.createRange()
    newRange.setStartAfter(variableNode!)
    newRange.setEndAfter(variableNode!)
    selection!.removeAllRanges()
    selection!.addRange(newRange)
  } else {
    // 如果没有选区，则追加到末尾
    editableDiv.value.innerHTML += variableHTML
  }

  // 触发input事件同步数据
  handleInput({ target: editableDiv.value })

  // 重新聚焦到可编辑区域
  editableDiv.value.focus()
}

// 提供方法给父组件调用
defineExpose({
  insertVariable,
  focus: () => {
    if (editableDiv.value) {
      editableDiv.value.focus()
    }
  },
})
</script>

<style scoped>
.variable-textarea-container {
  border: 1px solid #dee0e9;
  border-radius: 6px;
  background-color: #fff;
  transition: all 0.3s;
}

.variable-textarea-container:focus-within {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.editable-div {
  min-height: 100px;
  max-height: 300px;
  padding: 8px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 2.5;
  font-family: inherit;
  font-size: 14px;
}

.editable-div:empty:before {
  content: attr(placeholder);
  color: #bfbfbf;
}

.variable-selector {
  padding: 8px 12px 4px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  position: relative;
}
.variable-selector .tip {
  position: absolute;
  right: 2px;
  top: 2px;
  font-size: 12px;
  color: #999;
}

.selector-label {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
}

/* 变量标签样式 */
:deep(.variable-tag) {
  display: inline-block;
  padding: 2px 8px;
  margin: 0 2px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #1890ff;
  font-size: 12px;
  line-height: 1.5;
  user-select: none;
  cursor: default;
  vertical-align: middle;
}
</style>
