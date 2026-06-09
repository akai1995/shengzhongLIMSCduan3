<template>
  <view class="quick-approval-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">快速审批</text>
      <view class="header-right"></view>
    </view>
    
    <view class="tab-bar">
      <view 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab-item', { active: currentTab === tab.key }]"
        @click="switchTab(tab.key)"
      >
        <text class="tab-text">{{ tab.label }}</text>
        <view v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</view>
      </view>
    </view>
    
    <scroll-view class="content-wrapper" scroll-y @scrolltolower="loadMore">
      <view v-if="filteredApprovals.length === 0" class="empty-state">
        <view class="empty-icon">📋</view>
        <text class="empty-text">暂无{{ getTabLabel(currentTab) }}审批</text>
      </view>
      
      <view 
        v-for="item in filteredApprovals" 
        :key="item.id" 
        class="approval-card"
        @click="viewDetail(item)"
      >
        <view class="card-header">
          <view :class="['type-badge', `badge-${item.type}`]">
            <text class="badge-text">{{ getTypeLabel(item.type) }}</text>
          </view>
          <view :class="['status-badge', getStatusClass(item.status)]">
            <text class="status-text">{{ item.status }}</text>
          </view>
        </view>
        
        <view class="card-title">
          <text class="title-text">{{ item.title }}</text>
        </view>
        
        <view class="card-info">
          <view class="info-row">
            <text class="info-label">申请人</text>
            <text class="info-value">{{ item.applicant }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">所属部门</text>
            <text class="info-value">{{ item.department }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">申请时间</text>
            <text class="info-value">{{ item.submitTime }}</text>
          </view>
        </view>
        
        <view class="card-amount" v-if="item.amount > 0">
          <text class="amount-label">申请金额</text>
          <text class="amount-value">¥{{ formatMoney(item.amount) }}</text>
        </view>
        
        <view class="card-footer" v-if="currentTab === 'pending'">
          <view class="action-btn reject-btn" @click.stop="handleReject(item)">
            <text class="btn-text">拒绝</text>
          </view>
          <view class="action-btn approve-btn" @click.stop="handleApprove(item)">
            <text class="btn-text">通过</text>
          </view>
        </view>
      </view>
      
      <view v-if="hasMore" class="load-more">
        <text class="load-more-text">加载更多...</text>
      </view>
    </scroll-view>
    
    <!-- 审批弹窗 -->
    <view class="modal-overlay" v-if="showModal" @click="closeModal">
      <view class="modal-content" @click.stop>
        <text class="modal-title">{{ modalTitle }}</text>
        <textarea 
          class="modal-textarea" 
          v-model="comment" 
          placeholder="请输入审批意见（可选）"
          :maxlength="500"
        ></textarea>
        <view class="modal-actions">
          <view class="modal-btn cancel-btn" @click="closeModal">
            <text>取消</text>
          </view>
          <view class="modal-btn confirm-btn" @click="confirmAction">
            <text>{{ modalConfirmText }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const tabs = ref([
  { key: 'pending', label: '待审批', count: 3 },
  { key: 'approved', label: '已通过', count: 5 },
  { key: 'rejected', label: '已拒绝', count: 2 }
])

const currentTab = ref('pending')
const showModal = ref(false)
const modalType = ref('')
const comment = ref('')
const selectedItem = ref(null)

const approvals = ref([
  // 待审批
  {
    id: 1,
    title: 'PCR仪采购申请',
    type: 'equipment',
    status: '待审批',
    applicant: '李明',
    department: '科研部',
    submitTime: '2024-01-15 10:30',
    amount: 50000,
    urgency: 'normal'
  },
  {
    id: 2,
    title: '实验室危化品使用申请',
    type: 'hazardous',
    status: '待审批',
    applicant: '王芳',
    department: '化学实验室',
    submitTime: '2024-01-15 14:20',
    amount: 0,
    urgency: 'urgent'
  },
  {
    id: 3,
    title: '耗材采购申请-生物试剂',
    type: 'supply',
    status: '待审批',
    applicant: '张伟',
    department: '生物实验室',
    submitTime: '2024-01-15 16:45',
    amount: 15000,
    urgency: 'low'
  },
  // 已通过
  {
    id: 4,
    title: '离心机维修申请',
    type: 'equipment',
    status: '已通过',
    applicant: '陈静',
    department: '物理实验室',
    submitTime: '2024-01-14 09:00',
    amount: 8000,
    urgency: 'normal'
  },
  {
    id: 5,
    title: '实验预约-大型仪器',
    type: 'reservation',
    status: '已通过',
    applicant: '刘洋',
    department: '分析中心',
    submitTime: '2024-01-14 11:30',
    amount: 0,
    urgency: 'normal'
  },
  {
    id: 6,
    title: '项目变更申请',
    type: 'project',
    status: '已通过',
    applicant: '赵强',
    department: '科研部',
    submitTime: '2024-01-13 15:00',
    amount: 20000,
    urgency: 'normal'
  },
  {
    id: 7,
    title: '试剂采购申请',
    type: 'supply',
    status: '已通过',
    applicant: '孙莉',
    department: '化学实验室',
    submitTime: '2024-01-13 10:00',
    amount: 5000,
    urgency: 'low'
  },
  {
    id: 8,
    title: '设备采购申请-显微镜',
    type: 'equipment',
    status: '已通过',
    applicant: '周涛',
    department: '生物实验室',
    submitTime: '2024-01-12 14:00',
    amount: 120000,
    urgency: 'normal'
  },
  // 已拒绝
  {
    id: 9,
    title: '实验室改造申请',
    type: 'project',
    status: '已拒绝',
    applicant: '吴敏',
    department: '管理部',
    submitTime: '2024-01-10 09:00',
    amount: 500000,
    urgency: 'low'
  },
  {
    id: 10,
    title: '危化品采购申请',
    type: 'hazardous',
    status: '已拒绝',
    applicant: '郑浩',
    department: '化学实验室',
    submitTime: '2024-01-09 11:00',
    amount: 30000,
    urgency: 'normal'
  }
])

const filteredApprovals = computed(() => {
  return approvals.value.filter(item => {
    if (currentTab.value === 'pending') {
      return item.status === '待审批'
    } else if (currentTab.value === 'approved') {
      return item.status === '已通过'
    } else if (currentTab.value === 'rejected') {
      return item.status === '已拒绝'
    }
    return true
  })
})

const hasMore = computed(() => {
  return filteredApprovals.value.length < 10
})

const modalTitle = computed(() => {
  return modalType.value === 'approve' ? '确认通过' : '确认拒绝'
})

const modalConfirmText = computed(() => {
  return modalType.value === 'approve' ? '确认通过' : '确认拒绝'
})

const getTabLabel = (key) => {
  const tab = tabs.value.find(t => t.key === key)
  return tab ? tab.label.replace('已', '').replace('待', '') : ''
}

const switchTab = (key) => {
  currentTab.value = key
}

const getTypeLabel = (type) => {
  const typeMap = {
    equipment: '设备采购',
    supply: '耗材申请',
    reservation: '实验预约',
    hazardous: '危化品',
    project: '项目变更'
  }
  return typeMap[type] || '其他'
}

const getStatusClass = (status) => {
  const statusMap = {
    '待审批': 'status-pending',
    '已通过': 'status-approved',
    '已拒绝': 'status-rejected'
  }
  return statusMap[status] || 'status-pending'
}

const formatMoney = (amount) => {
  if (!amount || amount <= 0) {
    return '0'
  }
  if (amount >= 10000) {
    return (amount / 10000).toFixed(2) + '万'
  }
  return amount.toLocaleString()
}

const goBack = () => {
  uni.navigateBack()
}

const viewDetail = (item) => {
  uni.navigateTo({
    url: `/pages/todo/detail?id=${item.id}`
  })
}

const handleApprove = (item) => {
  selectedItem.value = item
  modalType.value = 'approve'
  showModal.value = true
}

const handleReject = (item) => {
  selectedItem.value = item
  modalType.value = 'reject'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  comment.value = ''
}

const confirmAction = () => {
  if (!selectedItem.value) return
  
  const action = modalType.value === 'approve' ? '通过' : '拒绝'
  const newStatus = modalType.value === 'approve' ? '已通过' : '已拒绝'
  
  uni.showLoading({ title: '处理中...' })
  
  setTimeout(() => {
    uni.hideLoading()
    
    // 更新本地数据
    const index = approvals.value.findIndex(a => a.id === selectedItem.value.id)
    if (index !== -1) {
      approvals.value[index].status = newStatus
    }
    
    // 更新标签页计数
    const pendingTab = tabs.value.find(t => t.key === 'pending')
    const targetTab = tabs.value.find(t => t.key === currentTab.value)
    if (pendingTab && targetTab) {
      if (modalType.value === 'approve') {
        pendingTab.count--
        targetTab.count++
      } else {
        pendingTab.count--
        targetTab.count++
      }
    }
    
    closeModal()
    
    uni.showToast({
      title: `审批已${action}`,
      icon: 'success',
      duration: 2000
    })
  }, 800)
}

const loadMore = () => {
  // 模拟加载更多
  uni.showToast({
    title: '没有更多数据了',
    icon: 'none',
    duration: 1500
  })
}
</script>

<style lang="scss" scoped>
.quick-approval-page {
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

.tab-bar {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
  z-index: 99;
  display: flex;
  background-color: #FFFFFF;
  padding: 0 16px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 0;
  position: relative;
  
  &.active {
    .tab-text {
      color: #177DDC;
      font-weight: 600;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 48rpx;
      height: 6rpx;
      background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
      border-radius: 3rpx;
    }
  }
}

.tab-text {
  font-size: 15px;
  color: #8C8C8C;
}

.tab-badge {
  margin-left: 8rpx;
  min-width: 36rpx;
  height: 36rpx;
  padding: 0 10rpx;
  background-color: #F53F3F;
  color: #FFFFFF;
  font-size: 22rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  padding-top: 92px;
  padding-bottom: 24px;
  height: calc(100vh - 92px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #B2B2B2;
}

.approval-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  margin: 24rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.type-badge {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.badge-equipment {
  background-color: #E6F7FF;
  color: #177DDC;
}

.badge-supply {
  background-color: #F6FFED;
  color: #49AA19;
}

.badge-reservation {
  background-color: #FFF7E6;
  color: #D89614;
}

.badge-hazardous {
  background-color: #FFF1F0;
  color: #F53F3F;
}

.badge-project {
  background-color: #F9F0FF;
  color: #722ED1;
}

.badge-text {
  font-size: 24rpx;
  font-weight: 500;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.status-pending {
  background-color: #FFF7E6;
  color: #D89614;
}

.status-approved {
  background-color: #F6FFED;
  color: #49AA19;
}

.status-rejected {
  background-color: #FFF1F0;
  color: #F53F3F;
}

.status-text {
  font-size: 24rpx;
  font-weight: 500;
}

.card-title {
  margin-bottom: 20rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
  line-height: 1.4;
}

.card-info {
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 0 20rpx;
  
  &:not(:last-child) {
    border-bottom: 1rpx solid #F0F0F0;
  }
}

.info-label {
  font-size: 28rpx;
  color: #8C8C8C;
}

.info-value {
  font-size: 28rpx;
  color: #333333;
}

.card-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-top: 1rpx dashed #E5E5E5;
}

.amount-label {
  font-size: 28rpx;
  color: #8C8C8C;
}

.amount-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #F53F3F;
}

.card-footer {
  display: flex;
  gap: 24rpx;
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #F0F0F0;
}

.action-btn {
  flex: 1;
  height: 72rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reject-btn {
  background-color: #F5F5F5;
  
  .btn-text {
    color: #8C8C8C;
    font-size: 28rpx;
    font-weight: 500;
  }
}

.approve-btn {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  
  .btn-text {
    color: #FFFFFF;
    font-size: 28rpx;
    font-weight: 500;
  }
}

.load-more {
  text-align: center;
  padding: 32rpx;
}

.load-more-text {
  font-size: 26rpx;
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
  padding: 32rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
  text-align: center;
  display: block;
  margin-bottom: 24rpx;
}

.modal-textarea {
  width: 100%;
  height: 200rpx;
  background-color: #FAFAFA;
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  gap: 24rpx;
  margin-top: 32rpx;
}

.modal-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.cancel-btn {
  background-color: #F5F5F5;
  color: #8C8C8C;
}

.confirm-btn {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  color: #FFFFFF;
}
</style>
