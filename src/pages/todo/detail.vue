<template>
  <view class="detail-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">审批详情</text>
      <view class="header-right"></view>
    </view>
    
    <view class="content-wrapper">
      <view class="status-card">
        <view :class="['status-badge', getStatusClass(currentApproval.status)]">
          {{ currentApproval.status }}
        </view>
        <text class="approval-title">{{ currentApproval.title }}</text>
        <text class="approval-id">审批编号: {{ currentApproval.id.toString().padStart(6, '0') }}</text>
      </view>
      
      <view class="info-card">
        <view class="info-section">
          <text class="section-title">基本信息</text>
          <view class="info-item">
            <text class="info-label">申请人</text>
            <text class="info-value">{{ currentApproval.applicant }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">联系电话</text>
            <text class="info-value">{{ currentApproval.applicantPhone }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">所属部门</text>
            <text class="info-value">{{ currentApproval.department }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">申请时间</text>
            <text class="info-value">{{ currentApproval.submitTime }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">申请类型</text>
            <text class="info-value">{{ getTypeLabel(currentApproval.type) }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">紧急程度</text>
            <text class="info-value">{{ getUrgencyLabel(currentApproval.urgency) }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">预计天数</text>
            <text class="info-value">{{ currentApproval.estimatedDays }} 天</text>
          </view>
        </view>
      </view>
      
      <view class="detail-card">
        <view class="detail-section">
          <text class="detail-section-title">项目信息</text>
          <view class="detail-item">
            <text class="detail-label">项目名称</text>
            <text class="detail-value">{{ currentApproval.projectName }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">预算编号</text>
            <text class="detail-value">{{ currentApproval.budgetCode }}</text>
          </view>
        </view>
        
        <view class="detail-section">
          <text class="detail-section-title">申请内容</text>
          <view class="detail-description">
            <text class="detail-text">{{ currentApproval.description }}</text>
          </view>
        </view>
        
        <view class="detail-section">
          <text class="detail-section-title">申请理由</text>
          <view class="detail-description">
            <text class="detail-text">{{ currentApproval.reason }}</text>
          </view>
        </view>
        
        <view v-if="currentApproval.items && currentApproval.items.length > 0" class="detail-section">
          <text class="detail-section-title">申请明细</text>
          <view class="detail-items">
            <view 
              v-for="(item, index) in currentApproval.items" 
              :key="index" 
              class="detail-item-row"
            >
              <view class="detail-item-index">{{ index + 1 }}</view>
              <view class="detail-item-info">
                <text class="detail-item-name">{{ item.name }}</text>
                <text class="detail-item-spec">{{ item.spec }}</text>
              </view>
              <view class="detail-item-quantity">{{ item.quantity }} {{ item.unit }}</view>
              <view class="detail-item-amount">¥{{ formatMoney(item.amount) }}</view>
            </view>
          </view>
          <view class="detail-total">
            <text class="detail-total-label">合计金额</text>
            <text class="detail-total-value">¥{{ formatMoney(currentApproval.amount) }}</text>
          </view>
        </view>
        
        <view v-if="currentApproval.attachments && currentApproval.attachments.length > 0" class="detail-section">
          <text class="detail-section-title">附件</text>
          <view class="detail-attachments">
            <view 
              v-for="(file, index) in currentApproval.attachments" 
              :key="index" 
              class="detail-attachment-item"
              @click="previewFile(file)"
            >
              <view class="detail-attachment-icon">{{ getFileIcon(file.type) }}</view>
              <view class="detail-attachment-info">
                <text class="detail-attachment-name">{{ file.name }}</text>
                <text class="detail-attachment-size">{{ file.size }}</text>
              </view>
              <text class="detail-attachment-arrow">›</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="history-card">
        <text class="section-title">审批历史</text>
        <view class="history-list">
          <view 
            v-for="(record, index) in approvalHistory" 
            :key="index" 
            class="history-item"
          >
            <view :class="['history-dot', record.status]"></view>
            <view class="history-line" v-if="index < approvalHistory.length - 1"></view>
            <view class="history-content">
              <view class="history-header">
                <text class="history-name">{{ record.name }}</text>
                <text class="history-time">{{ record.time }}</text>
              </view>
              <text class="history-action">{{ record.action }}</text>
              <text v-if="record.comment" class="history-comment">{{ record.comment }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="bottom-actions" v-if="showActions">
      <view class="action-btn reject-btn" @click="handleReject">
        <text class="btn-text">拒绝</text>
      </view>
      <view class="action-btn approve-btn" @click="handleApprove">
        <text class="btn-text">通过</text>
      </view>
    </view>
    
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

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const comment = ref('')
    const showModal = ref(false)
    const modalType = ref('')
    
    const currentApproval = ref({
      id: 1,
      title: 'PCR仪采购申请',
      description: '因科研工作需要，申请采购2台PCR仪及配套试剂，用于基因检测实验。',
      applicant: '李明',
      applicantPhone: '13800138000',
      applicantEmail: 'liming@lab.com',
      department: '科研部',
      time: '2024-01-15',
      submitTime: '2024-01-15 10:30:00',
      type: 'equipment',
      status: '待审批',
      amount: 50000,
      budgetCode: 'BUD-2024-001',
      projectName: '医学影像AI研究项目',
      reason: '随着研究项目的深入，现有设备已无法满足实验需求，需要采购新的PCR仪以提高实验效率和数据准确性。新设备将用于基因扩增和检测实验，预计可将实验周期缩短50%。',
      attachments: [
        { name: '采购申请表.pdf', type: 'pdf', size: '256KB' },
        { name: '设备参数说明.doc', type: 'doc', size: '128KB' },
        { name: '预算明细表.xls', type: 'xls', size: '64KB' }
      ],
      urgency: 'normal',
      estimatedDays: 7,
      items: [
        { name: 'PCR仪', spec: '型号: AB-9700，96孔，梯度PCR', quantity: 2, unit: '台', amount: 45000 },
        { name: '配套试剂', spec: '2x Master Mix，500次', quantity: 10, unit: '盒', amount: 5000 }
      ]
    })
    
    const modalTitle = computed(() => {
      return modalType.value === 'approve' ? '确认通过' : '确认拒绝'
    })
    
    const modalConfirmText = computed(() => {
      return modalType.value === 'approve' ? '确认通过' : '确认拒绝'
    })
    
    const showActions = computed(() => {
      return currentApproval.value.status === '待审批'
    })
    
    const approvalHistory = ref([
      { name: '张三', action: '提交申请', time: '2024-01-15 10:30', status: 'done', comment: '' },
      { name: '李四', action: '部门审核通过', time: '2024-01-15 14:20', status: 'done', comment: '符合部门预算' },
      { name: '王五', action: '等待审批', time: '2024-01-15 15:00', status: 'current', comment: '' }
    ])
    
    const getStatusClass = (status) => {
      const statusMap = {
        '待审批': 'status-pending',
        '已通过': 'status-approved',
        '已拒绝': 'status-rejected',
        '处理中': 'status-processing'
      }
      return statusMap[status] || 'status-pending'
    }
    
    const getTypeLabel = (type) => {
      const typeMap = {
        equipment: '设备采购',
        supply: '耗材申请',
        reservation: '实验预约',
        hazardous: '危化品申请',
        project: '项目变更'
      }
      return typeMap[type] || type
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
    
    const getUrgencyLabel = (urgency) => {
      const urgencyMap = {
        urgent: '紧急',
        normal: '普通',
        low: '低'
      }
      return urgencyMap[urgency] || '普通'
    }
    
    const getFileIcon = (type) => {
      const iconMap = {
        pdf: 'PDF',
        doc: 'DOC',
        xls: 'XLS',
        ppt: 'PPT',
        image: 'IMG',
        zip: 'ZIP'
      }
      return iconMap[type] || 'FILE'
    }
    
    const previewFile = (file) => {
      uni.showToast({
        title: '预览文件: ' + file.name,
        icon: 'none'
      })
    }
    
    const goBack = () => {
      uni.navigateBack({
        delta: 1,
        fail: () => {
          uni.switchTab({
            url: '/pages/tabs/workbench/workbench'
          })
        }
      })
    }
    
    const handleApprove = () => {
      modalType.value = 'approve'
      showModal.value = true
    }
    
    const handleReject = () => {
      modalType.value = 'reject'
      showModal.value = true
    }
    
    const closeModal = () => {
      showModal.value = false
      comment.value = ''
    }
    
    const confirmAction = () => {
      const action = modalType.value === 'approve' ? '通过' : '拒绝'
      
      uni.showLoading({ title: '处理中...' })
      
      setTimeout(() => {
        uni.hideLoading()
        
        currentApproval.value.status = modalType.value === 'approve' ? '已通过' : '已拒绝'
        
        approvalHistory.value.push({
          name: '我',
          action: `${action}审批`,
          time: '刚刚',
          status: 'done',
          comment: comment.value || '无'
        })
        
        closeModal()
        
        uni.showToast({
          title: `审批已${action}`,
          icon: 'success',
          duration: 2000
        })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 800)
    }
    
    onMounted(() => {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const options = currentPage.$page?.options || {}
      const id = parseInt(options.id)
      
      if (id) {
        const approvals = store.getters.approvals
        const approval = approvals.find(a => a.id === id)
        
        if (approval) {
          currentApproval.value = {
            ...approval,
            status: '待审批',
            applicantPhone: '13800138000',
            submitTime: '2024-01-15 10:30',
            urgency: 'normal',
            estimatedDays: 7,
            projectName: '医学影像AI研究项目',
            budgetCode: 'BUD-2024-001',
            reason: '随着研究项目的深入，现有设备已无法满足实验需求，需要采购新的PCR仪以提高实验效率和数据准确性。',
            items: [
              { name: 'PCR仪', spec: '型号: AB-9700', quantity: 2, unit: '台', amount: 45000 },
              { name: '配套试剂', spec: '2x Master Mix', quantity: 10, unit: '盒', amount: 5000 }
            ],
            attachments: [
              { name: '采购申请表.pdf', type: 'pdf', size: '256KB' },
              { name: '设备参数说明.doc', type: 'doc', size: '128KB' }
            ]
          }
        }
      }
    })
    
    return {
      currentApproval,
      approvalHistory,
      comment,
      showModal,
      showActions,
      modalTitle,
      modalConfirmText,
      getStatusClass,
      getTypeLabel,
      getUrgencyLabel,
      getFileIcon,
      formatMoney,
      goBack,
      handleApprove,
      handleReject,
      closeModal,
      confirmAction,
      previewFile
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background-color: #F7F7F7;
  padding-bottom: 140rpx;
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
  font-size: 34rpx;
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

.status-card {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  border-radius: 24rpx;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 24rpx;
  color: #FFFFFF;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  margin-bottom: 16rpx;
}

.status-pending {
  background-color: rgba(255, 255, 255, 0.25);
}

.status-approved {
  background-color: #49AA19;
}

.status-rejected {
  background-color: #F53F3F;
}

.status-processing {
  background-color: #D89614;
}

.approval-title {
  font-size: 16px;
  font-weight: 600;
  display: block;
  margin-bottom: 8rpx;
}

.approval-id {
  font-size: 24rpx;
  opacity: 0.8;
}

.info-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 24rpx;
}

.info-section {
  margin-bottom: 32rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 20rpx;
  display: block;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-size: 14px;
  color: #8C8C8C;
}

.info-value {
  font-size: 14px;
  color: #000000;
  font-weight: 400;
  
  &.amount {
    color: #F53F3F;
    font-weight: 600;
    font-size: 16px;
  }
}

.description-box {
  background-color: #FAFAFA;
  border-radius: 16rpx;
  padding: 20rpx;
}

.description-text {
  font-size: 14px;
  color: #595959;
  line-height: 1.6;
}

.history-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
}

.history-list {
  position: relative;
  padding-left: 20rpx;
}

.history-item {
  position: relative;
  padding-left: 12px;
  padding-bottom: 12px;
  
  &:last-child {
    padding-bottom: 0;
  }
}

.history-dot {
  position: absolute;
  left: -20rpx;
  top: 4rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background-color: #177DDC;
}

.history-dot.done {
  background-color: #49AA19;
}

.history-dot.current {
  background-color: #177DDC;
  box-shadow: 0 0 0 6rpx rgba(23, 125, 220, 0.2);
}

.history-line {
  position: absolute;
  left: -14rpx;
  top: 50%;
  width: 4rpx;
  height: calc(100% - 50%);
  background-color: #E5E5E5;
}

.history-content {
  background-color: #FAFAFA;
  border-radius: 16rpx;
  padding: 20rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.history-name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.history-time {
  font-size: 12px;
  color: #B2B2B2;
}

.history-action {
  font-size: 14px;
  color: #595959;
  display: block;
  margin-bottom: 8rpx;
}

.history-comment {
  font-size: 12px;
  color: #8C8C8C;
  display: block;
  padding-top: 8rpx;
  border-top: 1rpx dashed #E5E5E5;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 24rpx;
  padding: 24rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background-color: #FFFFFF;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.action-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reject-btn {
  background-color: #F5F5F5;
  
  .btn-text {
    color: #8C8C8C;
    font-size: 16px;
    font-weight: 500;
  }
}

.approve-btn {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  
  .btn-text {
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 500;
  }
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
  font-size: 14px;
  color: #000000;
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
  font-size: 14px;
}

.cancel-btn {
  background-color: #F5F5F5;
  color: #8C8C8C;
}

.confirm-btn {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  color: #FFFFFF;
}

.items-list {
  background-color: #FAFAFA;
  border-radius: 16rpx;
  overflow: hidden;
}

.item-row {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
}

.item-index {
  width: 40rpx;
  height: 40rpx;
  background-color: #177DDC;
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-right: 20rpx;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 14px;
  color: #000000;
  font-weight: 500;
  display: block;
}

.item-spec {
  font-size: 12px;
  color: #8C8C8C;
  margin-top: 4rpx;
}

.item-quantity {
  font-size: 14px;
  color: #595959;
  margin-right: 24rpx;
}

.item-amount {
  font-size: 14px;
  color: #F53F3F;
  font-weight: 500;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #FFFFFF;
  border-top: 2rpx solid #177DDC;
  margin-top: 8rpx;
}

.total-label {
  font-size: 14px;
  color: #8C8C8C;
}

.total-value {
  font-size: 18px;
  color: #F53F3F;
  font-weight: 600;
}

.attachments-list {
  background-color: #FAFAFA;
  border-radius: 16rpx;
  overflow: hidden;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: #F0F0F0;
  }
}

.attachment-icon {
  width: 64rpx;
  height: 64rpx;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #FFFFFF;
  font-weight: 600;
  margin-right: 20rpx;
}

.attachment-info {
  flex: 1;
}

.attachment-name {
  font-size: 14px;
  color: #000000;
  display: block;
}

.attachment-size {
  font-size: 12px;
  color: #8C8C8C;
  margin-top: 4rpx;
}

.attachment-arrow {
  font-size: 32rpx;
  color: #CCCCCC;
}

.detail-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 16px;
  margin-bottom: 24rpx;
}

.detail-section {
  margin-bottom: 24rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.detail-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 16rpx;
  display: block;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.detail-label {
  font-size: 14px;
  color: #8C8C8C;
}

.detail-value {
  font-size: 14px;
  color: #000000;
  font-weight: 400;
}

.detail-description {
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 16rpx;
}

.detail-text {
  font-size: 14px;
  color: #333333;
  line-height: 1.6;
}

.detail-items {
  background-color: #FAFAFA;
  border-radius: 12rpx;
  overflow: hidden;
}

.detail-item-row {
  display: flex;
  align-items: center;
  padding: 16rpx;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
}

.detail-item-index {
  width: 32rpx;
  height: 32rpx;
  background-color: #177DDC;
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-right: 16rpx;
}

.detail-item-info {
  flex: 1;
}

.detail-item-name {
  font-size: 14px;
  color: #000000;
  display: block;
}

.detail-item-spec {
  font-size: 12px;
  color: #8C8C8C;
  margin-top: 4rpx;
}

.detail-item-quantity {
  font-size: 14px;
  color: #595959;
  margin-right: 24rpx;
}

.detail-item-amount {
  font-size: 14px;
  color: #F53F3F;
  font-weight: 500;
}

.detail-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx;
  background-color: #FFFFFF;
  border-top: 2rpx solid #177DDC;
  margin-top: 8rpx;
}

.detail-total-label {
  font-size: 14px;
  color: #8C8C8C;
}

.detail-total-value {
  font-size: 18px;
  color: #F53F3F;
  font-weight: 600;
}

.detail-attachments {
  background-color: #FAFAFA;
  border-radius: 12rpx;
  overflow: hidden;
}

.detail-attachment-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: #F0F0F0;
  }
}

.detail-attachment-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #FFFFFF;
  font-weight: 600;
  margin-right: 16rpx;
}

.detail-attachment-info {
  flex: 1;
}

.detail-attachment-name {
  font-size: 14px;
  color: #000000;
  display: block;
}

.detail-attachment-size {
  font-size: 12px;
  color: #8C8C8C;
  margin-top: 4rpx;
}

.detail-attachment-arrow {
  font-size: 32rpx;
  color: #CCCCCC;
}
</style>