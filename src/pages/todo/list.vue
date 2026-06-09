<template>
  <view class="todo-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">{{ pageTitle }}</text>
      <view class="header-right"></view>
    </view>
    
    <view class="content-wrapper">
      <view class="todo-list">
        <view 
          v-for="item in todoItems" 
          :key="item.id" 
          class="todo-item"
          @click="viewDetail(item)"
        >
          <view class="item-icon" :class="'icon-' + (item.type || item.level)">
            <text class="icon-text">{{ getIconText(item.type || item.level) }}</text>
          </view>
          <view class="item-content">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-desc">{{ item.description }}</text>
            <view class="item-meta">
              <text v-if="item.applicant" class="item-applicant">{{ item.applicant }}</text>
              <text v-if="item.department" class="item-department">{{ item.department }}</text>
              <text class="item-time">{{ item.time || item.deadline }}</text>
            </view>
            <view v-if="item.progress !== undefined" class="item-progress">
              <view class="progress-bar">
                <view class="progress-fill" :style="{ width: item.progress + '%' }"></view>
              </view>
              <text class="progress-text">{{ item.progress }}%</text>
            </view>
            <view v-if="todoType === 'learning'" class="item-action">
              <view class="action-btn" @click.stop="handleLearning(item)">
                <text>{{ item.progress > 0 ? '继续学习' : '开始学习' }}</text>
              </view>
            </view>
          </view>
          <view class="item-arrow">›</view>
        </view>
        
        <view v-if="todoItems.length === 0" class="empty-state">
          <text class="empty-text">暂无待办事项</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      todoType: 'approval'
    }
  },
  computed: {
    ...mapGetters(['approvals', 'warnings', 'learnings']),
    pageTitle() {
      const titles = {
        approval: '待审批',
        warning: '待处理预警',
        learning: '待学习/考试'
      }
      return titles[this.todoType] || '待办事项'
    },
    todoItems() {
      if (this.todoType === 'approval') {
        return this.approvals
      } else if (this.todoType === 'warning') {
        return this.warnings
      } else if (this.todoType === 'learning') {
        return this.learnings
      }
      return []
    }
  },
  onLoad(options) {
    const type = options.type || 'approval'
    this.$nextTick(() => {
      this.todoType = type
    })
  },
  methods: {
    getIconText(type) {
      const icons = {
        approval: '批',
        warning: '警',
        learning: '学',
        equipment: '设',
        supply: '耗',
        reservation: '约',
        hazardous: '危',
        project: '项',
        danger: '危',
        normal: '警'
      }
      return icons[type] || '待'
    },
    goBack() {
      const pages = getCurrentPages()
      if (pages.length <= 1) {
        uni.switchTab({
          url: '/pages/tabs/workbench/workbench'
        })
      } else {
        uni.navigateBack()
      }
    },
    viewDetail(item) {
      if (this.todoType === 'warning') {
        uni.navigateTo({
          url: `/pages/todo/warning-detail?id=${item.id}`
        })
      } else if (this.todoType === 'learning') {
        this.handleLearning(item)
      } else {
        uni.navigateTo({
          url: `/pages/todo/detail?id=${item.id}`
        })
      }
    },
    handleLearning(item) {
      uni.navigateTo({
        url: `/pages/learning/detail?id=${item.id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.todo-page {
  min-height: 100vh;
  background-color: #F7F7F7;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  height: 44px;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
}

.header-left {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 48rpx;
  color: #FFFFFF;
  font-weight: 600;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
}

.header-right {
  width: 60rpx;
}

.content-wrapper {
  padding-top: 56px;
  padding-bottom: 24px;
  padding-left: 24rpx;
  padding-right: 24rpx;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  
  &:active {
    background-color: #FAFAFA;
  }
}

.item-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-approval, .icon-equipment, .icon-supply, .icon-reservation, .icon-hazardous, .icon-project {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
}

.icon-warning, .icon-normal {
  background: linear-gradient(135deg, #D89614 0%, #F0B838 100%);
}

.icon-learning {
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
}

.icon-danger {
  background: linear-gradient(135deg, #F53F3F 0%, #FF6B6B 100%);
}

.icon-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.item-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #000000;
}

.item-desc {
  font-size: 14px;
  color: #8C8C8C;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 4rpx;
}

.item-applicant, .item-department, .item-time {
  font-size: 12px;
  color: #B2B2B2;
}

.item-progress {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 8rpx;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: #E5E5E5;
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
  border-radius: 4rpx;
  transition: width 0.3s;
}

.progress-text {
  font-size: 14px;
  color: #49AA19;
}

.item-action {
  margin-top: 8rpx;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 24rpx;
  background-color: #E8F5E9;
  border-radius: 4px;
  font-size: 24rpx;
  color: #49AA19;
  
  &:active {
    background-color: #D8EAD9;
  }
}

.item-arrow {
  font-size: 32rpx;
  color: #B2B2B2;
  margin-top: 8rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #8C8C8C;
}
</style>