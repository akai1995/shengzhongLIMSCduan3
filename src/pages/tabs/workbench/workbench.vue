<template>
  <view class="workbench-page">
    <view class="page-header">
      <view class="header-content">
        <view class="greeting">
          <text class="greeting-text">您好，{{ user.name }}</text>
          <text class="greeting-subtitle">{{ user.department }} · {{ user.position }}</text>
        </view>
        <view class="user-avatar">
          <view class="avatar-circle">
            <text class="avatar-text">{{ user.name.charAt(0) }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="todo-cards">
      <view class="todo-card" @click="goToTodo">
        <view class="todo-info">
          <text class="todo-count">{{ todoCount }}</text>
          <text class="todo-label">待审批</text>
        </view>
      </view>
      <view class="todo-card" @click="goToWarning">
        <view class="todo-info">
          <text class="todo-count">3</text>
          <text class="todo-label">待处理预警</text>
        </view>
      </view>
      <view class="todo-card" @click="goToLearning">
        <view class="todo-info">
          <text class="todo-count">2</text>
          <text class="todo-label">待学习/考试</text>
        </view>
      </view>
    </view>
    
    <view class="card">
      <view class="card-header">
        <text class="card-title">数据统计</text>
      </view>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ statistics.devices }}</text>
          <text class="stat-label">设备总数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ statistics.supplies }}</text>
          <text class="stat-label">耗材种类</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ statistics.projects }}</text>
          <text class="stat-label">科研项目</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ statistics.experiments }}</text>
          <text class="stat-label">实验记录</text>
        </view>
      </view>
    </view>
    
    <view class="card card-quick-entry">
      <view class="card-header">
        <text class="card-title">快捷入口</text>
      </view>
      <view class="quick-actions">
        <view class="action-item" @click="quickAction('scan')">
          <view class="action-icon action-icon-scan">
            <text class="icon-text">扫</text>
          </view>
          <text class="action-label">扫码入库</text>
        </view>
        <view class="action-item" @click="quickAction('project')">
          <view class="action-icon action-icon-project">
            <text class="icon-text">项</text>
          </view>
          <text class="action-label">新建项目</text>
        </view>
        <view class="action-item" @click="quickAction('approval')">
          <view class="action-icon action-icon-approval2">
            <text class="icon-text">批</text>
          </view>
          <text class="action-label">快速审批</text>
        </view>
        <view class="action-item" @click="quickAction('device')">
          <view class="action-icon action-icon-device">
            <text class="icon-text">设</text>
          </view>
          <text class="action-label">设备预约</text>
        </view>
        <view class="action-item" @click="quickAction('supply')">
          <view class="action-icon action-icon-supply">
            <text class="icon-text">领</text>
          </view>
          <text class="action-label">领取耗材</text>
        </view>
        <view class="action-item" @click="quickAction('ai')">
          <view class="action-icon action-icon-ai">
            <text class="icon-text">AI</text>
          </view>
          <text class="action-label">AI生成记录</text>
        </view>
      </view>
    </view>
    
    <view class="card card-notification">
      <view class="card-header">
        <text class="card-title">动态消息</text>
        <text class="card-more" @click="goToNotifications">查看全部 →</text>
      </view>
      <view class="notification-list">
        <view 
          v-for="notification in notifications.slice(0, 5)" 
          :key="notification.id" 
          class="notification-item"
          @click="handleNotificationClick(notification)"
        >
          <view :class="['notification-icon', getNotificationIconClass(notification.type)]"></view>
          <view class="notification-content">
            <view class="notification-title-row">
              <text class="notification-title">{{ notification.title }}</text>
              <text v-if="!notification.read" class="notification-dot"></text>
              <text v-if="notification.priority === 'high'" class="priority-badge">紧急</text>
            </view>
            <text class="notification-text">{{ notification.content }}</text>
            <text class="notification-time">{{ notification.time }}</text>
          </view>
        </view>
      </view>
    </view>
    
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const user = computed(() => store.getters.user)
const todoCount = computed(() => store.getters.todoCount)
const statistics = computed(() => store.getters.statistics)
const notifications = computed(() => store.getters.notifications)

