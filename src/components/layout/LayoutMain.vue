<template>
  <a-layout>
    <!-- 左侧菜单 -->
    <a-layout-sider theme="light" breakpoint="lg" collapsed-width="0" v-model:collapsed="data.collapsed" collapsible>
      <a-menu :items="items" mode="inline" v-model:selectedKeys="data.selectedKeys" v-model:openKeys="data.openKeys"
        @click="gotoPage">
      </a-menu>
    </a-layout-sider>
    <!-- 右侧内容 -->
    <a-layout-content>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>
<script setup lang="ts">
import { reactive, h, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HomeOutlined, BlockOutlined, SettingOutlined } from '@ant-design/icons-vue'
import type { ItemType } from 'ant-design-vue'
type Key = string | number
const data = reactive({
  collapsed: false,
  selectedKeys: ['/home'],
  openKeys: [] as Key[],
})

const items: ItemType[] = reactive([
  { label: '首页', key: '/home', icon: () => h(HomeOutlined), path: '/home' },
  {
    label: '典型页面',
    key: 'pages',
    icon: () => h(BlockOutlined),
    children: [{ label: '关于', key: '/about', path: '/about' }],
  },
])
const router = useRouter()
// 点击跳转页面
const gotoPage = (e: any) => {
  router.push(e.item.path)
}
// 获取父级key
const getParentKey = (key: string) => {
  for (const item of items) {
    if (item && 'children' in item && item.children) {
      for (const child of item.children) {
        if (child && child.key === key) {
          return [item.key!]
        }
      }
    }
  }
  return []
}
const route = useRoute()
// 监听路由选中及展开菜单
watch(
  () => route,
  (newVal) => {
    data.selectedKeys = [newVal.path]
    data.openKeys = getParentKey(newVal.path)
  },
  { immediate: true }
)
</script>
<style scoped lang="less">
.ant-layout {
  height: 100vh;
  .ant-layout-content {
    padding: 16px;
  }
}
</style>
