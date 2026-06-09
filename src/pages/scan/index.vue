<template>
  <view class="scan-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">扫码入库</text>
      <view class="header-right"></view>
    </view>
    
    <view class="content-wrapper">
      <view class="scan-area">
        <view class="scan-box" @click="scanBarcode">
          <view class="scan-icon">
            <text class="icon-text">扫</text>
          </view>
          <text class="scan-hint">点击扫码或输入条码</text>
          <text class="scan-tip">支持二维码、条形码</text>
        </view>
      </view>
      
      <view class="input-area">
        <view class="input-wrapper">
          <input 
            v-model="barcode" 
            class="barcode-input" 
            placeholder="请输入条码" 
            @confirm="handleScan"
          />
          <view class="input-btn" @click="handleScan">
            <text>确认</text>
          </view>
        </view>
      </view>
      
      <view v-if="scannedItem" class="result-card">
        <view class="card-header">
          <text class="card-title">扫描结果</text>
          <view class="scan-status success">
            <text class="status-icon">✓</text>
            <text class="status-text">识别成功</text>
          </view>
        </view>
        
        <view class="item-info">
          <view class="item-image">
            <view class="image-placeholder">
              <text class="image-icon">📦</text>
            </view>
          </view>
          <view class="item-details">
            <text class="item-name">{{ scannedItem.name }}</text>
            <text class="item-spec">{{ scannedItem.specification }}</text>
            <view class="item-meta">
              <text class="meta-item">条码: {{ scannedItem.barcode }}</text>
              <text class="meta-item">批次: {{ scannedItem.batch }}</text>
            </view>
          </view>
        </view>
        
        <view class="item-properties">
          <view class="property-row">
            <text class="property-label">类别</text>
            <text class="property-value">{{ scannedItem.category }}</text>
          </view>
          <view class="property-row">
            <text class="property-label">数量</text>
            <text class="property-value">{{ scannedItem.quantity }} {{ scannedItem.unit }}</text>
          </view>
          <view class="property-row">
            <text class="property-label">有效期</text>
            <text class="property-value">{{ scannedItem.expiryDate }}</text>
          </view>
          <view class="property-row">
            <text class="property-label">存放位置</text>
            <text class="property-value">{{ scannedItem.location }}</text>
          </view>
        </view>
        
        <view class="storage-form">
          <view class="form-item">
            <text class="form-label">入库数量</text>
            <view class="quantity-control">
              <view class="qty-btn" @click="decreaseQty">
                <text>−</text>
              </view>
              <input 
                v-model="storageQty" 
                class="qty-input" 
                type="number" 
              />
              <view class="qty-btn" @click="increaseQty">
                <text>+</text>
              </view>
            </view>
          </view>
          <view class="form-item">
            <text class="form-label">存放位置</text>
            <picker mode="selector" :range="locations" @change="onLocationChange">
              <view class="picker-value">
                <text>{{ selectedLocation }}</text>
                <text class="picker-arrow">›</text>
              </view>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">备注</text>
            <textarea 
              v-model="remark" 
              class="remark-input" 
              placeholder="请输入备注信息"
            ></textarea>
          </view>
        </view>
        
        <view class="action-buttons">
          <view class="action-btn secondary" @click="resetScan">
            <text>重新扫描</text>
          </view>
          <view class="action-btn primary" @click="confirmStorage">
            <text>确认入库</text>
          </view>
        </view>
      </view>
      
      <view v-else class="history-section">
        <view class="section-header">
          <text class="section-title">入库记录</text>
        </view>
        <view class="history-list">
          <view 
            v-for="record in storageHistory" 
            :key="record.id" 
            class="history-item"
            @click="viewRecord(record)"
          >
            <view class="history-icon">
              <text class="icon-symbol">{{ record.icon }}</text>
            </view>
            <view class="history-info">
              <text class="history-name">{{ record.name }}</text>
              <text class="history-time">{{ record.time }} · {{ record.location }}</text>
            </view>
            <view class="history-status" :class="record.status">
              <text>{{ record.statusText }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view v-if="showSuccess" class="success-modal">
      <view class="modal-content">
        <view class="success-icon">✓</view>
        <text class="success-title">入库成功</text>
        <text class="success-desc">{{ successMessage }}</text>
        <view class="modal-btn" @click="closeSuccess">
          <text>确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const barcode = ref('')
    const scannedItem = ref(null)
    const storageQty = ref(1)
    const selectedLocation = ref('A区-01货架')
    const remark = ref('')
    const showSuccess = ref(false)
    const successMessage = ref('')
    
    const locations = [
      'A区-01货架',
      'A区-02货架',
      'B区-01货架',
      'B区-02货架',
      'C区-01货架',
      'C区-02货架',
      '冷藏区-01',
      '冷藏区-02'
    ]
    
    const storageHistory = ref([
      { id: 1, name: 'PCR试剂盒', icon: '🧪', time: '5分钟前', location: 'A区-01货架', status: 'success', statusText: '已入库' },
      { id: 2, name: '一次性手套', icon: '🧤', time: '15分钟前', location: 'B区-02货架', status: 'success', statusText: '已入库' },
      { id: 3, name: '离心管盒', icon: '📦', time: '1小时前', location: 'A区-02货架', status: 'success', statusText: '已入库' },
      { id: 4, name: '移液器吸头', icon: '💉', time: '2小时前', location: 'C区-01货架', status: 'pending', statusText: '待审核' },
      { id: 5, name: '培养基', icon: '🧫', time: '3小时前', location: '冷藏区-01', status: 'success', statusText: '已入库' }
    ])
    
    const barcodeDatabase = {
      'PCR-2024-001': {
        barcode: 'PCR-2024-001',
        name: 'PCR试剂盒',
        specification: '250次/盒',
        batch: '20240115',
        category: '试剂',
        quantity: 100,
        unit: '盒',
        expiryDate: '2025-06-30',
        location: 'A区-01货架',
        price: 1200
      },
      'GLOVE-2024-002': {
        barcode: 'GLOVE-2024-002',
        name: '一次性手套',
        specification: 'M码/100只',
        batch: '20240120',
        category: '耗材',
        quantity: 500,
        unit: '盒',
        expiryDate: '2026-01-20',
        location: 'B区-02货架',
        price: 85
      },
      'TUBE-2024-003': {
        barcode: 'TUBE-2024-003',
        name: '离心管盒',
        specification: '1.5ml/100支',
        batch: '20240118',
        category: '耗材',
        quantity: 200,
        unit: '盒',
        expiryDate: '2027-01-18',
        location: 'A区-02货架',
        price: 65
      },
      'TIP-2024-004': {
        barcode: 'TIP-2024-004',
        name: '移液器吸头',
        specification: '1000ul/96支',
        batch: '20240122',
        category: '耗材',
        quantity: 50,
        unit: '盒',
        expiryDate: '2026-01-22',
        location: 'C区-01货架',
        price: 45
      },
      'MEDIA-2024-005': {
        barcode: 'MEDIA-2024-005',
        name: '培养基',
        specification: '500ml/瓶',
        batch: '20240110',
        category: '试剂',
        quantity: 30,
        unit: '瓶',
        expiryDate: '2024-07-10',
        location: '冷藏区-01',
        price: 180
      },
      'BUFFER-2024-006': {
        barcode: 'BUFFER-2024-006',
        name: '缓冲液',
        specification: '1L/瓶',
        batch: '20240108',
        category: '试剂',
        quantity: 20,
        unit: '瓶',
        expiryDate: '2025-01-08',
        location: 'B区-01货架',
        price: 120
      }
    }
    
    const goBack = () => {
      uni.navigateBack()
    }
    
    const scanBarcode = () => {
      try {
        uni.showActionSheet({
          itemList: ['扫描二维码', '扫描条形码', '手动输入'],
          success: (res) => {
            if (res && res.tapIndex !== undefined) {
              if (res.tapIndex === 0 || res.tapIndex === 1) {
                simulateScan()
              }
            }
          },
          fail: (err) => {
            console.log('ActionSheet cancelled')
          }
        })
      } catch (e) {
        console.error('scanBarcode error:', e)
        simulateScan()
      }
    }
    
    const simulateScan = () => {
      const barcodes = Object.keys(barcodeDatabase)
      const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)]
      barcode.value = randomBarcode
      handleScan()
    }
    
    const handleScan = () => {
      if (!barcode.value.trim()) {
        uni.showToast({
          title: '请输入条码',
          icon: 'none'
        })
        return
      }
      
      const item = barcodeDatabase[barcode.value.trim()]
      
      if (item) {
        scannedItem.value = item
        storageQty.value = 1
        selectedLocation.value = item.location
      } else {
        uni.showModal({
          title: '提示',
          content: '未找到该条码对应的物品',
          showCancel: false
        })
      }
    }
    
    const increaseQty = () => {
      if (storageQty.value < (scannedItem.value?.quantity || 100)) {
        storageQty.value++
      }
    }
    
    const decreaseQty = () => {
      if (storageQty.value > 1) {
        storageQty.value--
      }
    }
    
    const onLocationChange = (e) => {
      selectedLocation.value = locations[e.detail.value]
    }
    
    const resetScan = () => {
      barcode.value = ''
      scannedItem.value = null
      storageQty.value = 1
      remark.value = ''
    }
    
    const confirmStorage = () => {
      const record = {
        id: Date.now(),
        name: scannedItem.value.name,
        icon: getIconByCategory(scannedItem.value.category),
        time: '刚刚',
        location: selectedLocation.value,
        status: 'success',
        statusText: '已入库'
      }
      
      storageHistory.value.unshift(record)
      
      successMessage.value = `${scannedItem.value.name} x ${storageQty.value} 已入库至 ${selectedLocation.value}`
      showSuccess.value = true
    }
    
    const getIconByCategory = (category) => {
      const icons = {
        '试剂': '🧪',
        '耗材': '📦',
        '设备': '🔧',
        '其他': '📋'
      }
      return icons[category] || '📦'
    }
    
    const viewRecord = (record) => {
      uni.showToast({
        title: record.name,
        icon: 'none'
      })
    }
    
    const closeSuccess = () => {
      showSuccess.value = false
      resetScan()
    }
    
    return {
      barcode,
      scannedItem,
      storageQty,
      selectedLocation,
      remark,
      showSuccess,
      successMessage,
      locations,
      storageHistory,
      goBack,
      scanBarcode,
      handleScan,
      increaseQty,
      decreaseQty,
      onLocationChange,
      resetScan,
      confirmStorage,
      viewRecord,
      closeSuccess
    }
  }
}
</script>