const goToTodo = () => {
  try {
    uni.navigateTo({ 
      url: '/pages/todo/list?type=approval',
      fail: (err) => {
        console.error('navigateTo todo error:', err)
        uni.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  } catch (e) {
    console.error('goToTodo error:', e)
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

const goToWarning = () => {
  try {
    uni.navigateTo({ 
      url: '/pages/todo/list?type=warning',
      fail: (err) => {
        console.error('navigateTo warning error:', err)
        uni.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  } catch (e) {
    console.error('goToWarning error:', e)
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

const goToLearning = () => {
  try {
    uni.navigateTo({ 
      url: '/pages/todo/list?type=learning',
      fail: (err) => {
        console.error('navigateTo learning error:', err)
        uni.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  } catch (e) {
    console.error('goToLearning error:', e)
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

const goToNotifications = () => {
  try {
    uni.navigateTo({ 
      url: '/pages/notifications/list',
      fail: (err) => {
        console.error('navigateTo notifications error:', err)
        uni.showToast({ title: '页面开发中', icon: 'none' })
      }
    })
  } catch (e) {
    console.error('goToNotifications error:', e)
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

const quickAction = (type) => {
  const actions = {
    scan: { url: '/pages/scan/index', title: '扫码入库' },
    project: { url: '/pages/project/create', title: '新建项目' },
    approval: { url: '/pages/approval/quick', title: '快速审批' },
    device: { url: '/pages/device/reserve', title: '设备预约' },
    supply: { url: '/pages/supply/receive', title: '领取耗材' },
    ai: { url: '/pages/ai/generate', title: 'AI生成记录' }
  }
  
  const action = actions[type]
  if (!action) {
    uni.showToast({ title: '功能暂未开放', icon: 'none' })
    return
  }
  
  if (action.implemented === false) {
    uni.showToast({ title: `${action.title}功能开发中`, icon: 'none' })
    return
  }
  
  try {
    uni.navigateTo({ 
      url: action.url,
      fail: (err) => {
        console.error('navigateTo error:', err)
        uni.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  } catch (e) {
    console.error('quickAction error:', e)
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
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

const handleNotificationClick = (notification) => {
  switch (notification.type) {
    case 'warning':
      goToWarning()
      break
    case 'approval':
      if (notification.content.includes('待处理')) {
        goToTodo()
      } else {
        uni.showToast({ title: notification.content, icon: 'none', duration: 2000 })
      }
      break
    case 'supply':
      quickAction('supply')
      break
    case 'device':
      quickAction('device')
      break
    case 'learning':
      goToLearning()
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

const viewNotification = (notification) => {
  uni.showToast({
    title: notification.title,
    icon: 'none',
    duration: 2000
  })
}
</script>

<style lang="scss" scoped>
.workbench-page {
  min-height: 100vh;
  background-color: #F7F7F7;
  padding-bottom: 24rpx;
  padding-top: 164rpx;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 90px;
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  padding-top: 32rpx;
  padding-bottom: 32rpx;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 0 0 40rpx 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(23, 125, 220, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.greeting {
  display: flex;
  flex-direction: column;
}

.greeting-text {
  font-size: 40rpx;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 8rpx;
}

.greeting-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
}

.user-avatar {
  position: relative;
}

.avatar-circle {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.avatar-text {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.todo-cards {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  margin-top: 4rpx;
}

.todo-card {
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 24rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.todo-card:nth-child(3) {
  box-shadow: none;
}

.todo-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.todo-icon-approval {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
}

.todo-icon-warning {
  background: linear-gradient(135deg, #D89614 0%, #F0B838 100%);
}

.todo-icon-learning {
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
}

.icon-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.todo-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.todo-count {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
}

.todo-label {
  font-size: 14px;
  color: #8C8C8C;
  margin-top: 4rpx;
}

.todo-arrow {
  font-size: 28rpx;
  color: #B2B2B2;
}

.card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  margin: 0 24rpx 24rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-quick-entry {
  padding: 32rpx;
}

.card-notification {
  padding: 32rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

.card-more {
  font-size: 26rpx;
  color: #177DDC;
}

.stats-grid {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #177DDC;
  display: block;
}

.stat-label {
  font-size: 14px;
  color: #8C8C8C;
  margin-top: 12rpx;
  display: block;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.action-item {
  width: calc(33.33% - 8rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.action-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.action-icon-scan {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
}

.action-icon-project {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
}

.action-icon-approval2 {
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
}

.action-icon-device {
  background: linear-gradient(135deg, #F093FB 0%, #F5576C 100%);
}

.action-icon-supply {
  background: linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%);
}

.action-icon-ai {
  background: linear-gradient(135deg, #43E97B 0%, #38F9D7 100%);
}

.action-label {
  font-size: 28rpx;
  color: #595959;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.notification-item {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  background-color: #FAFAFA;
  border-radius: 16rpx;
}

.notification-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
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
  gap: 4rpx;
}

.notification-title-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}

.notification-dot {
  width: 12rpx;
  height: 12rpx;
  background-color: #F53F3F;
  border-radius: 50%;
}

.priority-badge {
  font-size: 20rpx;
  color: #FFFFFF;
  background-color: #F53F3F;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  margin-left: 8rpx;
}

.notification-text {
  font-size: 14px;
  color: #595959;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.notification-time {
  font-size: 12px;
  color: #B2B2B2;
  margin-top: 4rpx;
}
</style>