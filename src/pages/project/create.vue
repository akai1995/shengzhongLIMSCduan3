<template>
  <view class="create-project-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">新建项目</text>
      <view class="header-right"></view>
    </view>
    
    <scroll-view class="form-container" scroll-y>
      <view class="form-section">
        <view class="section-title">基本信息</view>
        
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">项目名称</text>
            <text class="required">*</text>
          </view>
          <input 
            class="form-input" 
            v-model="formData.name" 
            placeholder="请输入项目名称"
            @blur="validateName"
          />
          <view v-if="errors.name" class="error-message">{{ errors.name }}</view>
        </view>
        
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">项目类型</text>
            <text class="required">*</text>
          </view>
          <view class="picker-wrap" @click="showTypePicker = true">
            <text class="picker-value">{{ formData.type || '请选择项目类型' }}</text>
            <text class="picker-arrow">›</text>
          </view>
          <view v-if="errors.type" class="error-message">{{ errors.type }}</view>
        </view>
        
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">负责人</text>
            <text class="required">*</text>
          </view>
          <input 
            class="form-input" 
            v-model="formData.manager" 
            placeholder="请输入负责人姓名"
            @blur="validateManager"
          />
          <view v-if="errors.manager" class="error-message">{{ errors.manager }}</view>
        </view>
        
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">项目预算</text>
            <text class="required">*</text>
          </view>
          <view class="input-with-prefix">
            <text class="input-prefix">¥</text>
            <input 
              class="form-input money-input" 
              v-model="formData.budget" 
              type="digit"
              placeholder="请输入项目预算"
              @blur="validateBudget"
            />
          </view>
          <view v-if="errors.budget" class="error-message">{{ errors.budget }}</view>
        </view>
        
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">所属部门</text>
          </view>
          <view class="picker-wrap" @click="showDeptPicker = true">
            <text class="picker-value">{{ formData.department || '请选择所属部门' }}</text>
            <text class="picker-arrow">›</text>
          </view>
        </view>
      </view>
      
      <view class="form-section">
        <view class="section-title">详细信息</view>
        
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">项目描述</text>
          </view>
          <textarea 
            class="form-textarea" 
            v-model="formData.description" 
            placeholder="请输入项目描述（可选）"
            :maxlength="500"
          />
          <text class="textarea-count">{{ formData.description.length }}/500</text>
        </view>
        
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">开始日期</text>
            <text class="required">*</text>
          </view>
          <view class="picker-wrap" @click="showDatePicker = true">
            <text class="picker-value">{{ formData.startDate || '请选择开始日期' }}</text>
            <text class="picker-arrow">›</text>
          </view>
          <view v-if="errors.startDate" class="error-message">{{ errors.startDate }}</view>
        </view>
        
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">预计结束日期</text>
          </view>
          <view class="picker-wrap" @click="showEndDatePicker = true">
            <text class="picker-value">{{ formData.endDate || '请选择预计结束日期' }}</text>
            <text class="picker-arrow">›</text>
          </view>
        </view>
      </view>
      
      <view class="form-section">
        <view class="section-title">项目目标</view>
        
        <view class="form-item">
          <view class="form-label">
            <text class="label-text">预期成果</text>
          </view>
          <textarea 
            class="form-textarea" 
            v-model="formData.outcome" 
            placeholder="请描述项目预期成果（可选）"
            :maxlength="500"
          />
          <text class="textarea-count">{{ formData.outcome.length }}/500</text>
        </view>
      </view>
    </scroll-view>
    
    <view class="bottom-actions">
      <view class="action-btn cancel-btn" @click="goBack">
        <text class="btn-text">取消</text>
      </view>
      <view class="action-btn confirm-btn" @click="submitProject">
        <text class="btn-text">保存</text>
      </view>
    </view>
    
    <view v-if="showTypePicker" class="picker-mask" @click="showTypePicker = false">
      <view class="picker-content" @click.stop>
        <view class="picker-header">
          <text class="picker-cancel" @click="showTypePicker = false">取消</text>
          <text class="picker-title">选择项目类型</text>
          <text class="picker-confirm" @click="confirmType">确定</text>
        </view>
        <scroll-view class="picker-list" scroll-y>
          <view 
            v-for="type in projectTypes" 
            :key="type.value"
            :class="['picker-item', { active: tempType === type.value }]"
            @click="tempType = type.value"
          >
            <text class="item-text">{{ type.label }}</text>
            <view v-if="tempType === type.value" class="item-check">✓</view>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <view v-if="showDeptPicker" class="picker-mask" @click="showDeptPicker = false">
      <view class="picker-content" @click.stop>
        <view class="picker-header">
          <text class="picker-cancel" @click="showDeptPicker = false">取消</text>
          <text class="picker-title">选择部门</text>
          <text class="picker-confirm" @click="confirmDept">确定</text>
        </view>
        <scroll-view class="picker-list" scroll-y>
          <view 
            v-for="dept in departments" 
            :key="dept.value"
            :class="['picker-item', { active: tempDept === dept.value }]"
            @click="tempDept = dept.value"
          >
            <text class="item-text">{{ dept.label }}</text>
            <view v-if="tempDept === dept.value" class="item-check">✓</view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const formData = reactive({
  name: '',
  type: '',
  manager: '',
  budget: '',
  department: '',
  description: '',
  startDate: '',
  endDate: '',
  outcome: ''
})

const errors = reactive({
  name: '',
  type: '',
  manager: '',
  budget: '',
  startDate: ''
})

