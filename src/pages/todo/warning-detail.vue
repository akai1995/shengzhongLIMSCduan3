<template>
  <view class="warning-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">预警详情</text>
      <view class="header-right"></view>
    </view>
    
    <view class="content-wrapper">
      <view :class="['status-card', currentWarning.level]">
        <view :class="['level-badge', currentWarning.level]">
          <text class="level-icon">{{ getLevelIcon(currentWarning.level) }}</text>
          <text class="level-text">{{ getLevelLabel(currentWarning.level) }}</text>
        </view>
        <text class="warning-title">{{ currentWarning.title }}</text>
        <text class="warning-time">{{ currentWarning.time }}</text>
      </view>
      
      <view class="info-card">
        <view class="info-section">
          <text class="section-title">基本信息</text>
          <view class="info-item">
            <text class="info-label">预警位置</text>
            <text class="info-value">{{ currentWarning.location }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">预警级别</text>
            <view :class="['level-tag', currentWarning.level]">
              {{ getLevelLabel(currentWarning.level) }}
            </view>
          </view>
          <view class="info-item">
            <text class="info-label">预警时间</text>
            <text class="info-value">{{ currentWarning.time }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">处理状态</text>
            <view :class="['status-tag', currentWarning.status]">
              {{ getStatusLabel(currentWarning.status) }}
            </view>
          </view>
        </view>
      </view>
      
      <view class="detail-card">
        <view class="detail-section">
          <text class="detail-section-title">预警描述</text>
          <view class="detail-description">
            <text class="detail-text">{{ currentWarning.description }}</text>
          </view>
        </view>
        
        <view v-if="currentWarning.measure" class="detail-section">
          <text class="detail-section-title">处理建议</text>
          <view class="detail-description">
            <text class="detail-text">{{ currentWarning.measure }}</text>
          </view>
        </view>
        
        <view v-if="currentWarning.parameters && currentWarning.parameters.length > 0" class="detail-section">
          <text class="detail-section-title">监测参数</text>
          <view class="params-grid">
            <view 
              v-for="(param, index) in currentWarning.parameters" 
              :key="index" 
              class="param-item"
            >
              <text class="param-label">{{ param.name }}</text>
              <text :class="['param-value', param.status]">{{ param.value }} {{ param.unit }}</text>
              <text v-if="param.threshold" class="param-threshold">阈值: {{ param.threshold }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="history-card">
        <text class="section-title">处理记录</text>
        <view class="history-list">
          <view 
            v-for="(record, index) in warningHistory" 
            :key="index" 
            class="history-item"
          >
            <view :class="['history-dot', record.actionType]"></view>
            <view class="history-line" v-if="index < warningHistory.length - 1"></view>
            <view class="history-content">
              <view class="history-header">
                <text class="history-name">{{ record.operator }}</text>
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
      <view class="action-btn ignore-btn" @click="handleIgnore">
        <text class="btn-text">忽略</text>
      </view>
      <view class="action-btn handle-btn" @click="handleProcess">
        <text class="btn-text">处理</text>
      </view>
    </view>
    
    <view class="bottom-actions" v-if="showConfirm">
      <view class="action-btn confirm-btn" @click="handleConfirm">
        <text class="btn-text">确认已处理</text>
      </view>
    </view>
    
    <view class="modal-overlay" v-if="showModal" @click="closeModal">
      <view class="modal-content" @click.stop>
        <text class="modal-title">{{ modalTitle }}</text>
        <textarea 
          class="modal-textarea" 
          v-model="processComment" 
          placeholder="请输入处理备注（可选）"
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

export default {
  setup() {
    const processComment = ref('')
    const showModal = ref(false)
    const modalType = ref('')
    const warningId = ref(0)
    
    const currentWarning = ref({
      id: 1,
      title: '温度警报',
      description: '检测到温度超过安全范围，请及时处理',
      location: '实验室C301',
      level: 'danger',
      time: '5分钟前',
      status: 'pending',
      measure: '建议检查空调设备运行状态，调整温度设置，必要时通知设备维护人员进行检修。',
      parameters: [
        { name: '当前温度', value: '32.5', unit: '°C', threshold: '≤30°C', status: 'warning' },
        { name: '设定温度', value: '25', unit: '°C', status: 'normal' }
      ]
    })
    
    const modalTitle = computed(() => {
      if (modalType.value === 'ignore') return '确认忽略'
      if (modalType.value === 'process') return '开始处理'
      if (modalType.value === 'confirm') return '确认完成'
      return '操作确认'
    })
    
    const modalConfirmText = computed(() => {
      if (modalType.value === 'ignore') return '确认忽略'
      if (modalType.value === 'process') return '开始处理'
      if (modalType.value === 'confirm') return '确认完成'
      return '确认'
    })
    
    const showActions = computed(() => {
      return currentWarning.value.status === 'pending'
    })
    
    const showConfirm = computed(() => {
      return currentWarning.value.status === 'processing'
    })
    
    const warningHistory = ref([
      { operator: '系统', action: '自动检测到异常', actionType: 'system', time: '5分钟前', comment: '' },
      { operator: '系统', action: '生成预警通知', actionType: 'system', time: '5分钟前', comment: '' }
    ])
    
    const getLevelIcon = (level) => {
      const iconMap = {
        danger: '!',
        warning: '⚠'
      }
      return iconMap[level] || '!'
    }
    
    const getLevelLabel = (level) => {
      const labelMap = {
        danger: '严重',
        warning: '一般'
      }
      return labelMap[level] || '未知'
    }
    
    const getStatusLabel = (status) => {
      const labelMap = {
        pending: '待处理',
        processing: '处理中',
        completed: '已处理',
        ignored: '已忽略'
      }
      return labelMap[status] || '未知'
    }
    
    const goBack = () => {
      const pages = getCurrentPages()
      if (pages.length <= 1) {
        uni.switchTab({
          url: '/pages/tabs/workbench/workbench'
        })
      } else {
        uni.navigateBack()
      }
    }
    
    const handleIgnore = () => {
      modalType.value = 'ignore'
      showModal.value = true
    }
    
    const handleProcess = () => {
      modalType.value = 'process'
      showModal.value = true
    }
    
    const handleConfirm = () => {
      modalType.value = 'confirm'
      showModal.value = true
    }
    
    const closeModal = () => {
      showModal.value = false
      processComment.value = ''
    }
    
    const confirmAction = () => {
      if (modalType.value === 'ignore') {
        currentWarning.value.status = 'ignored'
        warningHistory.value.push({
          operator: '当前用户',
          action: '忽略预警',
          actionType: 'ignored',
          time: '刚刚',
          comment: processComment.value || '无备注'
        })
        uni.showToast({ title: '已忽略', icon: 'success' })
      } else if (modalType.value === 'process') {
        currentWarning.value.status = 'processing'
        warningHistory.value.push({
          operator: '当前用户',
          action: '开始处理',
          actionType: 'processing',
          time: '刚刚',
          comment: processComment.value || '无备注'
        })
        uni.showToast({ title: '已开始处理', icon: 'success' })
      } else if (modalType.value === 'confirm') {
        currentWarning.value.status = 'completed'
        warningHistory.value.push({
          operator: '当前用户',
          action: '确认完成',
          actionType: 'completed',
          time: '刚刚',
          comment: processComment.value || '无备注'
        })
        uni.showToast({ title: '处理完成', icon: 'success' })
      }
      closeModal()
    }
    
    onMounted(() => {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const options = currentPage.$page?.options || {}
      if (options.id) {
        warningId.value = parseInt(options.id)
        loadWarningDetail(warningId.value)
      }
    })
    
    const loadWarningDetail = (id) => {
      const warnings = [
        { id: 1, title: '温度警报', description: '检测到温度超过安全范围，请及时处理', location: '实验室C301', level: 'danger', time: '5分钟前', status: 'pending', measure: '建议检查空调设备运行状态，调整温度设置，必要时通知设备维护人员进行检修。', parameters: [{ name: '当前温度', value: '32.5', unit: '°C', threshold: '≤30°C', status: 'warning' }, { name: '设定温度', value: '25', unit: '°C', status: 'normal' }] },
        { id: 2, title: '湿度警报', description: '湿度超出正常范围，可能影响实验设备和样本', location: '库房B区', level: 'warning', time: '10分钟前', status: 'pending', measure: '请检查除湿设备运行状态，确保库房湿度在正常范围内。', parameters: [{ name: '当前湿度', value: '78', unit: '%', threshold: '≤70%', status: 'warning' }] },
        { id: 3, title: '库存不足', description: '耗材库存低于安全阈值，建议及时补货', location: '货架A01', level: 'warning', time: '30分钟前', status: 'pending', measure: '请及时采购补充库存，避免影响正常实验进度。', parameters: [{ name: '当前库存', value: '5', unit: '盒', threshold: '≥20盒', status: 'warning' }, { name: '安全库存', value: '20', unit: '盒', status: 'normal' }] },
        { id: 4, title: '设备故障', description: '质谱仪检测到异常，已自动停机保护', location: '实验室C301', level: 'danger', time: '1小时前', status: 'pending', measure: '请联系设备维护人员进行故障排查和维修，恢复设备正常运行。', parameters: [{ name: '设备状态', value: '故障', unit: '', status: 'danger' }, { name: '故障代码', value: 'E-1024', unit: '', status: 'danger' }] },
        { id: 5, title: '门禁异常', description: '门禁连续多次刷卡失败，可能存在安全风险', location: '大楼入口', level: 'danger', time: '2小时前', status: 'pending', measure: '请核查门禁设备状态，必要时联系安保人员进行现场检查。', parameters: [] },
        { id: 6, title: '通风告警', description: '通风系统运行异常，可能影响空气质量', location: '实验室A101', level: 'warning', time: '3小时前', status: 'pending', measure: '请检查通风设备运行状态，确保实验室内空气质量符合标准。', parameters: [{ name: '风速', value: '1.2', unit: 'm/s', threshold: '≥2.0m/s', status: 'warning' }] },
        { id: 7, title: '压力异常', description: '气瓶间气压超出安全范围', location: '气瓶间', level: 'danger', time: '4小时前', status: 'processing', measure: '请立即检查气瓶状态，确保压力在安全范围内，必要时关闭气源。', parameters: [{ name: '当前压力', value: '15.2', unit: 'MPa', threshold: '≤15MPa', status: 'danger' }] },
        { id: 8, title: '电量不足', description: 'UPS电量低于20%，请及时充电', location: '机房', level: 'warning', time: '5小时前', status: 'pending', measure: '请安排UPS充电，确保备用电源正常运行。', parameters: [{ name: '剩余电量', value: '18', unit: '%', threshold: '≥20%', status: 'warning' }] },
        { id: 9, title: '网络中断', description: '实验室B区网络连接异常', location: '实验室B区', level: 'warning', time: '6小时前', status: 'completed', measure: '请检查网络设备状态，恢复网络连接。', parameters: [] },
        { id: 10, title: '消防预警', description: '烟雾探测器触发报警', location: '仓库', level: 'danger', time: '昨天', status: 'completed', measure: '请立即检查现场情况，确认是否存在火灾隐患。', parameters: [{ name: '探测器状态', value: '触发', unit: '', status: 'danger' }] }
      ]
      
      const warning = warnings.find(w => w.id === id)
      if (warning) {
        currentWarning.value = warning
        if (warning.status === 'processing') {
          warningHistory.value.push({ operator: '当前用户', action: '开始处理', actionType: 'processing', time: '1小时前', comment: '正在处理中' })
        } else if (warning.status === 'completed') {
          warningHistory.value.push({ operator: '当前用户', action: '开始处理', actionType: 'processing', time: '昨天', comment: '' })
          warningHistory.value.push({ operator: '当前用户', action: '确认完成', actionType: 'completed', time: '昨天', comment: '已处理完毕' })
        }
      }
    }
    
    return {
      currentWarning,
      warningHistory,
      showActions,
      showConfirm,
      showModal,
      modalTitle,
      modalConfirmText,
      processComment,
      goBack,
      handleIgnore,
      handleProcess,
      handleConfirm,
      closeModal,
      confirmAction,
      getLevelIcon,
      getLevelLabel,
      getStatusLabel
    }
  }
}
</script>

<style lang="scss" scoped>
.warning-page {
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
  padding-bottom: 95px;
  padding-left: 24rpx;
  padding-right: 24rpx;
}

.status-card {
  background: linear-gradient(135deg, #F53F3F 0%, #FF6B6B 100%);
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  color: #FFFFFF;
  
  &.warning {
    background: linear-gradient(135deg, #D89614 0%, #F0B838 100%);
  }
}

.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
  margin-bottom: 12rpx;
}

.level-icon {
  font-size: 24rpx;
  font-weight: 600;
}

.level-text {
  font-size: 24rpx;
  font-weight: 500;
}

.warning-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.warning-time {
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
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 12px;
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
}

.level-tag, .status-tag {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  
  &.danger {
    background-color: #FFF2F0;
    color: #F53F3F;
  }
  
  &.warning {
    background-color: #FFFBE6;
    color: #D89614;
  }
  
  &.pending {
    background-color: #E8F4FD;
    color: #177DDC;
  }
  
  &.processing {
    background-color: #FFFBE6;
    color: #D89614;
  }
  
  &.completed {
    background-color: #F6FFED;
    color: #49AA19;
  }
  
  &.ignored {
    background-color: #F5F5F5;
    color: #8C8C8C;
  }
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
  margin-bottom: 12rpx;
  display: block;
}

.detail-description {
  background-color: #F7F7F7;
  border-radius: 12rpx;
  padding: 16rpx;
}

.detail-text {
  font-size: 14px;
  color: #333333;
  line-height: 1.6;
}

.params-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.param-item {
  flex: 1;
  min-width: 45%;
  background-color: #F7F7F7;
  border-radius: 12rpx;
  padding: 16rpx;
}

.param-label {
  font-size: 14px;
  color: #8C8C8C;
  display: block;
  margin-bottom: 8rpx;
}

.param-value {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  display: block;
  margin-bottom: 4rpx;
  
  &.warning {
    color: #D89614;
  }
  
  &.danger {
    color: #F53F3F;
  }
  
  &.normal {
    color: #49AA19;
  }
}

.param-threshold {
  font-size: 14px;
  color: #CCCCCC;
}

.history-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 16px;
}

.history-list {
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
  top: 50%;
  transform: translateY(-50%);
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background-color: #177DDC;
  
  &.system {
    background-color: #8C8C8C;
  }
  
  &.processing {
    background-color: #D89614;
  }
  
  &.completed {
    background-color: #49AA19;
  }
  
  &.ignored {
    background-color: #CCCCCC;
  }
}

.history-line {
  position: absolute;
  left: -14rpx;
  top: calc(50% + 8rpx);
  width: 4rpx;
  height: 66px;
  background-color: #E5E5E5;
}

.history-content {
  background-color: #F7F7F7;
  border-radius: 12rpx;
  padding: 16rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.history-name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.history-time {
  font-size: 12px;
  color: #8C8C8C;
}

.history-action {
  font-size: 14px;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.history-comment {
  font-size: 12px;
  color: #8C8C8C;
  background-color: #FFFFFF;
  padding: 8rpx 12rpx;
  border-radius: 8rpx;
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

.ignore-btn {
  background-color: #F5F5F5;
  
  .btn-text {
    color: #8C8C8C;
    font-size: 16px;
    font-weight: 500;
  }
}

.handle-btn {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  
  .btn-text {
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 500;
  }
}

.confirm-btn {
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
  
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
  z-index: 200;
}

.modal-content {
  width: 600rpx;
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
  text-align: center;
  margin-bottom: 24rpx;
  display: block;
}

.modal-textarea {
  width: 100%;
  height: 200rpx;
  border: 1rpx solid #E5E5E5;
  border-radius: 12rpx;
  padding: 16rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  gap: 24rpx;
  margin-top: 32rpx;
}

.modal-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  
  &.cancel-btn {
    background-color: #F5F5F5;
    color: #8C8C8C;
  }
  
  &.confirm-btn {
    background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
    color: #FFFFFF;
  }
}
</style>