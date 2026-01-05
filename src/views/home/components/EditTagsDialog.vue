<template>
  <!-- 打标签弹窗 -->
  <a-modal class="pick-tag-dialog" v-model:open="data.dialogShow" :title="'选择标签'" :destroyOnClose="true" :footer="null"
    :width="'800px'" :centered="true" :maskClosable="false">
    <div class="check-tag-wrapper">
      <div class="tag-left">
        <!-- 左侧标签组 -->
        <div v-for="(group, index) in tagListTemp" class="tag-item" :class="{ on: data.checkedGroupId == group.id }"
          :key="index" @click="clickGroupHandle(group, index)">
          {{ group.name }}
        </div>
      </div>
      <div class="tag-right">
        <!-- 标签 -->
        <div class="tags-content" @mousewheel="handleScroll">
          <div v-for="(group, index) in tagListTemp" :key="index" class="every-group">
            <div class="level1">
              <a-checkbox v-model:checked="group.checked" :indeterminate="group.indeterminate"
                @change="checkGroupHandle(group)">
                <span class="level1-title">{{ group.name }}</span>
              </a-checkbox>
            </div>
            <div class="level2">
              <span v-for="tag in group.children" :key="tag.id" class="level2-tag" :class="{ on: tag.checked }"
                @click="checkLevel2handle(tag, group)">
                {{ tag.name }}
              </span>
            </div>
          </div>
        </div>
        <!-- 已选标签 -->
        <div class="checked-tags">
          <div class="checked-title">已选：</div>
          <div class="checked-content">
            <span class="tag" v-for="(tag, index) in data.checkedTags" :key="index">
              {{ tag.fatherName }}：{{ tag.name }}
              <CloseCircleFilled class="delete-icon" @click="deleteTagHandle(index, tag)" />
            </span>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="btn-group">
          <a-button @click="data.dialogShow = false">取消</a-button>
          <a-button type="primary" style="margin-left: 8px" @click="confirmHandle">保存</a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { CloseCircleFilled } from '@ant-design/icons-vue'

interface Tag {
  id: string
  name: string
  checked: boolean
  indeterminate?: boolean
  fatherName?: string
  children?: Tag[]
}
const tagListTemp = ref([
  {
    id: '1',
    name: '客户阶段',
    checked: false,
    indeterminate: false,
    children: [
      {
        id: '11',
        name: '潜在客户',
        fatherName: '客户阶段',
        checked: false,
      },
      {
        id: '12',
        name: '优质客户',
        fatherName: '客户阶段',
        checked: false,
      },
    ],
  },
  {
    id: '2',
    name: '客户等级',
    checked: false,
    indeterminate: false,
    children: [
      {
        id: '21',
        name: '普通客户',
        fatherName: '客户等级',
        checked: false,
      },
      {
        id: '22',
        name: '白金客户',
        fatherName: '客户等级',
        checked: false,
      },
    ],
  },
  {
    id: '3',
    name: '客户来源',
    checked: false,
    indeterminate: false,
    children: [
      {
        id: '31',
        name: '微信',
        fatherName: '客户来源',
        checked: false,
      },
      {
        id: '32',
        name: '抖音',
        fatherName: '客户来源',
        checked: false,
      },
    ],
  },
  {
    id: '4',
    name: '客户年龄',
    checked: false,
    indeterminate: false,
    children: [
      {
        id: '41',
        name: '18-25岁',
        fatherName: '客户年龄',
        checked: false,
      },
      {
        id: '42',
        name: '26-35岁',
        fatherName: '客户年龄',
        checked: false,
      },
    ],
  },
  {
    id: '5',
    name: '客户段位',
    checked: false,
    indeterminate: false,
    children: [
      {
        id: '51',
        name: '青铜',
        fatherName: '客户段位',
        checked: false,
      },
      {
        id: '52',
        name: '白银',
        fatherName: '客户段位',
        checked: false,
      },
      {
        id: '53',
        name: '黄金',
        fatherName: '客户段位',
        checked: false,
      },
      {
        id: '54',
        name: '铂金',
        fatherName: '客户段位',
        checked: false,
      },
      {
        id: '55',
        name: '钻石',
        fatherName: '客户段位',
        checked: false,
      },
    ],
  },
])
const data = reactive({
  dialogShow: false,
  checkedGroupId: '1',
  checkedTags: [] as Tag[],
})
// 选择左侧标签组
const clickGroupHandle = (item: Tag, index: number) => {
  data.checkedGroupId = item.id
  // 滚动到对应位置
  document.querySelectorAll('.every-group')[index]!.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
// 监听右侧标签内容区滚动
const handleScroll = () => {
  const groups = document.querySelectorAll('.every-group')
  // 整个盒子的滚动高度
  const scrollTop = document.querySelector('.tags-content')!.scrollTop
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i] as HTMLElement
    // 滚动高度大于等于某个组的顶部位置时，设置该组为选中状态
    // 减78是因为第一个组的offsetTop是相对于整个内容区的，而内容区有padding-top:24px，加上标题栏的高度54px，共78px
    if (group!.offsetTop - 78 <= scrollTop + 10) {
      data.checkedGroupId = tagListTemp.value[i]!.id
    }
  }
}
// 选择标签组全选/取消全选
const checkGroupHandle = (group: Tag) => {
  if (group.indeterminate) {
    group.indeterminate = false
    group.checked = false
  }
  if (group.checked) {
    // 全选
    for (const tag of group.children!) {
      tag.checked = true
      if (data.checkedTags.length >= 10) {
        message.warning('最多可以选择10个标签')
        tag.checked = false
        group.checked = false
        // 判断当前组全选或者半选
        setGroupIndeterminate(group)
        return
      }
      const index = data.checkedTags.findIndex((t) => t.id === tag.id)
      if (index === -1) {
        data.checkedTags.push(tag)
      }
    }
  } else {
    // 取消全选
    group.children!.forEach((tag) => {
      tag.checked = false
      const index = data.checkedTags.findIndex((t) => t.id === tag.id)
      if (index > -1) {
        data.checkedTags.splice(index, 1)
      }
    })
  }
}
// 选择/取消选择二级标签
const checkLevel2handle = (tag: Tag, group: Tag) => {
  tag.checked = !tag.checked
  if (tag.checked) {
    if (data.checkedTags.length >= 10) {
      message.warning('最多可以选择10个标签')
      tag.checked = false
      return
    }
    data.checkedTags.push(tag)
  } else {
    const index = data.checkedTags.findIndex((item) => item.id === tag.id)
    if (index > -1) {
      data.checkedTags.splice(index, 1)
    }
  }
  // 判断当前组全选或者半选
  setGroupIndeterminate(group)
}
// 删除已选标签
const deleteTagHandle = (index: number, tag: Tag) => {
  data.checkedTags.splice(index, 1)
  tag.checked = false
  // 先找到它的标签组
  const group = tagListTemp.value.find((item) => item.name == tag.fatherName)
  if (!group) {
    return
  }
  // 判断当前组全选或者半选
  setGroupIndeterminate(group)
}
// 设置组的半选
const setGroupIndeterminate = (group: Tag) => {
  const checkedNum = group.children!.map((item) => item.checked).filter((item) => item).length
  const allChecked = checkedNum === group.children!.length
  group.checked = allChecked
  group.indeterminate = !allChecked && checkedNum > 0
}
const emit = defineEmits(['ok'])
const confirmHandle = () => {
  emit('ok')
}
defineExpose({
  showDialog: () => {
    data.dialogShow = true
  },
})
</script>