<style lang="scss" scoped>
.scan-page {
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

.content-wrapper {
  padding-top: 56px;
  padding-bottom: 24px;
  padding-left: 24rpx;
  padding-right: 24rpx;
}

.scan-area {
  margin-bottom: 24rpx;
}

.scan-box {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  border-radius: 24rpx;
  padding: 60rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(23, 125, 220, 0.3);
}

.scan-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.icon-text {
  font-size: 48rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.scan-hint {
  font-size: 16px;
  color: #FFFFFF;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.scan-tip {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.input-area {
  margin-bottom: 24rpx;
}

.input-wrapper {
  display: flex;
  gap: 16rpx;
}

.barcode-input {
  flex: 1;
  height: 80rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 14px;
  border: 2rpx solid #E5E5E5;
}

.input-btn {
  height: 80rpx;
  width: 120rpx;
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  text {
    font-size: 14px;
    color: #FFFFFF;
    font-weight: 500;
  }
}

.result-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 16px;
  margin-bottom: 24rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

.scan-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  
  &.success {
    background-color: #E8F5E9;
    
    .status-icon, .status-text {
      color: #49AA19;
    }
  }
}

.status-icon {
  font-size: 20rpx;
}

.status-text {
  font-size: 12px;
}

.item-info {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #FAFAFA;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.item-image {
  width: 120rpx;
  height: 120rpx;
  flex-shrink: 0;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #E5E5E5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-icon {
  font-size: 48rpx;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8rpx;
}

.item-spec {
  font-size: 14px;
  color: #8C8C8C;
  margin-bottom: 12rpx;
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.meta-item {
  font-size: 12px;
  color: #B2B2B2;
}

.item-properties {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.property-row {
  width: calc(50% - 8rpx);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 16rpx;
  background-color: #FAFAFA;
  border-radius: 12rpx;
}

.property-label {
  font-size: 14px;
  color: #8C8C8C;
}

.property-value {
  font-size: 14px;
  color: #000000;
  font-weight: 500;
}

.storage-form {
  margin-bottom: 24rpx;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:nth-child(3) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.form-label {
  font-size: 14px;
  color: #8C8C8C;
  margin-bottom: 12rpx;
  display: block;
}

.quantity-control {
  display: flex;
  align-items: center;
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 8rpx;
  width: 160px;
}

.qty-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 8rpx;
  
  text {
    font-size: 28rpx;
    color: #8C8C8C;
  }
  
  &:active {
    background-color: #F0F0F0;
  }
}

.qty-input {
  flex: 1;
  text-align: center;
  font-size: 16px;
  color: #000000;
  background-color: transparent;
}

.picker-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  width: 160px;
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 0 20rpx;
  
  text {
    font-size: 14px;
    color: #000000;
  }
}

.picker-arrow {
  font-size: 28rpx;
  color: #CCCCCC;
}

.remark-input {
  width: 100%;
  height: 120rpx;
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 16rpx;
  font-size: 14px;
  color: #000000;
}

.action-buttons {
  display: flex;
  gap: 24rpx;
}

.action-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  text {
    font-size: 16px;
    font-weight: 500;
  }
  
  &.secondary {
    background-color: #F5F5F5;
    
    text {
      color: #8C8C8C;
    }
  }
  
  &.primary {
    background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
    
    text {
      color: #FFFFFF;
    }
  }
}

.history-section {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 16px;
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background-color: #FAFAFA;
  border-radius: 12rpx;
}

.history-icon {
  width: 64rpx;
  height: 64rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-symbol {
  font-size: 28rpx;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.history-name {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}

.history-time {
  font-size: 12px;
  color: #B2B2B2;
  margin-top: 4rpx;
}

.history-status {
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
  font-size: 12px;
  
  &.success {
    background-color: #E8F5E9;
    color: #49AA19;
  }
  
  &.pending {
    background-color: #FFFBE6;
    color: #D89614;
  }
}

.success-modal {
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
  width: 560rpx;
  background-color: #FFFFFF;
  border-radius: 24rpx;
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  color: #FFFFFF;
  margin-bottom: 24rpx;
}

.success-title {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 12rpx;
}

.success-desc {
  font-size: 14px;
  color: #8C8C8C;
  text-align: center;
  margin-bottom: 32rpx;
}

.modal-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  border-radius: 99999px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  text {
    font-size: 16px;
    color: #FFFFFF;
    font-weight: 500;
  }
}
</style>