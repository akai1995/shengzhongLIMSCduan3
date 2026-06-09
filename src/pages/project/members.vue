<template>
  <view class="project-members-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">项目成员</text>
      <view class="header-right"></view>
    </view>
    
    <scroll-view class="content-wrapper" scroll-y>
      <view v-if="project" class="members-content">
        <view class="project-info-bar">
          <text class="project-name">{{ project.name }}</text>
          <text class="member-count">{{ project.members.length }}人</text>
        </view>
        
        <view class="members-card">
          <view class="card-header">
            <text class="card-title">成员列表</text>
          </view>
          <view class="member-list">
            <view 
              v-for="member in project.members" 
              :key="member.id"
              class="member-item"
              @click="viewMemberDetail(member)"
            >
              <view class="member-avatar">
                <text class="avatar-text">{{ member.avatar }}</text>
              </view>
              <view class="member-info">
                <view class="member-header">
                  <text class="member-name">{{ member.name }}</text>
                  <view v-if="member.role.includes('负责人')" class="leader-badge">负责人</view>
                </view>
                <text class="member-role">{{ member.role }}</text>
                <text class="member-department">{{ member.department }}</text>
              </view>
              <view class="member-arrow">
                <text class="arrow-text">›</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="stats-card">
          <view class="card-header">
            <text class="card-title">成员贡献统计</text>
          </view>
          <view class="contribution-list">
            <view 
              v-for="member in project.members" 
              :key="member.id"
              class="contribution-item"
            >
              <view class="contribution-avatar">
                <text class="avatar-text">{{ member.avatar }}</text>
              </view>
              <view class="contribution-info">
                <view class="contribution-header">
                  <text class="contribution-name">{{ member.name }}</text>
                  <text class="contribution-percent">{{ getContributionPercent(member) }}%</text>
                </view>
                <view class="contribution-bar">
                  <view 
                    class="contribution-fill" 
                    :style="{ width: getContributionPercent(member) + '%' }"
                  ></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <view v-else class="empty-state">
        <text class="empty-icon">👥</text>
        <text class="empty-text">未找到项目信息</text>
      </view>
    </scroll-view>
    
    <!-- 成员详情弹窗 -->
    <view class="modal-overlay" v-if="selectedMember" @click="selectedMember = null">
      <view class="modal-content member-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">成员详情</text>
          <text class="modal-close" @click="selectedMember = null">×</text>
        </view>
        
        <view class="member-detail">
          <view class="detail-avatar">
            <text class="avatar-text">{{ selectedMember.avatar }}</text>
          </view>
          <view class="detail-info">
            <text class="detail-name">{{ selectedMember.name }}</text>
            <text class="detail-role">{{ selectedMember.role }}</text>
            <text class="detail-department">{{ selectedMember.department }}</text>
          </view>
        </view>
        
        <view class="detail-stats">
          <view class="stat-item">
            <text class="stat-value">{{ getMemberTasks(selectedMember) }}</text>
            <text class="stat-label">负责任务</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ getMemberReports(selectedMember) }}</text>
            <text class="stat-label">提交报告</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ getContributionPercent(selectedMember) }}%</text>
            <text class="stat-label">项目贡献</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const projectId = ref(null)
const project = ref(null)
const selectedMember = ref(null)

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

const viewMemberDetail = (member) => {
  selectedMember.value = member
}

const getContributionPercent = (member) => {
  if (!project.value) return 0
  const basePercent = 100 / project.value.members.length
  if (member.role.includes('负责人')) {
    return Math.round(basePercent * 1.5)
  }
  return Math.round(basePercent)
}

const getMemberTasks = (member) => {
  return Math.floor(Math.random() * 5) + 1
}

const getMemberReports = (member) => {
  return Math.floor(Math.random() * 10) + 1
}
</script>

<style lang="scss" scoped>
.project-members-page {
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

.members-content {
  padding: 24rpx;
}

.project-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.project-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
}

.member-count {
  font-size: 28rpx;
  color: #8C8C8C;
}

.members-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.card-header {
  margin-bottom: 24rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  
  &:active {
    opacity: 0.6;
  }
}

.member-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.member-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.member-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #000000;
}

.leader-badge {
  padding: 4rpx 12rpx;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: #FFFFFF;
  font-size: 20rpx;
  border-radius: 8rpx;
}

.member-role {
  font-size: 26rpx;
  color: #595959;
}

.member-department {
  font-size: 24rpx;
  color: #8C8C8C;
}

.member-arrow {
  flex-shrink: 0;
}

.arrow-text {
  font-size: 32rpx;
  color: #B2B2B2;
}

.stats-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
}

.contribution-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.contribution-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.contribution-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contribution-avatar .avatar-text {
  font-size: 22rpx;
}

.contribution-info {
  flex: 1;
}

.contribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.contribution-name {
  font-size: 28rpx;
  color: #262626;
}

.contribution-percent {
  font-size: 26rpx;
  font-weight: 600;
  color: #667EEA;
}

.contribution-bar {
  height: 8rpx;
  background-color: #F0F0F0;
  border-radius: 4rpx;
  overflow: hidden;
}

.contribution-fill {
  height: 100%;
  background: linear-gradient(90deg, #667EEA 0%, #764BA2 100%);
  border-radius: 4rpx;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 600rpx;
  background-color: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
}

.modal-close {
  font-size: 48rpx;
  color: #B2B2B2;
}

.member-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 32rpx;
}

.detail-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.detail-avatar .avatar-text {
  font-size: 48rpx;
}

.detail-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.detail-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #000000;
}

.detail-role {
  font-size: 28rpx;
  color: #595959;
}

.detail-department {
  font-size: 26rpx;
  color: #8C8C8C;
}

.detail-stats {
  display: flex;
  justify-content: space-around;
  padding: 32rpx;
  border-top: 1rpx solid #F0F0F0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #667EEA;
}

.stat-label {
  font-size: 24rpx;
  color: #8C8C8C;
}
</style>