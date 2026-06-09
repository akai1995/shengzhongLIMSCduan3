<template>
  <view class="mine-page">
    <view class="page-header">
      <text class="page-title">我的</text>
      
      <view class="user-row">
        <view class="user-avatar">
          <view class="avatar-circle">
            <text class="avatar-text">{{ user.name.charAt(0) }}</text>
          </view>
        </view>
        <view class="user-info">
          <text class="user-name">{{ user.name }}</text>
          <view class="user-subtitle">
            <text class="user-desc">{{ user.department }} · {{ user.position }}</text>
            <text class="user-arrow">›</text>
          </view>
        </view>
      </view>
      
      <view class="info-card">
        <view class="info-left">
          <text class="info-name">{{ user.name }} (本人)</text>
          <text class="info-sub">登记号：2023****20</text>
        </view>
        <view class="info-qr">
          <view class="qr-box">
            <text class="qr-square">▦</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="section-card">
      <text class="section-title">科研记录</text>
      <view class="quick-grid">
        <view class="quick-item" @click="goToProjects">
          <view class="quick-icon icon-primary">
            <text class="quick-icon-text">≡</text>
          </view>
          <text class="quick-label">科研项目</text>
        </view>
        <view class="quick-item" @click="goToExperiments">
          <view class="quick-icon icon-primary">
            <text class="quick-icon-text">✓</text>
          </view>
          <text class="quick-label">实验记录</text>
        </view>
        <view class="quick-item" @click="goToLearning">
          <view class="quick-icon icon-primary">
            <text class="quick-icon-text">≡</text>
          </view>
          <text class="quick-label">学习记录</text>
        </view>
        <view class="quick-item" @click="goToApprovals">
          <view class="quick-icon icon-primary">
            <text class="quick-icon-text">✚</text>
          </view>
          <text class="quick-label">审批记录</text>
        </view>
      </view>
    </view>
    
    <view class="section-card">
      <text class="section-title">科研数据</text>
      <view class="stats-row">
        <view class="stat-block">
          <text class="stat-num">{{ statistics.projects }}</text>
          <text class="stat-label">参与项目</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-block">
          <text class="stat-num">{{ statistics.experiments }}</text>
          <text class="stat-label">实验记录</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-block">
          <text class="stat-num">12</text>
          <text class="stat-label">发表论文</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-block">
          <text class="stat-num">5</text>
          <text class="stat-label">专利申请</text>
        </view>
      </view>
    </view>
    
    <view class="section-card">
      <text class="section-title">服务设置</text>
      <view class="service-grid">
        <view class="service-item" @click="goToMessages">
          <view class="service-icon">
            <text class="service-icon-inner">♡</text>
          </view>
          <text class="service-label">我的关注</text>
        </view>
        <view class="service-item" @click="goToAttendance">
          <view class="service-icon">
            <text class="service-icon-inner">◎</text>
          </view>
          <text class="service-label">考勤打卡</text>
        </view>
        <view class="service-item" @click="goToHelp">
          <view class="service-icon">
            <text class="service-icon-inner">✉</text>
          </view>
          <text class="service-label">意见反馈</text>
        </view>
        <view class="service-item" @click="goToMessages">
          <view class="service-icon">
            <text class="service-icon-inner">☎</text>
          </view>
          <text class="service-label">帮助中心</text>
        </view>
        <view class="service-item" @click="goToSettings">
          <view class="service-icon">
            <text class="service-icon-inner">⏱</text>
          </view>
          <text class="service-label">信用守约</text>
        </view>
        <view class="service-item" @click="goToAbout">
          <view class="service-icon">
            <text class="service-icon-inner">ⓘ</text>
          </view>
          <text class="service-label">关于我们</text>
        </view>
        <view class="service-item" @click="goToSettings">
          <view class="service-icon">
            <text class="service-icon-inner">⬢</text>
          </view>
          <text class="service-label">功能设置</text>
        </view>
      </view>
    </view>
    
    <view class="logout-section">
      <view class="logout-btn" @click="handleLogout">
        <text class="logout-text">退出登录</text>
      </view>
    </view>
    
    <view class="bottom-spacer"></view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const user = computed(() => store.getters.user)
