<template>
  <view class="ai-generate-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">AI生成记录</text>
      <view class="header-right"></view>
    </view>
    
    <view class="tab-bar">
      <view 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab-item', { active: currentTab === tab.key }]"
        @click="currentTab = tab.key"
      >
        <text class="tab-text">{{ tab.label }}</text>
      </view>
    </view>
    
    <scroll-view class="content-wrapper" scroll-y>
      <view v-if="currentTab === 'templates'" class="templates-list">
        <view 
          v-for="template in aiTemplates" 
          :key="template.id" 
          class="template-card"
          @click="selectTemplate(template)"
        >
          <view class="template-icon">
            <text class="icon-text">{{ template.icon }}</text>
          </view>
          <view class="template-info">
            <text class="template-name">{{ template.name }}</text>
            <text class="template-desc">{{ template.description }}</text>
          </view>
          <view class="template-arrow">
            <text class="arrow-text">›</text>
          </view>
        </view>
      </view>
      
      <view v-if="currentTab === 'history'" class="history-list">
        <view 
          v-for="record in aiRecords" 
          :key="record.id" 
          class="record-card"
          @click="viewRecord(record)"
        >
          <view class="record-header">
            <view :class="['type-badge', getTypeClass(record.type)]">
              <text class="badge-text">{{ getTypeLabel(record.type) }}</text>
            </view>
            <view :class="['status-badge', getStatusClass(record.status)]">
              <text class="status-text">{{ getStatusLabel(record.status) }}</text>
            </view>
          </view>
          
          <text class="record-title">{{ record.title }}</text>
          <text class="record-desc">{{ record.description }}</text>
          
          <view class="record-meta">
            <view class="meta-item">
              <text class="meta-icon">📁</text>
              <text class="meta-text">{{ record.project }}</text>
            </view>
            <view class="meta-item">
              <text class="meta-icon">📊</text>
              <text class="meta-text">{{ record.wordCount }} 字</text>
            </view>
            <view class="meta-item">
              <text class="meta-icon">⏱</text>
              <text class="meta-text">{{ record.time }}</text>
            </view>
          </view>
          
          <view class="record-keywords">
            <text 
              v-for="(keyword, index) in record.keywords" 
              :key="index" 
              class="keyword-tag"
            >
              {{ keyword }}
            </text>
          </view>
          
          <view v-if="record.usage" class="record-usage">
            <text class="usage-label">使用情况：</text>
            <text class="usage-value">{{ record.usage }}</text>
          </view>
        </view>
        
        <view v-if="aiRecords.length === 0" class="empty-state">
          <text class="empty-icon">🤖</text>
          <text class="empty-text">暂无AI生成记录</text>
          <view class="empty-btn" @click="currentTab = 'templates'">
            <text class="empty-btn-text">立即生成</text>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 生成弹窗 -->
    <view class="modal-overlay" v-if="showGenerateModal" @click="showGenerateModal = false">
      <view class="modal-content generate-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ selectedTemplate?.name || 'AI生成' }}</text>
          <text class="modal-close" @click="showGenerateModal = false">×</text>
        </view>
        
        <view class="generate-form">
          <view class="form-item">
            <text class="form-label">关联项目</text>
            <view class="form-value-wrapper" @click="showProjectPicker = true">
              <text class="form-value">{{ generateForm.project || '请选择项目' }}</text>
              <text class="form-arrow">›</text>
            </view>
          </view>
          
          <view class="form-item">
            <text class="form-label">输入内容</text>
            <textarea 
              class="form-textarea"
              v-model="generateForm.inputContent"
              placeholder="请输入需要AI处理的内容，如实验数据、文献摘要、分析需求等..."
              :maxlength="1000"
            />
            <text class="textarea-counter">{{ generateForm.inputContent.length }}/1000</text>
          </view>
          
          <view class="form-item">
            <text class="form-label">输出要求</text>
            <view class="output-options">
              <view 
                v-for="option in outputOptions" 
                :key="option.value"
                :class="['option-item', { active: generateForm.outputStyle === option.value }]"
                @click="generateForm.outputStyle = option.value"
              >
                <text class="option-text">{{ option.label }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="modal-actions">
          <view class="action-btn primary-btn" @click="submitGenerate">
            <text class="btn-text">开始生成</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 项目选择弹窗 -->
    <view class="modal-overlay" v-if="showProjectPicker" @click="showProjectPicker = false">
      <view class="modal-content picker-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择项目</text>
        </view>
        <scroll-view class="picker-list" scroll-y>
          <view 
            v-for="project in projects" 
            :key="project.id"
            :class="['picker-item', { active: generateForm.project === project.name }]"
            @click="selectProject(project)"
          >
            <text class="picker-text">{{ project.name }}</text>
            <text class="picker-status">{{ project.status }}</text>
            <view v-if="generateForm.project === project.name" class="picker-check">✓</view>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <!-- 生成结果弹窗 -->
    <view class="modal-overlay" v-if="showResultModal" @click="showResultModal = false">
      <view class="modal-content result-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">生成结果</text>
          <text class="modal-close" @click="showResultModal = false">×</text>
        </view>
        
        <scroll-view class="result-content" scroll-y>
          <view class="result-header">
            <text class="result-title">{{ generatedRecord?.title }}</text>
            <view class="result-meta">
              <text class="result-meta-text">{{ generatedRecord?.wordCount }} 字</text>
              <text class="result-meta-text">{{ generatedRecord?.time }}</text>
            </view>
          </view>
          <view class="result-body">
            <text class="result-text">{{ generatedRecord?.content }}</text>
          </view>
        </scroll-view>
        
        <view class="modal-actions">
          <view class="action-btn secondary-btn" @click="copyResult">
            <text class="btn-text">复制内容</text>
          </view>
          <view class="action-btn primary-btn" @click="saveResult">
            <text class="btn-text">保存记录</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const tabs = [
  { key: 'templates', label: '生成模板' },
  { key: 'history', label: '历史记录' }
]

const outputOptions = [
  { value: 'detailed', label: '详细' },
  { value: 'concise', label: '简洁' },
  { value: 'professional', label: '专业' }
]

const currentTab = ref('templates')
const showGenerateModal = ref(false)
const showProjectPicker = ref(false)
const showResultModal = ref(false)
const selectedTemplate = ref(null)
const generatedRecord = ref(null)

const aiTemplates = computed(() => store.getters.aiTemplates)
const aiRecords = computed(() => store.getters.aiRecords)
const projects = computed(() => store.getters.projects)

const generateForm = reactive({
  project: '',
  inputContent: '',
  outputStyle: 'detailed'
})

const goBack = () => {
  uni.navigateBack()
}

const selectTemplate = (template) => {
  selectedTemplate.value = template
  showGenerateModal.value = true
}

const selectProject = (project) => {
  generateForm.project = project.name
  showProjectPicker.value = false
}

const getTypeClass = (type) => {
  const map = {
    report: 'type-report',
    summary: 'type-summary',
    protocol: 'type-protocol',
    analysis: 'type-analysis'
  }
  return map[type] || 'type-report'
}

const getTypeLabel = (type) => {
  const map = {
    report: '报告',
    summary: '摘要',
    protocol: '方案',
    analysis: '分析'
  }
  return map[type] || '其他'
}

const getStatusClass = (status) => {
  return status === 'completed' ? 'status-done' : 'status-processing'
}

const getStatusLabel = (status) => {
  return status === 'completed' ? '已完成' : '生成中'
}

const viewRecord = (record) => {
  if (record.status === 'completed') {
    generatedRecord.value = {
      ...record,
      content: record.description
    }
    showResultModal.value = true
  } else {
    uni.showToast({ title: '正在生成中...', icon: 'loading', duration: 1500 })
  }
}

const submitGenerate = () => {
  if (!generateForm.project) {
    uni.showToast({ title: '请选择关联项目', icon: 'none' })
    return
  }
  
  if (!generateForm.inputContent.trim()) {
    uni.showToast({ title: '请输入需要处理的内容', icon: 'none' })
    return
  }
  
  showGenerateModal.value = false
  uni.showLoading({ title: 'AI生成中...' })
  
  setTimeout(() => {
    uni.hideLoading()
    
    const mockContent = `基于您提供的内容，${selectedTemplate.value?.name || 'AI'}分析结果如下：

1. 数据分析：
- 数据特征提取完成
- 关键指标识别成功
- 趋势分析已生成

2. 结论建议：
根据分析结果，建议采取以下措施：
- 优化实验参数设置
- 增加样本量以提高统计显著性
- 结合控制组进行对比验证

3. 下一步行动：
建议继续深入研究相关领域的最新进展，关注关键指标的变化趋势。

生成完成，共 ${Math.floor(Math.random() * 500) + 200} 字。`
    
    generatedRecord.value = {
      id: Date.now(),
      title: `${selectedTemplate.value?.name || 'AI生成'}结果`,
      project: generateForm.project,
      wordCount: mockContent.length,
      time: formatTime(new Date()),
      content: mockContent
    }
    
    showResultModal.value = true
  }, 2000)
}

const copyResult = () => {
  uni.setClipboardData({
    data: generatedRecord.value?.content || '',
    success: () => {
      uni.showToast({ title: '已复制', icon: 'success' })
    }
  })
}

const saveResult = () => {
  const newRecord = {
    id: generatedRecord.value.id,
    type: 'report',
    title: generatedRecord.value.title,
    project: generatedRecord.value.project,
    description: generatedRecord.value.content.substring(0, 100) + '...',
    status: 'completed',
    wordCount: generatedRecord.value.wordCount,
    time: generatedRecord.value.time,
    keywords: ['AI生成', generatedRecord.value.project],
    usage: ''
  }
  
  store.commit('ADD_AI_RECORD', newRecord)
  
  showResultModal.value = false
  uni.showToast({ title: '保存成功', icon: 'success', duration: 2000 })
  
  setTimeout(() => {
    currentTab.value = 'history'
  }, 1500)
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
.ai-generate-page {
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
  padding-bottom: 24rpx;
  height: calc(100vh - 92px);
}

.templates-list {
  padding: 24rpx;
}

.template-card {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  
  &:active {
    opacity: 0.6;
  }
}

.template-icon {
  width: 88rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #E8F4FD 0%, #D0EFFF 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.icon-text {
  font-size: 44rpx;
}

.template-info {
  flex: 1;
}

.template-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
  display: block;
  margin-bottom: 8rpx;
}

.template-desc {
  font-size: 26rpx;
  color: #8C8C8C;
}

.template-arrow {
  margin-left: 16rpx;
}

.arrow-text {
  font-size: 32rpx;
  color: #B2B2B2;
}

.history-list {
  padding: 24rpx;
}

.record-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  
  &:active {
    opacity: 0.6;
  }
}

