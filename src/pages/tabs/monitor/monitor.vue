<template>
  <view class="monitor-page">
    <view class="page-header">
      <text class="page-title">物联监控</text>
    </view>
    
    <view class="card">
      <view class="card-header">
        <text class="card-title">温湿度监控</text>
      </view>
      <view class="temp-list">
        <view 
          v-for="item in temperatureData" 
          :key="item.location" 
          class="temp-item"
        >
          <view class="temp-header">
            <text class="temp-location">{{ item.location }}</text>
            <view :class="['temp-status', item.status]">
              {{ item.status === 'normal' ? '正常' : item.status === 'warning' ? '预警' : '危险' }}
            </view>
          </view>
          <view class="temp-values">
            <view class="value-item">
              <text class="value-icon">🌡</text>
              <view class="value-content">
                <text class="value-num" :class="{ 'value-warning': item.status !== 'normal' }">
                  {{ item.temperature }}°C
                </text>
                <text class="value-label">温度</text>
              </view>
            </view>
            <view class="value-item">
              <text class="value-icon">💧</text>
              <view class="value-content">
                <text class="value-num">{{ item.humidity }}%</text>
                <text class="value-label">湿度</text>
              </view>
            </view>
          </view>
          <view class="temp-bar">
            <view 
              class="bar-fill" 
              :style="{ width: getBarWidth(item.temperature) + '%' }"
              :class="item.status"
            ></view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="card">
      <view class="card-header">
        <text class="card-title">设备状态监控</text>
      </view>
      <view class="device-grid">
        <view 
          v-for="device in devices" 
          :key="device.id" 
          class="device-card"
          @click="viewDeviceDetail(device)"
        >
          <view class="device-header">
            <view :class="['device-status-dot', device.status.toLowerCase().replace('中', '')]"></view>
            <text class="device-name">{{ device.name }}</text>
          </view>
          <view class="device-info">
            <text class="device-location">{{ device.location }}</text>
            <text class="device-update">更新: {{ device.lastUpdate }}</text>
          </view>
          <view class="device-status-text" :class="getStatusClass(device.status)">
            {{ device.status }}
          </view>
        </view>
      </view>
    </view>
    
    <view class="card">
      <view class="card-header">
        <text class="card-title">报警信息</text>
        <text class="alarm-count">{{ alarmList.length }}</text>
      </view>
      <view class="alarm-list">
        <view 
          v-for="alarm in alarmList" 
          :key="alarm.id" 
          class="alarm-item"
          @click="handleAlarm(alarm)"
        >
          <view :class="['alarm-icon', alarm.level]"></view>
          <view class="alarm-content">
            <text class="alarm-title">{{ alarm.title }}</text>
            <text class="alarm-desc">{{ alarm.description }}</text>
            <text class="alarm-time">{{ alarm.time }}</text>
          </view>
          <view :class="['alarm-badge', alarm.level]">处理</view>
        </view>
      </view>
    </view>
    
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const autoRefresh = ref(true)
const alarmList = ref([
  { id: 1, level: 'danger', title: '温度异常', description: '实验室C301温度达到35.2°C，超过安全阈值', time: '5分钟前' },
  { id: 2, level: 'warning', title: '湿度预警', description: '实验室A102湿度65%，接近上限', time: '15分钟前' },
  { id: 3, level: 'warning', title: '设备离线', description: 'PCR仪离线超过2小时', time: '2小时前' },
  { id: 4, level: 'danger', title: '设备故障', description: '质谱仪检测到故障，已自动停机', time: '1小时前' }
])

const temperatureData = ref([
  { location: '实验室A101', temperature: 24.5, humidity: 45, status: 'normal' },
  { location: '实验室C301', temperature: 35.2, humidity: 58, status: 'danger' },
  { location: '库房B区', temperature: 22.1, humidity: 62, status: 'normal' },
  { location: '培养室', temperature: 37.0, humidity: 95, status: 'warning' }
])

const devices = ref(store.getters.devices.map(d => ({
  ...d,
  location: '实验室A区',
  lastUpdate: '5分钟前'
})))

let refreshTimer = null

const getBarWidth = (temp) => {
  return Math.min((temp / 40) * 100, 100)
}

const getStatusClass = (status) => {
  const statusMap = {
    '运行中': 'status-running',
    '在线': 'status-online',
    '故障': 'status-error',
    '离线': 'status-offline'
  }
  return statusMap[status] || 'status-offline'
}

const refreshData = () => {
  uni.showToast({
    title: '数据已刷新',
    icon: 'none',
    duration: 1500
  })
}

