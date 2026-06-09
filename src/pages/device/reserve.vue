<template>
  <view class="device-reserve-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">设备预约</text>
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
    
    <scroll-view class="content-wrapper" scroll-y>
      <!-- 可预约设备列表 -->
      <view v-if="currentTab === 'available'" class="device-list">
        <view 
          v-for="device in availableDevices" 
          :key="device.id" 
          class="device-card"
          @click="showDeviceDetail(device)"
        >
          <view class="device-image">
            <text class="device-icon">{{ device.icon }}</text>
          </view>
          <view class="device-info">
            <text class="device-name">{{ device.name }}</text>
            <text class="device-model">型号：{{ device.model }}</text>
            <view class="device-status">
              <view :class="['status-dot', device.status]"></view>
              <text class="status-text">{{ getStatusText(device.status) }}</text>
            </view>
          </view>
          <view class="device-action">
            <view class="reserve-btn" @click.stop="startReserve(device)">
              <text class="btn-text">预约</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 我的预约 -->
      <view v-if="currentTab === 'my'" class="reserve-list">
        <view 
          v-for="reserve in myReserves" 
          :key="reserve.id" 
          class="reserve-card"
        >
          <view class="card-header">
            <view :class="['status-badge', getStatusClass(reserve.status)]">
              <text class="status-text">{{ reserve.status }}</text>
            </view>
            <text class="reserve-id">预约号：{{ reserve.id }}</text>
          </view>
          
          <view class="device-info-row">
            <view class="device-image">
              <text class="device-icon">{{ reserve.deviceIcon }}</text>
            </view>
            <view class="device-details">
              <text class="device-name">{{ reserve.deviceName }}</text>
              <text class="device-model">{{ reserve.deviceModel }}</text>
            </view>
          </view>
          
          <view class="reserve-info">
            <view class="info-item">
              <text class="info-label">预约时间</text>
              <text class="info-value">{{ reserve.date }} {{ reserve.timeSlot }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">预约时长</text>
              <text class="info-value">{{ reserve.duration }}小时</text>
            </view>
            <view class="info-item">
              <text class="info-label">使用目的</text>
              <text class="info-value">{{ reserve.purpose }}</text>
            </view>
          </view>
          
          <view class="card-actions" v-if="reserve.status === '待使用'">
            <view class="action-btn cancel-btn" @click="cancelReserve(reserve)">
              <text class="btn-text">取消预约</text>
            </view>
          </view>
        </view>
        
        <view v-if="myReserves.length === 0" class="empty-state">
          <text class="empty-text">暂无预约记录</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 设备详情弹窗 -->
    <view class="modal-overlay" v-if="showDeviceModal" @click="closeDeviceModal">
      <view class="modal-content device-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">设备详情</text>
          <text class="modal-close" @click="closeDeviceModal">×</text>
        </view>
        
        <view class="device-detail">
          <view class="detail-image">
            <text class="detail-icon">{{ selectedDevice?.icon }}</text>
          </view>
          <view class="detail-info">
            <text class="detail-name">{{ selectedDevice?.name }}</text>
            <text class="detail-model">型号：{{ selectedDevice?.model }}</text>
            <text class="detail-location">位置：{{ selectedDevice?.location }}</text>
            <text class="detail-desc">{{ selectedDevice?.description }}</text>
          </view>
        </view>
        
        <view class="modal-actions">
          <view class="action-btn reserve-btn-full" @click="startReserve(selectedDevice)">
            <text class="btn-text">立即预约</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 预约表单弹窗 -->
    <view class="modal-overlay" v-if="showReserveModal" @click="closeReserveModal">
      <view class="modal-content reserve-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">预约设备</text>
          <text class="modal-close" @click="closeReserveModal">×</text>
        </view>
        
        <view class="reserve-form">
          <view class="form-item">
            <text class="form-label">设备名称</text>
            <text class="form-value">{{ reserveForm.deviceName }}</text>
          </view>
          
          <view class="form-item" @click="showDatePicker">
            <text class="form-label">预约日期</text>
            <view class="form-value-wrapper">
              <text class="form-value">{{ reserveForm.date || '请选择日期' }}</text>
              <text class="form-arrow">›</text>
            </view>
          </view>
          
          <view class="form-item" @click="showTimePicker">
            <text class="form-label">预约时段</text>
            <view class="form-value-wrapper">
              <text class="form-value">{{ reserveForm.timeSlot || '请选择时段' }}</text>
              <text class="form-arrow">›</text>
            </view>
          </view>
          
          <view class="form-item">
            <text class="form-label">预约时长</text>
            <view class="duration-select">
              <view 
                v-for="d in durationOptions" 
                :key="d.value"
                :class="['duration-item', { active: reserveForm.duration === d.value }]"
                @click="reserveForm.duration = d.value"
              >
                <text class="duration-text">{{ d.label }}</text>
              </view>
            </view>
          </view>
          
          <view class="form-item">
            <text class="form-label">使用目的</text>
            <textarea 
              class="form-textarea"
              v-model="reserveForm.purpose"
              placeholder="请输入使用目的"
              :maxlength="200"
            />
          </view>
        </view>
        
        <view class="modal-actions">
          <view class="action-btn confirm-btn" @click="submitReserve">
            <text class="btn-text">确认预约</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 日期选择弹窗 -->
    <view class="modal-overlay" v-if="showDatePickerModal" @click="showDatePickerModal = false">
      <view class="modal-content picker-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择日期</text>
        </view>
        <scroll-view class="picker-list" scroll-y>
          <view 
            v-for="date in availableDates" 
            :key="date.value"
            :class="['picker-item', { active: reserveForm.date === date.label }]"
            @click="selectDate(date)"
          >
            <text class="picker-text">{{ date.label }}</text>
            <view v-if="reserveForm.date === date.label" class="picker-check">✓</view>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <!-- 时段选择弹窗 -->
    <view class="modal-overlay" v-if="showTimePickerModal" @click="showTimePickerModal = false">
      <view class="modal-content picker-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择时段</text>
        </view>
        <scroll-view class="picker-list" scroll-y>
          <view 
            v-for="time in timeSlots" 
            :key="time.value"
            :class="['picker-item', { active: reserveForm.timeSlot === time.label, disabled: !time.available }]"
            @click="time.available && selectTime(time)"
          >
            <text class="picker-text" :class="{ 'text-disabled': !time.available }">
              {{ time.label }}{{ !time.available ? ' (已满)' : '' }}
            </text>
            <view v-if="reserveForm.timeSlot === time.label" class="picker-check">✓</view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const tabs = ref([
  { key: 'available', label: '可预约', count: 0 },
  { key: 'my', label: '我的预约', count: 2 }
])

const currentTab = ref('available')
const showDeviceModal = ref(false)
const showReserveModal = ref(false)
const showDatePickerModal = ref(false)
const showTimePickerModal = ref(false)
const selectedDevice = ref(null)

const reserveForm = reactive({
  deviceId: '',
  deviceName: '',
  deviceModel: '',
  deviceIcon: '',
  date: '',
  timeSlot: '',
  duration: 2,
  purpose: ''
})

const durationOptions = [
  { value: 1, label: '1小时' },
  { value: 2, label: '2小时' },
  { value: 4, label: '4小时' },
  { value: 8, label: '8小时' }
]

const availableDates = [
  { value: 1, label: '今天' },
  { value: 2, label: '明天' },
  { value: 3, label: '后天' },
  { value: 4, label: getDateStr(3) },
  { value: 5, label: getDateStr(4) },
  { value: 6, label: getDateStr(5) },
  { value: 7, label: getDateStr(6) }
]

const timeSlots = [
  { value: 1, label: '08:00-10:00', available: true },
  { value: 2, label: '10:00-12:00', available: true },
  { value: 3, label: '14:00-16:00', available: false },
  { value: 4, label: '16:00-18:00', available: true },
  { value: 5, label: '19:00-21:00', available: true }
]

const availableDevices = ref([
  {
    id: 1,
    name: 'PCR仪',
    model: 'AB-9700',
    icon: '🔬',
    status: 'available',
    location: '实验室A-201',
    description: '用于基因扩增和检测实验，支持96孔板，快速PCR模式'
  },
  {
    id: 2,
    name: '高速冷冻离心机',
    model: 'SIGMA 3-30K',
    icon: '🧪',
    status: 'available',
    location: '实验室A-202',
    description: '最高转速15000rpm，温控范围-10°C至40°C'
  },
  {
    id: 3,
    name: '荧光显微镜',
    model: 'Olympus BX53',
    icon: '🔍',
    status: 'busy',
    location: '实验室B-101',
    description: '配备多种滤光片，支持明场、暗场、荧光观察'
  },
  {
    id: 4,
    name: '超低温冰箱',
    model: 'Thermo TSX500',
    icon: '❄️',
    status: 'available',
    location: '实验室A-101',
    description: '温度范围-50°C至-86°C，样品存储容量大'
  },
  {
    id: 5,
    name: '酶标仪',
    model: 'BioTek Synergy H1',
    icon: '📊',
    status: 'available',
    location: '实验室B-205',
    description: '支持光吸收、荧光、化学发光检测'
  },
  {
    id: 6,
    name: '流式细胞仪',
    model: 'BD FACSCanto II',
    icon: '💉',
    status: 'maintenance',
    location: '实验室C-301',
    description: '8色荧光检测，用于细胞分析分选'
  }
])

const myReserves = ref([
  {
    id: 'RES2024011501',
    deviceName: 'PCR仪',
    deviceModel: 'AB-9700',
    deviceIcon: '🔬',
    date: '2024-01-18',
    timeSlot: '14:00-16:00',
    duration: 2,
    purpose: '基因扩增实验',
    status: '待使用'
  },
  {
    id: 'RES2024011402',
    deviceName: '高速冷冻离心机',
    deviceModel: 'SIGMA 3-30K',
    deviceIcon: '🧪',
    date: '2024-01-17',
    timeSlot: '10:00-12:00',
    duration: 2,
    purpose: '蛋白质分离纯化',
    status: '已完成'
  }
])

function getDateStr(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const switchTab = (key) => {
  currentTab.value = key
}

const getStatusText = (status) => {
  const map = {
    available: '空闲',
    busy: '使用中',
    maintenance: '维护中'
  }
  return map[status] || '未知'
}

const getStatusClass = (status) => {
  const map = {
    '待使用': 'status-pending',
    '已完成': 'status-done',
    '已取消': 'status-cancelled'
  }
  return map[status] || 'status-pending'
}

const showDeviceDetail = (device) => {
  selectedDevice.value = device
  showDeviceModal.value = true
}

const closeDeviceModal = () => {
  showDeviceModal.value = false
}

const startReserve = (device) => {
  closeDeviceModal()
  selectedDevice.value = device
  reserveForm.deviceId = device.id
  reserveForm.deviceName = device.name
  reserveForm.deviceModel = device.model
  reserveForm.deviceIcon = device.icon
  reserveForm.date = ''
  reserveForm.timeSlot = ''
  reserveForm.duration = 2
  reserveForm.purpose = ''
  showReserveModal.value = true
}

const closeReserveModal = () => {
  showReserveModal.value = false
}

const showDatePicker = () => {
  showDatePickerModal.value = true
}

const showTimePicker = () => {
  showTimePickerModal.value = true
}

const selectDate = (date) => {
  reserveForm.date = date.label
  showDatePickerModal.value = false
}

const selectTime = (time) => {
  if (time.available) {
    reserveForm.timeSlot = time.label
    showTimePickerModal.value = false
  }
}

const submitReserve = () => {
  if (!reserveForm.date) {
    uni.showToast({ title: '请选择预约日期', icon: 'none' })
    return
  }
  if (!reserveForm.timeSlot) {
    uni.showToast({ title: '请选择预约时段', icon: 'none' })
    return
  }
  if (!reserveForm.purpose.trim()) {
    uni.showToast({ title: '请输入使用目的', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '提交中...' })
  
  setTimeout(() => {
    uni.hideLoading()
    
    const newReserve = {
      id: `RES${Date.now()}`,
      deviceName: reserveForm.deviceName,
      deviceModel: reserveForm.deviceModel,
      deviceIcon: reserveForm.deviceIcon,
      date: reserveForm.date,
      timeSlot: reserveForm.timeSlot,
      duration: reserveForm.duration,
      purpose: reserveForm.purpose,
      status: '待使用'
    }
    
    myReserves.value.unshift(newReserve)
    
    const myTab = tabs.value.find(t => t.key === 'my')
    if (myTab) {
      myTab.count++
    }
    
    closeReserveModal()
    
    uni.showToast({
      title: '预约成功',
      icon: 'success',
      duration: 2000
    })
    
    setTimeout(() => {
      switchTab('my')
    }, 1500)
  }, 800)
}

const cancelReserve = (reserve) => {
  uni.showModal({
    title: '确认取消',
    content: '确定要取消这个预约吗？',
    success: (res) => {
      if (res.confirm) {
        const index = myReserves.value.findIndex(r => r.id === reserve.id)
        if (index !== -1) {
          myReserves.value.splice(index, 1)
          
          const myTab = tabs.value.find(t => t.key === 'my')
          if (myTab && myTab.count > 0) {
            myTab.count--
          }
          
          uni.showToast({
            title: '已取消预约',
            icon: 'success',
            duration: 2000
          })
        }
      }
    }
  })
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.device-reserve-page {
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

.device-list {
  padding: 24rpx;
}

.device-card {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.device-image {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.device-icon {
  font-size: 60rpx;
}

.device-info {
  flex: 1;
}

.device-name {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  display: block;
  margin-bottom: 8rpx;
}

.device-model {
  font-size: 26rpx;
  color: #8C8C8C;
  display: block;
  margin-bottom: 12rpx;
}

.device-status {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  margin-right: 8rpx;
}

.status-dot.available {
  background-color: #49AA19;
}

.status-dot.busy {
  background-color: #D89614;
}

.status-dot.maintenance {
  background-color: #8C8C8C;
}

.status-text {
  font-size: 14px;
  color: #595959;
}

.device-action {
  margin-left: 24rpx;
}

.reserve-btn {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  border-radius: 12rpx;
  padding: 16rpx 32rpx;
}

.reserve-btn .btn-text {
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 500;
}

.reserve-list {
  padding: 24rpx;
}

.reserve-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.card-header {
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

.reserve-id {
  font-size: 14px;
  color: #B2B2B2;
}

.device-info-row {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.device-details {
  flex: 1;
}

.device-details .device-name {
  margin-bottom: 8rpx;
}

.device-details .device-model {
  margin-bottom: 0;
}

.reserve-info {
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 0 16rpx;
  
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

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #F0F0F0;
}

.action-btn {
  padding: 16rpx 32rpx;
  border-radius: 12rpx;
}

.action-btn.cancel-btn {
  background-color: #F5F5F5;
  
  .btn-text {
    color: #8C8C8C;
    font-size: 28rpx;
  }
}

.action-btn.confirm-btn {
  flex: 1;
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .btn-text {
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: 500;
  }
}

.action-btn.reserve-btn-full {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
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

.device-modal {
  .modal-content {
    padding: 32rpx;
  }
}

.device-detail {
  padding: 32rpx;
}

.detail-image {
  width: 200rpx;
  height: 200rpx;
  background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32rpx;
}

.detail-icon {
  font-size: 100rpx;
}

.detail-info {
  text-align: center;
}

.detail-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #000000;
  display: block;
  margin-bottom: 16rpx;
}

.detail-model,
.detail-location {
  font-size: 28rpx;
  color: #8C8C8C;
  display: block;
  margin-bottom: 8rpx;
}

.detail-desc {
  font-size: 28rpx;
  color: #595959;
  display: block;
  margin-top: 16rpx;
  line-height: 1.5;
}

.modal-actions {
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #F0F0F0;
}

.reserve-form {
  padding: 24rpx;
}

.form-item {
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 28rpx;
  color: #8C8C8C;
  margin-bottom: 12rpx;
}

.form-value-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-value {
  font-size: 30rpx;
  color: #333333;
  flex: 1;
}

.form-arrow {
  font-size: 32rpx;
  color: #B2B2B2;
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

.duration-select {
  display: flex;
  gap: 16rpx;
}

.duration-item {
  flex: 1;
  height: 72rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.active {
    background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
    
    .duration-text {
      color: #FFFFFF;
    }
  }
}

.duration-text {
  font-size: 26rpx;
  color: #595959;
}

.picker-modal {
  max-height: 60vh;
}

.picker-list {
  max-height: 50vh;
  padding: 0 32rpx;
}

.picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.active {
    background-color: #F5F9FF;
  }
  
  &.disabled {
    opacity: 0.5;
  }
}

.picker-text {
  font-size: 30rpx;
  color: #333333;
  
  &.text-disabled {
    color: #B2B2B2;
  }
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
