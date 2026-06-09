<template>
  <view class="supply-receive-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">领取耗材</text>
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
      </view>
    </view>
    
    <scroll-view class="content-wrapper" scroll-y>
      <!-- 耗材列表 -->
      <view v-if="currentTab === 'list'" class="supply-list">
        <view class="search-bar">
          <view class="search-input-wrapper">
            <text class="search-icon">🔍</text>
            <input 
              class="search-input" 
              type="text" 
              placeholder="搜索耗材名称" 
              v-model="searchKeyword"
            />
          </view>
        </view>
        
        <view class="category-filter">
          <view 
            v-for="cat in categories" 
            :key="cat"
            :class="['category-item', { active: selectedCategory === cat }]"
            @click="selectedCategory = cat"
          >
            <text class="category-text">{{ cat }}</text>
          </view>
        </view>
        
        <view 
          v-for="supply in filteredSupplies" 
          :key="supply.id" 
          class="supply-card"
          @click="showSupplyDetail(supply)"
        >
          <view class="supply-icon-wrapper">
            <text class="supply-icon">{{ supply.icon }}</text>
          </view>
          <view class="supply-info">
            <text class="supply-name">{{ supply.name }}</text>
            <text class="supply-category">{{ supply.category }}</text>
            <view class="supply-stock-row">
              <text class="stock-label">库存：</text>
              <text :class="['stock-value', { warning: supply.stock <= supply.warningThreshold }]">
                {{ supply.stock }} {{ supply.unit }}
              </text>
              <text v-if="supply.stock <= supply.warningThreshold" class="stock-warning">库存不足</text>
            </view>
          </view>
          <view class="supply-action">
            <view class="receive-btn" @click.stop="openReceiveModal(supply)">
              <text class="btn-text">领取</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 我的领取记录 -->
      <view v-if="currentTab === 'records'" class="records-list">
        <view 
          v-for="record in myRecords" 
          :key="record.id" 
          class="record-card"
        >
          <view class="record-header">
            <view :class="['status-badge', getStatusClass(record.status)]">
              <text class="status-text">{{ record.status }}</text>
            </view>
            <text class="record-time">{{ record.time }}</text>
          </view>
          
          <view class="record-info-row">
            <text class="record-icon">{{ getSupplyIcon(record.supplyId) }}</text>
            <view class="record-details">
              <text class="record-name">{{ record.supplyName }}</text>
              <text class="record-quantity">数量：{{ record.quantity }} {{ record.unit }}</text>
            </view>
          </view>
          
          <view class="record-meta">
            <view class="meta-item">
              <text class="meta-label">关联项目</text>
              <text class="meta-value">{{ record.project }}</text>
            </view>
            <view class="meta-item">
              <text class="meta-label">使用目的</text>
              <text class="meta-value">{{ record.purpose }}</text>
            </view>
          </view>
          
          <view class="record-actions" v-if="record.status === '待领取'">
            <view class="action-btn confirm-btn" @click="confirmReceive(record)">
              <text class="btn-text">确认领取</text>
            </view>
            <view class="action-btn cancel-btn" @click="cancelRecord(record)">
              <text class="btn-text">取消</text>
            </view>
          </view>
        </view>
        
        <view v-if="myRecords.length === 0" class="empty-state">
          <text class="empty-icon">📦</text>
          <text class="empty-text">暂无领取记录</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 耗材详情弹窗 -->
    <view class="modal-overlay" v-if="showDetailModal" @click="closeDetailModal">
      <view class="modal-content detail-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">耗材详情</text>
          <text class="modal-close" @click="closeDetailModal">×</text>
        </view>
        
        <view class="detail-content">
          <view class="detail-icon-wrapper">
            <text class="detail-icon">{{ selectedSupply?.icon }}</text>
          </view>
          <view class="detail-info">
            <text class="detail-name">{{ selectedSupply?.name }}</text>
            <text class="detail-category">{{ selectedSupply?.category }}</text>
            <view class="detail-row">
              <text class="detail-label">库存数量</text>
              <text class="detail-value">{{ selectedSupply?.stock }} {{ selectedSupply?.unit }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">存放位置</text>
              <text class="detail-value">{{ selectedSupply?.location }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">预警阈值</text>
              <text class="detail-value">{{ selectedSupply?.warningThreshold }} {{ selectedSupply?.unit }}</text>
            </view>
          </view>
        </view>
        
        <view class="modal-actions">
          <view class="action-btn primary-btn" @click="openReceiveModal(selectedSupply)">
            <text class="btn-text">立即领取</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 领取申请弹窗 -->
    <view class="modal-overlay" v-if="showReceiveModal" @click="closeReceiveModal">
      <view class="modal-content receive-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">领取申请</text>
          <text class="modal-close" @click="closeReceiveModal">×</text>
        </view>
        
        <view class="receive-form">
          <view class="form-item">
            <text class="form-label">耗材名称</text>
            <text class="form-value">{{ receiveForm.supplyName }}</text>
          </view>
          
          <view class="form-item">
            <text class="form-label">当前库存</text>
            <text class="form-value">{{ receiveForm.stock }} {{ receiveForm.unit }}</text>
          </view>
          
          <view class="form-item">
            <text class="form-label">领取数量</text>
            <view class="quantity-input-wrapper">
              <view class="quantity-btn minus" @click="decreaseQuantity">
                <text class="quantity-btn-text">−</text>
              </view>
              <input 
                class="quantity-input" 
                type="number" 
                v-model="receiveForm.quantity"
                :min="1"
                :max="receiveForm.stock"
              />
              <view class="quantity-btn plus" @click="increaseQuantity">
                <text class="quantity-btn-text">+</text>
              </view>
            </view>
          </view>
          
          <view class="form-item" @click="showProjectPicker">
            <text class="form-label">关联项目</text>
            <text class="form-value picker-value">{{ receiveForm.project || '请选择项目' }}</text>
            <text class="form-arrow">›</text>
          </view>
          
          <view class="form-item">
            <text class="form-label">使用目的</text>
            <textarea 
              class="form-textarea"
              v-model="receiveForm.purpose"
              placeholder="请输入使用目的（必填）"
              :maxlength="200"
            />
          </view>
        </view>
        
        <view class="modal-actions">
          <view class="action-btn primary-btn" @click="submitReceive">
            <text class="btn-text">提交申请</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 项目选择弹窗 -->
    <view class="modal-overlay" v-if="showProjectModal" @click="showProjectModal = false">
      <view class="modal-content picker-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择项目</text>
        </view>
        <scroll-view class="picker-list" scroll-y>
          <view 
            v-for="project in projects" 
            :key="project.id"
            :class="['picker-item', { active: receiveForm.project === project.name }]"
            @click="selectProject(project)"
          >
            <text class="picker-text">{{ project.name }}</text>
            <text class="picker-status">{{ project.status }}</text>
            <view v-if="receiveForm.project === project.name" class="picker-check">✓</view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const tabs = ref([
  { key: 'list', label: '耗材列表' },
  { key: 'records', label: '我的领取' }
])

const currentTab = ref('list')
const searchKeyword = ref('')
const selectedCategory = ref('全部')
const showDetailModal = ref(false)
const showReceiveModal = ref(false)
const showProjectModal = ref(false)
const selectedSupply = ref(null)

const categories = ['全部', '防护用品', '实验耗材', '试剂类', '办公用品']

const supplies = computed(() => store.getters.supplies)
const projects = computed(() => store.getters.projects)
const supplyRecords = computed(() => store.getters.supplyRecords)
const user = computed(() => store.getters.user)

const myRecords = computed(() => {
  return supplyRecords.value.filter(r => r.applicant === user.value.name)
})

const filteredSupplies = computed(() => {
  let result = supplies.value
  
  if (selectedCategory.value !== '全部') {
    result = result.filter(s => s.category === selectedCategory.value)
  }
  
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(s => s.name.toLowerCase().includes(keyword))
  }
  
  return result
})

const receiveForm = reactive({
  supplyId: null,
  supplyName: '',
  stock: 0,
  unit: '',
  quantity: 1,
  project: '',
  purpose: ''
})

const switchTab = (key) => {
  currentTab.value = key
}

const goBack = () => {
  uni.navigateBack()
}

const showSupplyDetail = (supply) => {
  selectedSupply.value = supply
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
}

const openReceiveModal = (supply) => {
  closeDetailModal()
  selectedSupply.value = supply
  receiveForm.supplyId = supply.id
  receiveForm.supplyName = supply.name
  receiveForm.stock = supply.stock
  receiveForm.unit = supply.unit
  receiveForm.quantity = 1
  receiveForm.project = ''
  receiveForm.purpose = ''
  showReceiveModal.value = true
}

const closeReceiveModal = () => {
  showReceiveModal.value = false
}

const decreaseQuantity = () => {
  if (receiveForm.quantity > 1) {
    receiveForm.quantity--
  }
}

const increaseQuantity = () => {
  if (receiveForm.quantity < receiveForm.stock) {
    receiveForm.quantity++
  }
}

const showProjectPicker = () => {
  showProjectModal.value = true
}

const selectProject = (project) => {
  receiveForm.project = project.name
  showProjectModal.value = false
}

const getSupplyIcon = (supplyId) => {
  const supply = supplies.value.find(s => s.id === supplyId)
  return supply?.icon || '📦'
}

const getStatusClass = (status) => {
  const map = {
    '待领取': 'status-pending',
    '已领取': 'status-done',
    '已取消': 'status-cancelled'
  }
  return map[status] || 'status-pending'
}

const submitReceive = () => {
  if (receiveForm.quantity > receiveForm.stock) {
    uni.showToast({ title: '领取数量超过库存', icon: 'none' })
    return
  }
  
  if (!receiveForm.project) {
    uni.showToast({ title: '请选择关联项目', icon: 'none' })
    return
  }
  
  if (!receiveForm.purpose.trim()) {
    uni.showToast({ title: '请填写使用目的', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '提交中...' })
  
  setTimeout(() => {
    uni.hideLoading()
    
    const newRecord = {
      id: Date.now(),
      supplyId: receiveForm.supplyId,
      supplyName: receiveForm.supplyName,
      quantity: receiveForm.quantity,
      unit: receiveForm.unit,
      applicant: user.value.name,
      department: user.value.department,
      project: receiveForm.project,
      purpose: receiveForm.purpose,
      status: '待领取',
      time: formatTime(new Date())
    }
    
    store.commit('ADD_SUPPLY_RECORD', newRecord)
    store.commit('UPDATE_SUPPLY_STOCK', { 
      supplyId: receiveForm.supplyId, 
      quantity: receiveForm.quantity 
    })
    
    closeReceiveModal()
    
    uni.showToast({
      title: '申请已提交',
      icon: 'success',
      duration: 2000
    })
    
    setTimeout(() => {
      switchTab('records')
    }, 1500)
  }, 800)
}

const confirmReceive = (record) => {
  uni.showModal({
    title: '确认领取',
    content: `确认领取 ${record.supplyName} ${record.quantity}${record.unit}？`,
    success: (res) => {
      if (res.confirm) {
        store.commit('UPDATE_SUPPLY_RECORD_STATUS', { 
          recordId: record.id, 
          status: '已领取' 
        })
        
        uni.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  })
}

const cancelRecord = (record) => {
  uni.showModal({
    title: '取消申请',
    content: '确定要取消这个领取申请吗？',
    success: (res) => {
      if (res.confirm) {
        store.commit('UPDATE_SUPPLY_RECORD_STATUS', { 
          recordId: record.id, 
          status: '已取消' 
        })
        
        // 恢复库存
        store.commit('UPDATE_SUPPLY_STOCK', { 
          supplyId: record.supplyId, 
          quantity: -record.quantity 
        })
        
        uni.showToast({
          title: '已取消申请',
          icon: 'success',
          duration: 2000
        })
      }
    }
  })
}

function formatTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}
</script>

<style lang="scss" scoped>
.supply-receive-page {
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

.content-wrapper {
  padding-top: 92px;
  padding-bottom: 24px;
  height: calc(100vh - 92px);
}

.supply-list {
  padding: 24rpx;
}

.search-bar {
  margin-bottom: 20rpx;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

.category-filter {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.category-item {
  padding: 16rpx 28rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  flex-shrink: 0;
  border: none;
  
  &.active {
    background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
    
    .category-text {
      color: #FFFFFF;
    }
  }
}

.category-text {
  font-size: 26rpx;
  color: #595959;
}

.supply-card {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.supply-icon-wrapper {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.supply-icon {
  font-size: 48rpx;
}

.supply-info {
  flex: 1;
}

.supply-name {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  display: block;
  margin-bottom: 8rpx;
}

.supply-category {
  font-size: 14px;
  color: #8C8C8C;
  display: block;
  margin-bottom: 12rpx;
}

.supply-stock-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 14px;
}

.stock-label {
  font-size: 14px;
  color: #8C8C8C;
}

.stock-value {
  font-size: 14px;
  color: #49AA19;
  
  &.warning {
    color: #F53F3F;
  }
}

.stock-warning {
  font-size: 22rpx;
  color: #F53F3F;
  background-color: #FFF1F0;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.supply-action {
  margin-left: 24rpx;
}

.receive-btn {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  border-radius: 12rpx;
  padding: 16rpx 32rpx;
}

.receive-btn .btn-text {
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 500;
}

.records-list {
  padding: 24rpx;
}

.record-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.status-badge.status-pending {
  background-color: #FFF7E6;
  color: #D89614;
}

.status-badge.status-done {
  background-color: #F6FFED;
  color: #49AA19;
}

.status-badge.status-cancelled {
  background-color: #F5F5F5;
  color: #8C8C8C;
}

.record-time {
  font-size: 24rpx;
  color: #B2B2B2;
}

.record-info-row {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.record-icon {
  font-size: 60rpx;
  margin-right: 24rpx;
}

.record-details {
  flex: 1;
}

.record-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
  display: block;
  margin-bottom: 8rpx;
}

.record-quantity {
  font-size: 26rpx;
  color: #595959;
}

.record-meta {
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 20rpx;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  
  &:not(:last-child) {
    border-bottom: 1rpx solid #F0F0F0;
  }
}

.meta-label {
  font-size: 26rpx;
  color: #8C8C8C;
}

.meta-value {
  font-size: 26rpx;
  color: #333333;
}

.record-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #F0F0F0;
}

.action-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-btn {
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
  
  .btn-text {
    color: #FFFFFF;
    font-size: 28rpx;
    font-weight: 500;
  }
}

.cancel-btn {
  background-color: #F5F5F5;
  
  .btn-text {
    color: #8C8C8C;
    font-size: 28rpx;
  }
}

.primary-btn {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  
  .btn-text {
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: 500;
  }
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
  width: 650rpx;
  max-height: 80vh;
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

.detail-content {
  padding: 32rpx;
}

.detail-icon-wrapper {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32rpx;
}

.detail-icon {
  font-size: 60rpx;
}

.detail-info {
  text-align: center;
}

.detail-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #000000;
  display: block;
  margin-bottom: 12rpx;
}

.detail-category {
  font-size: 26rpx;
  color: #8C8C8C;
  display: block;
  margin-bottom: 24rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
}

.detail-label {
  font-size: 28rpx;
  color: #8C8C8C;
}

.detail-value {
  font-size: 28rpx;
  color: #333333;
}

.modal-actions {
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #F0F0F0;
}

.receive-form {
  padding: 24rpx;
}

.form-item {
  margin-bottom: 24rpx;
}

.form-label {
  font-size: 28rpx;
  color: #8C8C8C;
  display: block;
  margin-bottom: 12rpx;
}

.form-value {
  font-size: 30rpx;
  color: #333333;
}

.picker-value {
  color: #177DDC;
}

.form-arrow {
  font-size: 32rpx;
  color: #B2B2B2;
  margin-left: auto;
}

.quantity-input-wrapper {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.quantity-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F5F5F5;
  
  &.minus {
    background-color: #F5F5F5;
  }
  
  &.plus {
    background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
    
    .quantity-btn-text {
      color: #FFFFFF;
    }
  }
}

.quantity-btn-text {
  font-size: 32rpx;
  color: #595959;
  font-weight: 600;
}

.quantity-input {
  width: 120rpx;
  height: 64rpx;
  text-align: center;
  font-size: 32rpx;
  color: #333333;
  background-color: #FAFAFA;
  border-radius: 12rpx;
}

.form-textarea {
  width: 100%;
  height: 160rpx;
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
}

.picker-modal {
  max-height: 60vh;
}

.picker-list {
  max-height: 50vh;
  padding: 0;
}

.picker-item {
  display: flex;
  align-items: center;
  height: 88rpx;
  border-bottom: 1rpx solid #F0F0F0;
  padding: 0 16px;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.active {
    background-color: #F5F9FF;
  }
}

.picker-text {
  flex: 1;
  font-size: 30rpx;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.picker-status {
  font-size: 24rpx;
  color: #8C8C8C;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.picker-check {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #177DDC;
  color: #FFFFFF;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>