<style lang="less">
.pick-tag-dialog {
  .ant-modal-content {
    padding: 0;
    .ant-modal-header {
      padding-top: 16px;
      padding-left: 40px;
      padding-bottom: 15px;
      margin-bottom: 0px !important;
      border-bottom: 1px solid #e4e6f4;
    }
    .check-tag-wrapper {
      display: flex;
      .tag-left {
        width: 160px;
        height: 500px;
        padding-top: 20px;
        border-right: 1px solid #e4e6f4;
        .tag-item {
          position: relative;
          height: 40px;
          line-height: 40px;
          padding-left: 40px;
          cursor: pointer;
          &.on {
            background: #e7ebf5;
            color: #1890ff;
            &::before {
              content: '';
              width: 2px;
              height: 24px;
              background: #1890ff;
              position: absolute;
              right: 0;
              top: 10px;
            }
          }
        }
      }
      .tag-right {
        flex: 1;
        height: 500px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        .tags-content {
          flex: 1;
          overflow-y: auto;
          .level1 {
            margin-bottom: 16px;
            .level1-title {
              font-weight: 600;
              font-size: 14px;
              color: #343434;
            }
          }
          .level2 {
            margin-bottom: 20px;
            .level2-tag {
              display: inline-block;
              padding: 4px 12px;
              margin-right: 12px;
              margin-bottom: 12px;
              border-radius: 13px;
              box-sizing: border-box;
              background: #f5f7fa;
              border: 1px solid #f5f7fa;
              color: #666;
              font-size: 13px;
              line-height: 19px;
              cursor: pointer;
              &.on {
                background: #f3f8ff;
                color: #1890ff;
                border: 1px solid #1890ff;
              }
            }
          }
        }
        .checked-tags {
          min-height: 100px;
          padding: 16px;
          box-sizing: border-box;
          border: 1px solid #dee0e9;
          background: #f3f4f6;
          border-radius: 7px;
          display: flex;
          .checked-title {
            font-size: 14px;
            color: #343434;
            line-height: 20px;
          }
          .checked-content {
            flex: 1;
            .tag {
              position: relative;
              display: inline-block;
              padding: 4px 12px;
              margin-right: 12px;
              margin-bottom: 12px;
              border-radius: 13px;
              background: #fff;
              color: #343434;
              font-size: 13px;
              line-height: 19px;
              .delete-icon {
                position: absolute;
                top: -6px;
                right: -6px;
                font-size: 16px;
                cursor: pointer;
                color: #acacac;
              }
            }
          }
        }
        .btn-group {
          margin-top: 20px;
          text-align: right;
        }
      }
    }
  }
}
</style>