const statistics = computed(() => store.getters.statistics)
const learningCount = ref(2)
const unreadNotifications = ref(3)

const goToMessages = () => {
  uni.navigateTo({ url: '/pages/notifications/list' })
}

const goToLearning = () => {
  uni.navigateTo({ url: '/pages/learning/detail' })
}

const goToAttendance = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToSettings = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToHelp = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToAbout = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToProjects = () => {
  uni.switchTab({ url: '/pages/tabs/research/research' })
}

const goToExperiments = () => {
  uni.switchTab({ url: '/pages/tabs/lab/lab' })
}

const goToApprovals = () => {
  uni.navigateTo({ url: '/pages/approval/quick' })
}

const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '已退出登录',
          icon: 'none',
          duration: 2000
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.mine-page {
  min-height: 100vh;
  background-color: #F7F7F7;
}

.page-header {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  padding: 60rpx 32rpx 32rpx;
  border-radius: 0 0 40rpx 40rpx;
}

.page-title {
  display: block;
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 36rpx;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 28rpx;
}

.user-avatar {
  position: relative;
}

.avatar-circle {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6rpx solid #FFFFFF;
  box-shadow: 0 4rpx 16rpx rgba(23, 125, 220, 0.2);
}

.avatar-text {
  font-size: 52rpx;
  font-weight: 600;
  color: #177DDC;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 38rpx;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 8rpx;
}

.user-subtitle {
  display: flex;
  align-items: center;
}

.user-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
}

.user-arrow {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-left: 8rpx;
}

.info-card {
  background: linear-gradient(135deg, #2E3A59 0%, #3B4A6B 100%);
  border-radius: 16rpx;
  padding: 28rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4rpx 20rpx rgba(46, 58, 89, 0.25);
}

.info-left {
  display: flex;
  flex-direction: column;
}

.info-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 8rpx;
}

.info-sub {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.75);
}

.info-qr {
  display: flex;
  align-items: center;
}

.qr-box {
  width: 72rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
}

.qr-square {
  font-size: 48rpx;
  color: #FFFFFF;
}

.section-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  margin: 20rpx 32rpx;
  padding: 24rpx 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 500;
  color: #000000;
  margin-bottom: 28rpx;
}

.quick-grid {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.quick-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &:active {
    opacity: 0.6;
  }
}

.quick-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.icon-primary {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
}

.quick-icon-text {
  font-size: 40rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.quick-label {
  font-size: 28rpx;
  color: #262626;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  padding: 8rpx 0 12rpx;
}

.stat-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-num {
  font-size: 40rpx;
  font-weight: 700;
  color: #177DDC;
}

.stat-label {
  font-size: 24rpx;
  color: #8C8C8C;
  margin-top: 6rpx;
}

.stat-divider {
  width: 2rpx;
  height: 56rpx;
  background-color: #E5E5E5;
  margin-top: 8rpx;
}

.service-grid {
  display: flex;
  flex-wrap: wrap;
}

.service-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx 0;
  
  &:active {
    opacity: 0.6;
  }
}

.service-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14rpx;
  background: #F0F9FF;
}

.service-icon-inner {
  font-size: 36rpx;
  color: #177DDC;
}

.service-label {
  font-size: 28rpx;
  color: #262626;
}

.logout-section {
  padding: 32rpx 32rpx 20rpx;
}

.logout-btn {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  
  &:active {
    background-color: #FAFAFA;
  }
}

.logout-text {
  font-size: 30rpx;
  color: #F53F3F;
  font-weight: 500;
}

.bottom-spacer {
  height: 20rpx;
}
</style>