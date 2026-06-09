<template>
  <view class="project-detail-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">项目进度</text>
      <view class="header-right"></view>
    </view>
    
    <scroll-view class="content-wrapper" scroll-y>
      <view v-if="project" class="project-content">
        <view class="project-info-card">
          <view class="project-header">
            <text class="project-name">{{ project.name }}</text>
            <view :class="['status-tag', getStatusClass(project.status)]">
              {{ project.status }}
            </view>
          </view>
          <text class="project-desc">{{ project.description }}</text>
          <view class="project-meta">
            <view class="meta-item">
              <text class="meta-label">项目负责人</text>
              <text class="meta-value">{{ project.leader }}</text>
            </view>
            <view class="meta-item">
              <text class="meta-label">项目周期</text>
              <text class="meta-value">{{ project.startDate }} 至 {{ project.endDate }}</text>
            </view>
          </view>
        </view>
        
        <view class="progress-overview-card">
          <view class="progress-header">
            <text class="progress-title">整体进度</text>
            <text class="progress-percent">{{ project.progress }}%</text>
          </view>
          <view class="progress-bar">
            <view 
              class="progress-fill" 
              :style="{ width: project.progress + '%' }"
              :class="getProgressClass(project.progress)"
            ></view>
          </view>
          <view class="budget-row">
            <view class="budget-item">
              <text class="budget-label">总预算</text>
              <text class="budget-value">¥{{ formatMoney(project.budget) }}</text>
            </view>
            <view class="budget-item">
              <text class="budget-label">已支出</text>
              <text class="budget-value spent">¥{{ formatMoney(project.spent) }}</text>
            </view>
            <view class="budget-item">
              <text class="budget-label">剩余</text>
              <text class="budget-value remaining">¥{{ formatMoney(project.budget - project.spent) }}</text>
            </view>
          </view>
        </view>
        
        <view class="milestones-card">
          <view class="card-header">
            <text class="card-title">里程碑进度</text>
          </view>
          <view class="milestone-list">
            <view 
              v-for="(milestone, index) in project.milestones" 
              :key="milestone.id"
              class="milestone-item"
            >
              <view class="milestone-left">
                <view :class="['milestone-dot', getMilestoneStatusClass(milestone.status)]"></view>
                <view v-if="index < project.milestones.length - 1" class="milestone-line"></view>
              </view>
              <view class="milestone-content">
                <view class="milestone-header">
                  <text class="milestone-name">{{ milestone.name }}</text>
                  <view :class="['milestone-status', getMilestoneStatusClass(milestone.status)]">
                    {{ milestone.status }}
                  </view>
                </view>
                <text class="milestone-date">{{ milestone.date }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <view v-else class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">未找到项目信息</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const projectId = ref(null)
const project = ref(null)

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  projectId.value = parseInt(options.id) || 1
  
  const projects = store.getters.projects
  project.value = projects.find(p => p.id === projectId.value)
})

const goBack = () => {
  uni.navigateBack()
}

const formatMoney = (value) => {
  return (value / 10000).toFixed(2) + '万'
}

const getStatusClass = (status) => {
  const statusMap = {
    '未开始': 'status-pending',
    '进行中': 'status-processing',
    '已完成': 'status-approved'
  }
  return statusMap[status] || 'status-pending'
}

const getProgressClass = (progress) => {
  if (progress >= 80) return 'progress-high'
  if (progress >= 50) return 'progress-medium'
  return 'progress-low'
}

const getMilestoneStatusClass = (status) => {
  const statusMap = {
    '已完成': 'milestone-done',
    '进行中': 'milestone-processing',
    '未开始': 'milestone-pending'
  }
  return statusMap[status] || 'milestone-pending'
}
</script>

<style lang="scss" scoped>
.project-detail-page {
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
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
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
  padding-top: 76px;
  padding-bottom: 24rpx;
  height: calc(100vh - 76px);
}

.project-content {
  padding: 24rpx;
}

.project-info-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.project-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #000000;
}

.status-tag {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.status-pending {
  background-color: #F5F5F5;
  color: #8C8C8C;
}

.status-processing {
  background-color: #E8F4FF;
  color: #177DDC;
}

.status-approved {
  background-color: #E8F5E9;
  color: #49AA19;
}

.project-desc {
  font-size: 28rpx;
  color: #595959;
  line-height: 1.6;
  display: block;
  margin-bottom: 24rpx;
}

.project-meta {
  display: flex;
  gap: 32rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #F0F0F0;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.meta-label {
  font-size: 24rpx;
  color: #8C8C8C;
}

.meta-value {
  font-size: 28rpx;
  color: #262626;
  font-weight: 500;
}

.progress-overview-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.progress-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
}

.progress-percent {
  font-size: 40rpx;
  font-weight: 700;
  color: #667EEA;
}

.progress-bar {
  height: 16rpx;
  background-color: #F0F0F0;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
}

.progress-fill {
  height: 100%;
  border-radius: 8rpx;
  transition: width 0.3s;
}

.progress-high {
  background: linear-gradient(90deg, #49AA19 0%, #6BCB3D 100%);
}

.progress-medium {
  background: linear-gradient(90deg, #667EEA 0%, #764BA2 100%);
}

.progress-low {
  background: linear-gradient(90deg, #D89614 0%, #F0B838 100%);
}

.budget-row {
  display: flex;
  justify-content: space-between;
}

.budget-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.budget-label {
  font-size: 24rpx;
  color: #8C8C8C;
}

.budget-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
}

.budget-value.spent {
  color: #D89614;
}

.budget-value.remaining {
  color: #49AA19;
}

.milestones-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
}

.card-header {
  margin-bottom: 32rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
}

.milestone-list {
  display: flex;
  flex-direction: column;
}

.milestone-item {
  display: flex;
  gap: 20rpx;
}

.milestone-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rpx;
}

.milestone-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.milestone-dot.milestone-done {
  background-color: #49AA19;
}

.milestone-dot.milestone-processing {
  background-color: #667EEA;
}

.milestone-dot.milestone-pending {
  background-color: #E5E5E5;
}

.milestone-line {
  width: 4rpx;
  flex: 1;
  background-color: #E5E5E5;
  margin: 8rpx 0;
  min-height: 40rpx;
}

.milestone-content {
  flex: 1;
  padding-bottom: 32rpx;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.milestone-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #000000;
}

.milestone-status {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.milestone-status.milestone-done {
  background-color: #E8F5E9;
  color: #49AA19;
}

.milestone-status.milestone-processing {
  background-color: #E8F4FF;
  color: #667EEA;
}

.milestone-status.milestone-pending {
  background-color: #F5F5F5;
  color: #8C8C8C;
}

.milestone-date {
  font-size: 24rpx;
  color: #8C8C8C;
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