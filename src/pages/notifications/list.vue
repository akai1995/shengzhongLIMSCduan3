<template>
  <view class="notifications-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">消息通知</text>
      <view class="header-right">
        <text class="mark-all-btn" @click="markAllRead">全部已读</text>
      </view>
    </view>
    
    <view class="filter-bar">
      <scroll-view scroll-x class="filter-scroll">
        <view class="filter-items">
          <view 
            v-for="filter in filters" 
            :key="filter.key"
            :class="['filter-item', { active: currentFilter === filter.key }]"
            @click="currentFilter = filter.key"
          >
            <text class="filter-text">{{ filter.label }}</text>
            <view v-if="getUnreadCount(filter.key) > 0" class="filter-badge">{{ getUnreadCount(filter.key) }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <scroll-view class="content-wrapper" scroll-y>
      <view v-if="filteredNotifications.length > 0" class="notification-list">
        <view 
          v-for="notification in filteredNotifications" 
          :key="notification.id" 
          :class="['notification-item', { read: notification.read }]"
          @click="handleNotificationClick(notification)"
        >
          <view :class="['notification-icon', getNotificationIconClass(notification.type)]"></view>
          <view class="notification-content">
            <view class="notification-title-row">
              <text class="notification-title">{{ notification.title }}</text>
              <text v-if="notification.priority === 'high'" class="priority-badge">紧急</text>
            </view>
            <text class="notification-text">{{ notification.content }}</text>
            <text class="notification-time">{{ notification.time }}</text>
          </view>
          <view v-if="!notification.read" class="unread-indicator"></view>
        </view>
      </view>
      
      <view v-else class="empty-state">
        <text class="empty-icon">🔔</text>
        <text class="empty-text">暂无{{ currentFilter === 'all' ? '' : getFilterLabel(currentFilter) }}消息</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const filters = [
  { key: 'all', label: '全部' },
  { key: 'system', label: '系统通知' },
  { key: 'warning', label: '预警提醒' },
  { key: 'approval', label: '审批消息' },
  { key: 'supply', label: '耗材通知' },
  { key: 'device', label: '设备消息' },
  { key: 'learning', label: '学习通知' }
]

const currentFilter = ref('all')

const notifications = computed(() => store.getters.notifications)

const filteredNotifications = computed(() => {
  if (currentFilter.value === 'all') {
    return notifications.value
  }
  return notifications.value.filter(n => n.type === currentFilter.value)
})

const getUnreadCount = (type) => {
  if (type === 'all') {
    return notifications.value.filter(n => !n.read).length
  }
  return notifications.value.filter(n => n.type === type && !n.read).length
}

const getNotificationIconClass = (type) => {
  const iconMap = {
    system: 'icon-system',
    warning: 'icon-warning',
    approval: 'icon-approval',
    supply: 'icon-supply',
    device: 'icon-device',
    learning: 'icon-learning',
    experiment: 'icon-experiment',
    project: 'icon-project'
  }
  return iconMap[type] || 'icon-system'
}

const getFilterLabel = (key) => {
  const filter = filters.find(f => f.key === key)
  return filter?.label || ''
}

const goBack = () => {
  uni.navigateBack()
}

const markAllRead = () => {
  uni.showToast({ title: '已全部标记为已读', icon: 'success', duration: 1500 })
}

const handleNotificationClick = (notification) => {
  switch (notification.type) {
    case 'warning':
      uni.navigateTo({ url: '/pages/todo/list?type=warning' })
      break
    case 'approval':
      if (notification.content.includes('待处理')) {
        uni.navigateTo({ url: '/pages/todo/list?type=approval' })
      } else {
        uni.showToast({ title: notification.content, icon: 'none', duration: 2000 })
      }
      break
    case 'supply':
      uni.navigateTo({ url: '/pages/supply/receive' })
      break
    case 'device':
      uni.navigateTo({ url: '/pages/device/reserve' })
      break
    case 'learning':
      uni.navigateTo({ url: '/pages/todo/list?type=learning' })
      break
    case 'experiment':
      uni.showToast({ title: '请前往实验室查看实验记录', icon: 'none', duration: 2000 })
      break
    case 'project':
      uni.showToast({ title: notification.content, icon: 'none', duration: 2000 })
      break
    default:
      uni.showToast({ title: notification.content, icon: 'none', duration: 2000 })
  }
}
</script>

<style lang="scss" scoped>
.notifications-page {
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
  width: 100rpx;
}

.mark-all-btn {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
}

.filter-bar {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: #FFFFFF;
  padding: 16rpx 0;
  border-bottom: none !important;
  box-shadow: none !important;
}

.filter-scroll {
  white-space: nowrap;
  border-bottom: none !important;
}

.filter-items {
  display: inline-flex;
  gap: 16rpx;
  padding: 0 24rpx;
  border-bottom: none !important;
}

.filter-bar::after {
  display: none !important;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 28rpx;
  background-color: #FAFAFA;
  border-radius: 24rpx;
  flex-shrink: 0;
  border-bottom: none;
  
  &.active {
    background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
    
    .filter-text {
      color: #FFFFFF;
      font-weight: 600;
    }
    
    .filter-badge {
      background-color: rgba(255, 255, 255, 0.3);
      color: #FFFFFF;
    }
  }
}

.filter-text {
  font-size: 15px;
  color: #595959;
}

.filter-badge {
  min-width: 32rpx;
  height: 32rpx;
  background-color: #F53F3F;
  color: #FFFFFF;
  font-size: 20rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}

.content-wrapper {
  padding-top: 92px;
  padding-bottom: 24rpx;
  height: calc(100vh - 92px);
}

.notification-list {
  padding: 24rpx;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  
  &.read {
    opacity: 0.7;
  }
}

.notification-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  flex-shrink: 0;
}

.icon-system {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
}

.icon-warning {
  background: linear-gradient(135deg, #D89614 0%, #F0B838 100%);
}

.icon-approval {
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
}

.icon-supply {
  background: linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%);
}

.icon-device {
  background: linear-gradient(135deg, #F093FB 0%, #F5576C 100%);
}

.icon-learning {
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
}

.icon-experiment {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
}

.icon-project {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
}

.notification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.notification-title-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.notification-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #000000;
}

.priority-badge {
  font-size: 22rpx;
  color: #FFFFFF;
  background-color: #F53F3F;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.notification-text {
  font-size: 26rpx;
  color: #595959;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.notification-time {
  font-size: 24rpx;
  color: #B2B2B2;
}

.unread-indicator {
  width: 12rpx;
  height: 12rpx;
  background-color: #F53F3F;
  border-radius: 50%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #B2B2B2;
}
</style>