const showTypePicker = ref(false)
const showDeptPicker = ref(false)
const showDatePicker = ref(false)
const showEndDatePicker = ref(false)
const tempType = ref('')
const tempDept = ref('')

const projectTypes = [
  { value: 'medical', label: '医学研究' },
  { value: 'biology', label: '生物科学' },
  { value: 'chemistry', label: '化学实验' },
  { value: 'physics', label: '物理研究' },
  { value: 'computer', label: '计算机科学' },
  { value: 'engineering', label: '工程技术' },
  { value: 'other', label: '其他' }
]

const departments = [
  { value: 'lab-a', label: '实验室A' },
  { value: 'lab-b', label: '实验室B' },
  { value: 'lab-c', label: '实验室C' },
  { value: 'lab-d', label: '实验室D' },
  { value: 'research', label: '科研部' },
  { value: 'admin', label: '管理部' }
]

const validateName = () => {
  if (!formData.name.trim()) {
    errors.name = '请输入项目名称'
  } else if (formData.name.length > 50) {
    errors.name = '项目名称不能超过50个字符'
  } else {
    errors.name = ''
  }
}

const validateManager = () => {
  if (!formData.manager.trim()) {
    errors.manager = '请输入负责人姓名'
  } else {
    errors.manager = ''
  }
}

const validateBudget = () => {
  const budget = parseFloat(formData.budget)
  if (!formData.budget.trim()) {
    errors.budget = '请输入项目预算'
  } else if (isNaN(budget) || budget <= 0) {
    errors.budget = '请输入有效的预算金额'
  } else {
    errors.budget = ''
  }
}

const validateForm = () => {
  validateName()
  validateManager()
  validateBudget()
  
  if (!formData.type) {
    errors.type = '请选择项目类型'
  } else {
    errors.type = ''
  }
  
  if (!formData.startDate) {
    errors.startDate = '请选择开始日期'
  } else {
    errors.startDate = ''
  }
  
  return !errors.name && !errors.type && !errors.manager && !errors.budget && !errors.startDate
}

const confirmType = () => {
  if (tempType.value) {
    formData.type = projectTypes.find(t => t.value === tempType.value)?.label || ''
  }
  showTypePicker.value = false
}

const confirmDept = () => {
  if (tempDept.value) {
    formData.department = departments.find(d => d.value === tempDept.value)?.label || ''
  }
  showDeptPicker.value = false
}

const goBack = () => {
  uni.navigateBack()
}

const submitProject = () => {
  if (!validateForm()) {
    return
  }
  
  const newProject = {
    id: Date.now(),
    name: formData.name,
    type: formData.type,
    manager: formData.manager,
    budget: parseFloat(formData.budget),
    spent: 0,
    department: formData.department || '未指定',
    description: formData.description,
    startDate: formData.startDate,
    endDate: formData.endDate,
    outcome: formData.outcome,
    status: '未开始',
    progress: 0,
    createdAt: new Date().toISOString()
  }
  
  store.state.projects.unshift(newProject)
  
  uni.showToast({
    title: '项目创建成功',
    icon: 'success',
    duration: 2000
  })
  
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}
</script>

<style lang="scss" scoped>
.create-project-page {
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

.form-container {
  padding-top: 44px;
  padding-bottom: 140rpx;
  height: calc(100vh - 44px);
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

.cancel-btn {
  background-color: #F5F5F5;
  
  .btn-text {
    color: #8C8C8C;
    font-size: 16px;
    font-weight: 500;
  }
}

.confirm-btn {
  background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
  
  .btn-text {
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 500;
  }
}

.form-section {
  background-color: #FFFFFF;
  margin: 24rpx;
  border-radius: 20rpx;
  padding: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
  margin-bottom: 32rpx;
  padding-left: 8rpx;
}

.form-item {
  margin-bottom: 32rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.label-text {
  font-size: 28rpx;
  color: #333333;
}

.required {
  color: #F53F3F;
  margin-left: 8rpx;
}

.form-input {
  width: 100%;
  height: 88rpx;
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  color: #333333;
}

.input-with-prefix {
  display: flex;
  align-items: center;
  background-color: #FAFAFA;
  border-radius: 12rpx;
}

.input-prefix {
  font-size: 30rpx;
  color: #666666;
  padding-left: 24rpx;
}

.money-input {
  flex: 1;
  border-radius: 0 12rpx 12rpx 0;
}

.form-textarea {
  width: 100%;
  min-height: 200rpx;
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 24rpx;
  font-size: 30rpx;
  color: #333333;
  box-sizing: border-box;
}

.textarea-count {
  display: block;
  text-align: right;
  font-size: 24rpx;
  color: #B2B2B2;
  margin-top: 8rpx;
}

.picker-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  background-color: #FAFAFA;
  border-radius: 12rpx;
  padding: 0 24rpx;
}

.picker-value {
  font-size: 30rpx;
  color: #333333;
}

.picker-arrow {
  font-size: 32rpx;
  color: #B2B2B2;
}

.error-message {
  font-size: 24rpx;
  color: #F53F3F;
  margin-top: 12rpx;
}

.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.picker-content {
  width: 100%;
  background-color: #FFFFFF;
  border-radius: 32rpx 32rpx 0 0;
  max-height: 70vh;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.picker-cancel {
  font-size: 30rpx;
  color: #666666;
}

.picker-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
}

.picker-confirm {
  font-size: 30rpx;
  color: #177DDC;
  font-weight: 500;
}

.picker-list {
  max-height: 60vh;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
}

.picker-item.active {
  background-color: #F5F9FF;
}

.item-text {
  font-size: 30rpx;
  color: #333333;
}

.item-check {
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