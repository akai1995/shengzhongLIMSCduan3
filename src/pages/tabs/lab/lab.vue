<template>
  <view class="lab-page">
    <view class="page-header">
      <text class="page-title">实验室业务</text>
    </view>
    
    <view class="lab-menu">
      <view 
        v-for="menu in menuList" 
        :key="menu.key" 
        class="menu-item"
        @click="navigateTo(menu.url)"
      >
        <view :class="['menu-icon', menu.key]">
          <text class="icon-text">{{ menu.icon }}</text>
        </view>
        <text class="menu-label">{{ menu.label }}</text>
      </view>
    </view>
    
    <view class="card">
      <view class="card-header">
        <text class="card-title">设备状态</text>
        <text class="card-more">查看全部 ›</text>
      </view>
      <view class="device-list">
        <view 
          v-for="device in devices.slice(0, 4)" 
          :key="device.id" 
          class="device-item"
          @click="viewDevice(device)"
        >
          <view :class="['device-status', device.status.toLowerCase().replace('中', '')]"></view>
          <view class="device-info">
            <text class="device-name">{{ device.name }}</text>
            <text class="device-location">{{ device.location }}</text>
          </view>
          <view class="device-time">{{ device.lastUpdate }}</view>
        </view>
      </view>
    </view>
    
    <view class="card">
      <view class="card-header">
        <text class="card-title">库存预警</text>
        <text class="card-more">查看全部 ›</text>
      </view>
      <view class="supply-list">
        <view 
          v-for="supply in lowStockSupplies" 
          :key="supply.id" 
          class="supply-item"
          @click="viewSupply(supply)"
        >
          <view class="supply-info">
            <text class="supply-name">{{ supply.name }}</text>
            <text class="supply-location">{{ supply.location }}</text>
          </view>
          <view class="supply-stock">
            <text class="stock-value" :class="{ 'stock-warning': supply.stock <= supply.threshold }">
              {{ supply.stock }} {{ supply.unit }}
            </text>
            <text class="stock-threshold">阈值: {{ supply.threshold }} {{ supply.unit }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="card">
      <view class="card-header">
        <text class="card-title">今日预约</text>
        <text class="card-more">查看全部 ›</text>
      </view>
      <view class="reservation-list">
        <view 
          v-for="item in todayReservations" 
          :key="item.id" 
          class="reservation-item"
        >
          <view class="reservation-device">{{ item.deviceName }}</view>
          <view class="reservation-time">
            <text class="time-text">{{ item.time }}</text>
            <view :class="['time-status', item.status]">{{ item.status }}</view>
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

const menuList = ref([
  { key: 'device', label: '设备', icon: '设', url: '/pages/device/index' },
  { key: 'supply', label: '耗材', icon: '耗', url: '/pages/supply/index' },
  { key: 'hazardous', label: '危化品', icon: '危', url: '/pages/hazardous/index' },
  { key: 'experiment', label: '实验记录', icon: '记', url: '/pages/experiment/index' },
  { key: 'waste', label: '废弃物', icon: '废', url: '/pages/waste/index' },
  { key: 'access', label: '安全准入', icon: '安', url: '/pages/access/index' }
])
const todayReservations = ref([
  { id: 1, deviceName: '核磁共振仪', time: '09:00-11:00', status: '使用中' },
  { id: 2, deviceName: 'PCR仪', time: '14:00-16:00', status: '待使用' },
  { id: 3, deviceName: '基因测序仪', time: '16:00-18:00', status: '待使用' }
])

const devices = computed(() => {
  return store.getters.devices.map(d => ({
    ...d,
    location: '实验室A区',
    lastUpdate: '5分钟前'
  }))
})

const lowStockSupplies = computed(() => {
  return store.getters.supplies.map(s => ({
    ...s,
    location: '库房B区',
    threshold: s.alert ? 10 : 20
  }))
})

const navigateTo = (url) => {
  uni.navigateTo({ url })
}

const viewDevice = (device) => {
  uni.navigateTo({ url: `/pages/device/detail?id=${device.id}` })
}

const viewSupply = (supply) => {
  uni.navigateTo({ url: `/pages/supply/detail?id=${supply.id}` })
}
</script>

<style lang="scss" scoped>
.lab-page {
  min-height: 100vh;
  background-color: #F7F7F7;
  padding-bottom: 24rpx;
  padding-top: 156rpx;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%);
  padding: 32rpx;
}

.page-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.lab-menu {
  display: flex;
  flex-wrap: wrap;
  padding: 24rpx;
  margin-top: -32rpx;
  gap: 16rpx;
}

.menu-item {
  width: calc(33.33% - 12rpx);
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding-top: 24rpx;
  padding-bottom: 24rpx;
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.menu-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.menu-icon.device {
  background: linear-gradient(135deg, #F093FB 0%, #F5576C 100%);
}

.menu-icon.supply {
  background: linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%);
}

.menu-icon.hazardous {
  background: linear-gradient(135deg, #F53F3F 0%, #FF6B6B 100%);
}

.menu-icon.experiment {
  background: linear-gradient(135deg, #43E97B 0%, #38F9D7 100%);
}

.menu-icon.waste {
  background: linear-gradient(135deg, #969799 0%, #B8B8B8 100%);
}

.menu-icon.access {
  background: linear-gradient(135deg, #D89614 0%, #F0B838 100%);
}

.icon-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.menu-label {
  font-size: 26rpx;
  color: #595959;
}

.lab-page .card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  margin: 0 24rpx 24rpx;
  padding: 16px;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.lab-page .card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  height: 28px;
}

.lab-page .card .card-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  line-height: 28px;
}

.lab-page .card .card-more {
  font-size: 14px;
  color: #177DDC;
  line-height: 28px;
}

.device-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.lab-page .card .device-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12px;
  background-color: #FAFAFA;
  border-radius: 16rpx;
}

.device-status {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

.device-status.运行 {
  background-color: #177DDC;
}

.device-status.在线 {
  background-color: #49AA19;
}

.device-status.故障 {
  background-color: #F53F3F;
}

.device-status.离线 {
  background-color: #B2B2B2;
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.lab-page .card .device-name {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}

.lab-page .card .device-location {
  font-size: 14px;
  color: #8C8C8C;
}

.lab-page .card .device-time {
  font-size: 12px;
  color: #B2B2B2;
}

.supply-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.lab-page .card .supply-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #FAFAFA;
  border-radius: 16rpx;
}

.supply-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.lab-page .card .supply-name {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}

.lab-page .card .supply-location {
  font-size: 14px;
  color: #8C8C8C;
}

.supply-stock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
}

.lab-page .card .stock-value {
  font-size: 14px;
  font-weight: 600;
  color: #49AA19;
}

.stock-value.stock-warning {
  color: #F53F3F;
}

.lab-page .card .stock-threshold {
  font-size: 14px;
  color: #B2B2B2;
}

.reservation-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.lab-page .card .reservation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #FAFAFA;
  border-radius: 16rpx;
}

.lab-page .card .reservation-device {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}

.reservation-time {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.time-text {
  font-size: 26rpx;
  color: #595959;
}

.time-status {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 16rpx;
}

.time-status.使用中 {
  background-color: #E8F4FF;
  color: #177DDC;
}

.time-status.待使用 {
  background-color: #E8F5E9;
  color: #49AA19;
}
</style>
