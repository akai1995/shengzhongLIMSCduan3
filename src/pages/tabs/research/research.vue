<template>
  <view class="research-page">
    <view class="page-header">
      <text class="page-title">科研管理</text>
    </view>
    
    <view class="tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.key" 
        :class="['tab-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        <text class="tab-text">{{ tab.label }}</text>
        <view v-if="activeTab === tab.key" class="tab-indicator"></view>
      </view>
    </view>
    
    <view v-show="activeTab === 'projects'" class="tab-content">
      <view class="card" v-for="project in projects" :key="project.id">
        <view class="project-header">
          <view class="project-info">
            <text class="project-name">{{ project.name }}</text>
            <view :class="['status-tag', getStatusClass(project.status)]">
              {{ project.status }}
            </view>
          </view>
          <view class="project-progress-circle">
            <text class="progress-value">{{ project.progress }}%</text>
          </view>
        </view>
        
        <view class="project-progress-bar">
          <view 
            class="progress-fill" 
            :style="{ width: project.progress + '%' }"
            :class="getProgressClass(project.progress)"
          ></view>
        </view>
        
        <view class="project-footer">
          <view class="project-budget">
            <text class="budget-label">预算</text>
            <text class="budget-value">¥{{ formatMoney(project.budget) }}</text>
          </view>
          <view class="project-spent">
            <text class="spent-label">已支出</text>
            <text class="spent-value">¥{{ formatMoney(project.spent) }}</text>
          </view>
          <view class="project-remaining">
            <text class="remaining-label">剩余</text>
            <text class="remaining-value">¥{{ formatMoney(project.budget - project.spent) }}</text>
          </view>
        </view>
        
        <view class="project-actions">
          <view class="action-btn" @click="viewProjectDetail(project)">查看进度</view>
          <view class="action-btn" @click="viewProjectMembers(project)">查看成员</view>
          <view class="action-btn" @click="viewProjectResults(project)">查看成果</view>
        </view>
      </view>
    </view>
    
    <view v-show="activeTab === 'approval'" class="tab-content">
      <view class="card">
        <view class="approval-header">
          <text class="approval-title">待我审批</text>
          <text class="approval-count">{{ approvalList.length }}</text>
        </view>
        <view class="approval-list">
          <view 
            v-for="item in approvalList" 
            :key="item.id" 
            class="approval-item"
            @click="handleApproval(item)"
          >
            <view class="approval-content">
              <view class="approval-main">
                <view :class="['approval-icon', item.type]"></view>
                <text class="approval-name">{{ item.name }}</text>
              </view>
              <view class="approval-detail">
                <text class="approval-desc">{{ item.description }}</text>
                <text class="approval-time">{{ item.time }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view v-show="activeTab === 'funds'" class="tab-content">
      <view class="funds-summary-card">
        <view class="funds-title">经费概览</view>
        <view class="funds-stats">
          <view class="funds-stat">
            <text class="stat-label">剩余预算</text>
            <text class="stat-value funds-primary">¥{{ formatMoney(totalBudget - totalSpent) }}</text>
          </view>
          <view class="funds-divider"></view>
          <view class="funds-stat">
            <text class="stat-label">待审批金额</text>
            <text class="stat-value funds-warning">¥{{ formatMoney(pendingApproval) }}</text>
          </view>
        </view>
      </view>
      
      <view class="card">
        <view class="card-header">
          <view class="card-title"><text>我的报销申请</text></view>
          <view class="add-btn" @click="createReimbursement">
            <text class="add-icon">+</text>
            <text class="add-text">发起报销</text>
          </view>
        </view>
        <view class="reimbursement-list">
          <view 
            v-for="item in reimbursementList" 
            :key="item.id" 
            class="reimbursement-item"
            @click="viewReimbursementDetail(item)"
          >
            <view class="reimbursement-info">
              <view class="reimbursement-header">
                <text class="reimbursement-name">{{ item.name }}</text>
                <view :class="['status-tag', getStatusClass(item.status)]">
                  {{ item.status }}
                </view>
              </view>
              <text class="reimbursement-desc">{{ item.description }}</text>
              <view class="reimbursement-footer">
                <text class="reimbursement-amount">¥{{ formatMoney(item.amount) }}</text>
                <text class="reimbursement-time">{{ item.time }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const activeTab = ref('projects')
const tabs = [
  { key: 'projects', label: '我的项目' },
  { key: 'approval', label: '待我审批' },
  { key: 'funds', label: '经费动态' }
]
const approvalList = ref([
  { id: 1, type: 'project', name: '人工智能项目立项', description: '张三提交的项目立项申请', time: '10分钟前' },
  { id: 2, type: 'funds', name: '设备采购报销', description: '李四提交的设备采购报销申请', time: '30分钟前' },
  { id: 3, type: 'project', name: '基因测序项目变更', description: '王五提交的项目变更申请', time: '1小时前' }
])
const reimbursementList = ref([
  { id: 1, name: '实验耗材报销', description: '购买PCR试剂盒等实验耗材', amount: 2580, status: '待审批', time: '2024-01-15' },
  { id: 2, name: '差旅费报销', description: '参加学术会议差旅费', amount: 3200, status: '已通过', time: '2024-01-10' },
  { id: 3, name: '设备维护费', description: '质谱仪维护保养费用', amount: 15000, status: '已驳回', time: '2024-01-08' }
])
const totalBudget = ref(1800000)
const totalSpent = ref(795000)
const pendingApproval = ref(18580)

const projects = computed(() => store.getters.projects)

const formatMoney = (value) => {
  return (value / 10000).toFixed(2) + '万'
}

const getStatusClass = (status) => {
  const statusMap = {
    '未开始': 'status-pending',
    '进行中': 'status-processing',
    '已完成': 'status-approved',
    '待审批': 'status-pending',
    '已通过': 'status-approved',
    '已驳回': 'status-rejected'
  }
  return statusMap[status] || 'status-pending'
}

const getProgressClass = (progress) => {
  if (progress >= 80) return 'progress-high'
  if (progress >= 50) return 'progress-medium'
  return 'progress-low'
}

const viewProjectDetail = (project) => {
  uni.navigateTo({ url: `/pages/project/detail?id=${project.id}` })
}

const viewProjectMembers = (project) => {
  uni.navigateTo({ url: `/pages/project/members?id=${project.id}` })
}

const viewProjectResults = (project) => {
  uni.navigateTo({ url: `/pages/project/results?id=${project.id}` })
}

const handleApproval = (item) => {
  uni.navigateTo({ url: `/pages/approval/detail?id=${item.id}` })
}

const createReimbursement = () => {
  uni.navigateTo({ url: '/pages/reimbursement/create' })
}

const viewReimbursementDetail = (item) => {
  uni.navigateTo({ url: `/pages/reimbursement/detail?id=${item.id}` })
}
</script>

<style lang="scss" scoped>
.research-page {
  min-height: 100vh;
  background-color: #F7F7F7;
  padding-bottom: 24rpx;
  padding-top: 172rpx;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
}

.page-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.tabs {
  display: flex;
  background-color: #FFFFFF;
  padding: 0;
  margin: -24rpx 24rpx 24rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0;
  position: relative;
}

.tab-text {
  font-size: 28rpx;
  color: #8C8C8C;
  transition: color 0.3s;
}

.tab-item.active .tab-text {
  color: #667EEA;
  font-weight: 600;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  width: 48rpx;
  height: 6rpx;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  border-radius: 3rpx;
}

.tab-content {
  padding: 0;
  margin-left: 0px;
  margin-right: 0px;
}

.card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 16px;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.project-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.project-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  width: fit-content;
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

.status-rejected {
  background-color: #FFF5F5;
  color: #F53F3F;
}

.project-progress-circle {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-value {
  font-size: 22rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.project-progress-bar {
  height: 12rpx;
  background-color: #F0F0F0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.progress-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.3s;
}

.progress-high {
  background: linear-gradient(90deg, #49AA19 0%, #6BCB3D 100%);
}

.progress-medium {
  background: linear-gradient(90deg, #177DDC 0%, #4CAFFF 100%);
}

.progress-low {
  background: linear-gradient(90deg, #D89614 0%, #F0B838 100%);
}

.project-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 4px;
  padding-left: 16px;
  padding-right: 16px;
  border-top: 1rpx solid #F0F0F0;
  margin-bottom: 20rpx;
}

.project-budget, .project-spent, .project-remaining {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.budget-label, .spent-label, .remaining-label {
  font-size: 24rpx;
  color: #8C8C8C;
  margin-bottom: 4rpx;
}

.budget-value, .spent-value, .remaining-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
}

.project-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  flex: 1;
  height: 72rpx;
  background-color: #F7F7F7;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #595959;
  
  &:active {
    background-color: #E8E8E8;
  }
}

.approval-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.approval-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
}

.approval-count {
  font-size: 28rpx;
  font-weight: 600;
  color: #F53F3F;
}

.approval-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.approval-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background-color: #FAFAFA;
  border-radius: 16rpx;
}

.approval-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.approval-main {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.approval-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
}

.approval-icon.project {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
}

.approval-icon.funds {
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
}

.approval-detail {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rpx;
  padding-left: 0;
}

.approval-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #000000;
}

.approval-desc {
  font-size: 28rpx;
  color: #8C8C8C;
}

.approval-time {
  font-size: 22rpx;
  color: #B2B2B2;
}

.funds-summary-card {
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
  border-radius: 20rpx;
  padding: 16px;
  margin-bottom: 24rpx;
  margin-left: 12px;
  margin-right: 12px;
}

.funds-title {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 20rpx;
}

.funds-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.funds-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8rpx;
}

.stat-value {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.funds-divider {
  width: 2rpx;
  height: 60rpx;
  background-color: rgba(255, 255, 255, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  height: 36px;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
  display: flex;
  align-items: center;
  height: 36px;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 0 24rpx;
  background-color: #177DDC;
  border-radius: 24rpx;
  height: 36px;
}

.add-icon {
  font-size: 28rpx;
  color: #FFFFFF;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.add-text {
  font-size: 24rpx;
  color: #FFFFFF;
  display: flex;
  align-items: center;
}

.reimbursement-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.reimbursement-item {
  padding: 20rpx;
  background-color: #FAFAFA;
  border-radius: 16rpx;
}

.reimbursement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.reimbursement-name {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}

.reimbursement-desc {
  font-size: 14px;
  color: #8C8C8C;
  margin-bottom: 12rpx;
}

.reimbursement-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reimbursement-amount {
  font-size: 14px;
  font-weight: 600;
  color: #177DDC;
}

.reimbursement-time {
  font-size: 22rpx;
  color: #B2B2B2;
}
</style>