.record-header {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.type-badge {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.type-report {
  background-color: #E8F4FD;
  color: #177DDC;
}

.type-summary {
  background-color: #F0F9FF;
  color: #0080FF;
}

.type-protocol {
  background-color: #F6FFED;
  color: #49AA19;
}

.type-analysis {
  background-color: #FFF7E6;
  color: #D89614;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.status-done {
  background-color: #F6FFED;
  color: #49AA19;
}

.status-processing {
  background-color: #FFF7E6;
  color: #D89614;
}

.record-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
  display: block;
  margin-bottom: 12rpx;
}

.record-desc {
  font-size: 28rpx;
  color: #595959;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.record-meta {
  display: flex;
  gap: 24rpx;
  margin-bottom: 16rpx;
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

.record-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.keyword-tag {
  padding: 8rpx 16rpx;
  background-color: #FAFAFA;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #595959;
}

.record-usage {
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #F0F0F0;
  display: flex;
  align-items: center;
}

.usage-label {
  font-size: 26rpx;
  color: #8C8C8C;
}

.usage-value {
  font-size: 26rpx;
  color: #49AA19;
  margin-left: 8rpx;
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
  margin-bottom: 24rpx;
}

.empty-btn {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  padding: 20rpx 48rpx;
  border-radius: 12rpx;
}

.empty-btn-text {
  color: #FFFFFF;
  font-size: 28rpx;
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

.generate-modal {
  max-height: 70vh;
}

.generate-form {
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

.form-value-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 20rpx;
}

.form-value {
  font-size: 30rpx;
  color: #333333;
}

.form-arrow {
  font-size: 32rpx;
  color: #B2B2B2;
}

.form-textarea {
  width: 100%;
  height: 200rpx;
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
}

.textarea-counter {
  display: block;
  text-align: right;
  font-size: 24rpx;
  color: #B2B2B2;
  margin-top: 8rpx;
}

.output-options {
  display: flex;
  gap: 16rpx;
}

.option-item {
  flex: 1;
  padding: 16rpx;
  background-color: #FAFAFA;
  border-radius: 12rpx;
  text-align: center;
  
  &.active {
    background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
    
    .option-text {
      color: #FFFFFF;
    }
  }
}

.option-text {
  font-size: 26rpx;
  color: #595959;
}

.modal-actions {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #F0F0F0;
}

.action-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-btn {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  
  .btn-text {
    color: #FFFFFF;
    font-size: 30rpx;
    font-weight: 500;
  }
}

.secondary-btn {
  background-color: #F5F5F5;
  
  .btn-text {
    color: #595959;
    font-size: 30rpx;
  }
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

.result-modal {
  max-height: 85vh;
}

.result-content {
  max-height: 55vh;
  padding: 24rpx;
}

.result-header {
  margin-bottom: 20rpx;
}

.result-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
  display: block;
  margin-bottom: 12rpx;
}

.result-meta {
  display: flex;
  gap: 24rpx;
}

.result-meta-text {
  font-size: 24rpx;
  color: #8C8C8C;
}

.result-body {
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 20rpx;
}

.result-text {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.8;
  white-space: pre-wrap;
}
</style>