const toggleAutoRefresh = (e) => {
  autoRefresh.value = e.detail.value
  if (autoRefresh.value) {
    startRefreshTimer()
  } else {
    clearInterval(refreshTimer)
  }
}

const startRefreshTimer = () => {
  refreshTimer = setInterval(() => {
    refreshData()
  }, 10000)
}

const viewDeviceDetail = (device) => {
  uni.navigateTo({ url: `/pages/device/detail?id=${device.id}` })
}

const handleAlarm = (alarm) => {
  uni.showToast({
    title: `已处理: ${alarm.title}`,
    icon: 'success',
    duration: 1500
  })
}

onMounted(() => {
  if (autoRefresh.value) {
    startRefreshTimer()
  }
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style lang="scss" scoped>
.monitor-page {
  min-height: 100vh;
  background-color: #F7F7F7;
  padding-bottom: 12px;
  padding-top: 64px;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, #43E97B 0%, #38F9D7 100%);
  padding: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.page-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
}

.refresh-icon {
  font-size: 24rpx;
  color: #FFFFFF;
}

.refresh-text {
  font-size: 24rpx;
  color: #FFFFFF;
}

.auto-refresh {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.auto-refresh-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.monitor-page .card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  margin: 24rpx;
  padding: 16px;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.monitor-page .card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  height: 28px;
}

.monitor-page .card .card-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

.alarm-count {
  font-size: 28rpx;
  font-weight: 600;
  color: #F53F3F;
}

.temp-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.monitor-page .card .temp-item {
  padding: 12px;
  background-color: #FAFAFA;
  border-radius: 16rpx;
}

.temp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.monitor-page .card .temp-location {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}

.temp-status {
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.temp-status.normal {
  background-color: #E8F5E9;
  color: #49AA19;
}

.temp-status.warning {
  background-color: #FFF8E1;
  color: #D89614;
}

.temp-status.danger {
  background-color: #FFF5F5;
  color: #F53F3F;
}

.temp-values {
  display: flex;
  gap: 32rpx;
  margin-bottom: 16rpx;
}

.value-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.value-icon {
  font-size: 36rpx;
}

.value-content {
  display: flex;
  flex-direction: column;
}

.monitor-page .card .value-num {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
}

.value-num.value-warning {
  color: #F53F3F;
}

.monitor-page .card .value-label {
  font-size: 12px;
  color: #8C8C8C;
}

.temp-bar {
  height: 8rpx;
  background-color: #E5E5E5;
  border-radius: 4rpx;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4rpx;
  transition: width 0.3s;
}

.bar-fill.normal {
  background-color: #49AA19;
}

.bar-fill.warning {
  background-color: #D89614;
}

.bar-fill.danger {
  background-color: #F53F3F;
}

.device-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.device-card {
  background-color: #FAFAFA;
  border-radius: 16rpx;
  padding: 20rpx;
}

.device-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.device-status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
}

.device-status-dot.运行 {
  background-color: #177DDC;
}

.device-status-dot.在线 {
  background-color: #49AA19;
}

.device-status-dot.故障 {
  background-color: #F53F3F;
}

.device-status-dot.离线 {
  background-color: #B2B2B2;
}

.device-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #000000;
}

.device-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  margin-bottom: 12rpx;
}

.monitor-page .card .device-location {
  font-size: 14px;
  color: #8C8C8C;
}

.monitor-page .card .device-update {
  font-size: 12px;
  color: #B2B2B2;
}

.device-status-text {
  font-size: 22rpx;
  padding: 6rpx 12rpx;
  border-radius: 16rpx;
  width: fit-content;
}

.status-running {
  background-color: #E8F4FF;
  color: #177DDC;
}

.status-online {
  background-color: #E8F5E9;
  color: #49AA19;
}

.status-error {
  background-color: #FFF5F5;
  color: #F53F3F;
}

.status-offline {
  background-color: #F5F5F5;
  color: #8C8C8C;
}

.alarm-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.monitor-page .card .alarm-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12px;
  background-color: #FAFAFA;
  border-radius: 16rpx;
}

.alarm-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
}

.alarm-icon.danger {
  background-color: #FFF5F5;
}

.alarm-icon.warning {
  background-color: #FFF8E1;
}

.alarm-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.alarm-title {
  font-size: 26rpx;
  font-weight: 500;
  color: #000000;
}

.monitor-page .card .alarm-desc {
  font-size: 14px;
  color: #8C8C8C;
}

.monitor-page .card .alarm-time {
  font-size: 12px;
  color: #B2B2B2;
}

.alarm-badge {
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
}

.alarm-badge.danger {
  background-color: #F53F3F;
  color: #FFFFFF;
}

.alarm-badge.warning {
  background-color: #D89614;
  color: #FFFFFF;
}
</style>
