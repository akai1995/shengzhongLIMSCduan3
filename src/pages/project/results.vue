<template>
  <view class="project-results-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">项目成果</text>
      <view class="header-right"></view>
    </view>
    
    <view class="filter-bar">
      <scroll-view scroll-x class="filter-scroll">
        <view class="filter-items">
          <view 
            v-for="filter in filters" 
            :key="filter.key"
            :class="['filter-item', { active: currentFilter === filter.key }]"
            @click="currentFilter = filter.key"
          >
            <text class="filter-text">{{ filter.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <scroll-view class="content-wrapper" scroll-y>
      <view v-if="project">
        <view class="project-info-bar">
          <text class="project-name">{{ project.name }}</text>
          <text class="result-count">{{ filteredResults.length }}项成果</text>
        </view>
        
        <view v-if="filteredResults.length > 0" class="results-list">
          <view 
            v-for="result in filteredResults" 
            :key="result.id"
            class="result-card"
            @click="viewResultDetail(result)"
          >
            <view class="result-header">
              <view :class="['result-type-badge', getTypeClass(result.type)]">
                <text class="type-text">{{ result.type }}</text>
              </view>
              <view :class="['result-status-badge', getStatusClass(result.status)]">
                <text class="status-text">{{ result.status }}</text>
              </view>
            </view>
            
            <text class="result-title">{{ result.title }}</text>
            
            <view class="result-meta">
              <view v-if="result.journal" class="meta-item">
                <text class="meta-icon">📰</text>
                <text class="meta-text">{{ result.journal }}</text>
              </view>
              <view class="meta-item">
                <text class="meta-icon">📅</text>
                <text class="meta-text">{{ result.date }}</text>
              </view>
            </view>
            
            <view class="result-actions">
              <view class="action-btn">
                <text class="action-text">查看详情</text>
              </view>
              <view v-if="result.type === '论文'" class="action-btn secondary">
                <text class="action-text">引用格式</text>
              </view>
            </view>
          </view>
        </view>
        
        <view v-else class="empty-state">
          <text class="empty-icon">📄</text>
          <text class="empty-text">暂无{{ currentFilter === 'all' ? '' : currentFilter }}类成果</text>
        </view>
      </view>
      
      <view v-else class="empty-state">
        <text class="empty-icon">📄</text>
        <text class="empty-text">未找到项目信息</text>
      </view>
    </scroll-view>
    
    <!-- 成果详情弹窗 -->
    <view class="modal-overlay" v-if="selectedResult" @click="selectedResult = null">
      <view class="modal-content result-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">成果详情</text>
          <text class="modal-close" @click="selectedResult = null">×</text>
        </view>
        
        <scroll-view class="modal-content-scroll" scroll-y>
          <view class="detail-header">
            <view class="detail-type-row">
              <view :class="['detail-type-badge', getTypeClass(selectedResult.type)]">
                <text class="type-text">{{ selectedResult.type }}</text>
              </view>
              <view :class="['detail-status-badge', getStatusClass(selectedResult.status)]">
                <text class="status-text">{{ selectedResult.status }}</text>
              </view>
            </view>
            <text class="detail-title">{{ selectedResult.title }}</text>
          </view>
          
          <view class="detail-body">
            <view class="detail-section">
              <text class="section-title">基本信息</text>
              <view class="info-row">
                <text class="info-label">所属项目</text>
                <text class="info-value">{{ project?.name }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">成果类型</text>
                <text class="info-value">{{ selectedResult.type }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">完成日期</text>
                <text class="info-value">{{ selectedResult.date }}</text>
              </view>
              <view v-if="selectedResult.journal" class="info-row">
                <text class="info-label">发表期刊/会议</text>
                <text class="info-value">{{ selectedResult.journal }}</text>
              </view>
            </view>
            
            <view class="detail-section">
              <text class="section-title">成果简介</text>
              <text class="section-content">{{ getResultDescription(selectedResult) }}</text>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-actions">
          <view class="action-btn secondary-btn" @click="copyCitation(selectedResult)">
            <text class="btn-text">复制引用</text>
          </view>
          <view class="action-btn primary-btn" @click="shareResult(selectedResult)">
            <text class="btn-text">分享成果</text>
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
const selectedResult = ref(null)

const filters = [
  { key: 'all', label: '全部' },
  { key: '论文', label: '论文' },
  { key: '专利', label: '专利' },
  { key: '软著', label: '软著' },
  { key: '奖项', label: '奖项' }
]

const currentFilter = ref('all')

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  projectId.value = parseInt(options.id) || 1
  
  const projects = store.getters.projects
  project.value = projects.find(p => p.id === projectId.value)
})

const filteredResults = computed(() => {
  if (!project.value) return []
  if (currentFilter.value === 'all') {
    return project.value.results || []
  }
  return (project.value.results || []).filter(r => r.type === currentFilter.value)
})

const goBack = () => {
  uni.navigateBack()
}

const viewResultDetail = (result) => {
  selectedResult.value = result
}

const getTypeClass = (type) => {
  const map = {
    '论文': 'type-paper',
    '专利': 'type-patent',
    '软著': 'type-software',
    '奖项': 'type-award'
  }
  return map[type] || 'type-paper'
}

const getStatusClass = (status) => {
  if (status.includes('已发表') || status.includes('已授权') || status.includes('已获得') || status.includes('已登记')) {
    return 'status-done'
  }
  if (status.includes('审核中') || status.includes('评审中')) {
    return 'status-processing'
  }
  return 'status-pending'
}

const getResultDescription = (result) => {
  const descriptions = {
    '论文': `本文研究了${result.title}相关内容，发表在${result.journal || '相关期刊'}。该论文得到了项目经费的支持，研究成果对相关领域具有重要的学术价值和应用前景。`,
    '专利': `本专利涉及${result.title}的技术方案，已获得国家知识产权局授权。专利保护期为20年，具有较高的技术创新性和实用价值。`,
    '软著': `该软件著作权${result.title}已进行登记，获得计算机软件著作权登记证书。软件功能完善、运行稳定，已在实际中得到应用。`,
    '奖项': `${result.title}经过专家评审，荣获${result.status === '已获得' ? '相关奖项' : '评审中'}。该奖项是对项目科研成果的重要认可。`
  }
  return descriptions[result.type] || '暂无描述'
}

const copyCitation = (result) => {
  const citation = `${result.title}. ${project.value?.name || ''}, ${result.date}`
  uni.setClipboardData({
    data: citation,
    success: () => {
      uni.showToast({ title: '已复制引用', icon: 'success' })
    }
  })
}

const shareResult = (result) => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
  uni.showToast({ title: '点击右上角分享', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.project-results-page {
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

.filter-bar {
  position: fixed;
  top: 76px;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: #FFFFFF;
  padding: 16rpx 0;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-items {
  display: inline-flex;
  gap: 16rpx;
  padding: 0 24rpx;
}

.filter-item {
  padding: 12rpx 24rpx;
  background-color: #FAFAFA;
  border-radius: 24rpx;
  flex-shrink: 0;
  
  &.active {
    background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
    
    .filter-text {
      color: #FFFFFF;
    }
  }
}

.filter-text {
  font-size: 28rpx;
  color: #595959;
}

.content-wrapper {
  padding-top: 136px;
  padding-bottom: 24rpx;
  height: calc(100vh - 136px);
}

.project-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24rpx 24rpx;
}

.project-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
}

.result-count {
  font-size: 28rpx;
  color: #8C8C8C;
}

.results-list {
  padding: 0 24rpx;
}

.result-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  
  &:active {
    opacity: 0.6;
  }
}

.result-header {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.result-type-badge {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.type-paper {
  background-color: #E8F4FF;
  color: #177DDC;
}

.type-patent {
  background-color: #FFF7E6;
  color: #D89614;
}

.type-software {
  background-color: #F6FFED;
  color: #49AA19;
}

.type-award {
  background-color: #FFF0F5;
  color: #F53F3F;
}

.result-status-badge {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.status-done {
  background-color: #E8F5E9;
  color: #49AA19;
}

.status-processing {
  background-color: #FFF7E6;
  color: #D89614;
}

.status-pending {
  background-color: #F5F5F5;
  color: #8C8C8C;
}

.result-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #000000;
  display: block;
  margin-bottom: 16rpx;
  line-height: 1.4;
}

.result-meta {
  display: flex;
  gap: 24rpx;
  margin-bottom: 20rpx;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.meta-icon {
  font-size: 24rpx;
}

.meta-text {
  font-size: 24rpx;
  color: #8C8C8C;
}

.result-actions {
  display: flex;
  gap: 16rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #F0F0F0;
}

.action-btn {
  flex: 1;
  padding: 16rpx;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.secondary {
    background-color: #F5F5F5;
    
    .action-text {
      color: #595959;
    }
  }
}

.action-text {
  font-size: 26rpx;
  color: #FFFFFF;
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

.result-modal {
  width: 640rpx;
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

.modal-content-scroll {
  max-height: 55vh;
}

.detail-header {
  padding: 32rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.detail-type-row {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.detail-type-badge {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.detail-status-badge {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.detail-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #000000;
  line-height: 1.4;
}

.detail-body {
  padding: 24rpx 32rpx;
}

.detail-section {
  margin-bottom: 28rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #000000;
  display: block;
  margin-bottom: 16rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-size: 28rpx;
  color: #8C8C8C;
}

.info-value {
  font-size: 28rpx;
  color: #262626;
}

.section-content {
  font-size: 28rpx;
  color: #595959;
  line-height: 1.8;
}

.modal-actions {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #F0F0F0;
}

.secondary-btn {
  flex: 1;
  padding: 24rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .btn-text {
    color: #595959;
    font-size: 30rpx;
  }
}

.primary-btn {
  flex: 1;
  padding: 24rpx;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .btn-text {
    color: #FFFFFF;
    font-size: 30rpx;
  }
}
</style>