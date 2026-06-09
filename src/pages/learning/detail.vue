<template>
  <view class="learning-page">
    <view class="page-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">学习详情</text>
      <view class="header-right"></view>
    </view>
    
    <view class="content-wrapper">
      <view class="progress-card">
        <view class="progress-header">
          <text class="progress-title">{{ currentLearning.title }}</text>
          <view class="progress-badge">
            <text class="badge-text">{{ currentLearning.progress }}%</text>
          </view>
        </view>
        <view class="progress-bar-container">
          <view class="progress-bar-large">
            <view class="progress-fill-large" :style="{ width: currentLearning.progress + '%' }"></view>
          </view>
          <text class="progress-label">学习进度</text>
        </view>
      </view>
      
      <view class="chapter-list">
        <text class="section-title">课程章节</text>
        <view 
          v-for="(chapter, index) in chapters" 
          :key="index" 
          class="chapter-item"
          :class="{ completed: chapter.completed, active: currentChapter === index }"
          @click="selectChapter(index)"
        >
          <view class="chapter-icon">
            <text v-if="chapter.completed" class="icon-check">✓</text>
            <text v-else class="icon-number">{{ index + 1 }}</text>
          </view>
          <view class="chapter-info">
            <text class="chapter-title">{{ chapter.title }}</text>
            <text class="chapter-duration">{{ chapter.duration }}</text>
          </view>
          <view class="chapter-arrow">›</view>
        </view>
      </view>
      
      <view class="content-card">
        <view class="content-header">
          <text class="content-title">{{ chapters[currentChapter].title }}</text>
          <text class="content-duration">{{ chapters[currentChapter].duration }}</text>
        </view>
        
        <view class="video-container">
          <view class="video-placeholder">
            <view class="play-btn" @click="playVideo">
              <text class="play-icon">▶</text>
            </view>
            <text class="video-hint">点击播放视频</text>
          </view>
        </view>
        
        <view class="content-body">
          <view v-for="(section, index) in chapters[currentChapter].content" :key="index" class="content-section">
            <text v-if="section.type === 'title'" class="section-heading">{{ section.text }}</text>
            <text v-else-if="section.type === 'text'" class="section-text">{{ section.text }}</text>
            <view v-else-if="section.type === 'list'" class="section-list">
              <view v-for="(item, i) in section.items" :key="i" class="list-item">
                <text class="list-bullet">•</text>
                <text class="list-text">{{ item }}</text>
              </view>
            </view>
            <view v-else-if="section.type === 'image'" class="section-image">
              <image :src="section.src" mode="widthFix" />
            </view>
          </view>
        </view>
        
        <view class="content-footer">
          <view class="footer-btn secondary" @click="previousChapter">
            <text>上一章</text>
          </view>
          <view v-if="currentChapter < chapters.length - 1" class="footer-btn primary" @click="nextChapter">
            <text>下一章</text>
          </view>
          <view v-else class="footer-btn success" @click="completeCourse">
            <text>完成学习</text>
          </view>
        </view>
      </view>
      
      <view v-if="showQuiz" class="quiz-card">
        <text class="quiz-title">课后测验</text>
        <text class="quiz-question">{{ currentQuestion.question }}</text>
        <view class="quiz-options">
          <view 
            v-for="(option, index) in currentQuestion.options" 
            :key="index" 
            class="quiz-option"
            :class="{ selected: selectedAnswer === index, correct: showAnswer && index === currentQuestion.answer, wrong: showAnswer && selectedAnswer === index && index !== currentQuestion.answer }"
            @click="selectAnswer(index)"
          >
            <text class="option-label">{{ ['A', 'B', 'C', 'D'][index] }}</text>
            <text class="option-text">{{ option }}</text>
          </view>
        </view>
        <view v-if="showAnswer" class="quiz-result">
          <text :class="['result-text', selectedAnswer === currentQuestion.answer ? 'correct' : 'wrong']">
            {{ selectedAnswer === currentQuestion.answer ? '回答正确！' : '回答错误，正确答案是 ' + ['A', 'B', 'C', 'D'][currentQuestion.answer] }}
          </text>
        </view>
        <view class="quiz-actions">
          <view v-if="!showAnswer" class="quiz-btn primary" @click="submitAnswer">
            <text>提交答案</text>
          </view>
          <view v-else class="quiz-btn success" @click="nextQuestion">
            <text>{{ quizIndex < questions.length - 1 ? '下一题' : '完成测验' }}</text>
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
    const learningId = ref(0)
    const currentLearning = ref({
      id: 1,
      title: '安全培训',
      description: '实验室安全操作规程与应急处理',
      deadline: '2024-01-20',
      progress: 60,
      type: 'learning'
    })
    
    const currentChapter = ref(0)
    const showQuiz = ref(false)
    const quizIndex = ref(0)
    const selectedAnswer = ref(-1)
    const showAnswer = ref(false)
    
    const chapters = ref([
      {
        title: '第一章：实验室安全概述',
        duration: '15分钟',
        completed: true,
        content: [
          { type: 'title', text: '实验室安全的重要性' },
          { type: 'text', text: '实验室是进行科学研究和实验的重要场所，但同时也存在各种潜在的安全风险。了解和遵守实验室安全规定是每个科研人员的基本职责。' },
          { type: 'list', items: ['化学试剂的正确使用', '仪器设备的安全操作', '个人防护装备的穿戴', '应急处理流程'] },
          { type: 'title', text: '安全意识培养' },
          { type: 'text', text: '培养良好的安全意识是预防事故的关键。进入实验室前，必须接受安全培训并通过考核。' }
        ]
      },
      {
        title: '第二章：化学试剂管理',
        duration: '20分钟',
        completed: true,
        content: [
          { type: 'title', text: '试剂分类与存放' },
          { type: 'text', text: '化学试剂应根据其性质分类存放，易燃、易爆、有毒试剂必须严格按照规定存放。' },
          { type: 'list', items: ['氧化剂与还原剂分开存放', '强酸与强碱分开存放', '有毒试剂上锁管理', '过期试剂及时处理'] },
          { type: 'title', text: '试剂取用规范' },
          { type: 'text', text: '取用试剂时要仔细核对标签，避免错拿误用。取用后及时盖好瓶盖，防止挥发或污染。' }
        ]
      },
      {
        title: '第三章：仪器设备安全',
        duration: '25分钟',
        completed: false,
        content: [
          { type: 'title', text: '设备操作前检查' },
          { type: 'text', text: '使用仪器设备前，必须检查设备状态是否正常，了解设备的操作规程。' },
          { type: 'list', items: ['检查电源连接是否正常', '确认设备处于待机状态', '阅读操作手册', '佩戴必要的防护装备'] },
          { type: 'title', text: '设备使用注意事项' },
          { type: 'text', text: '操作过程中要集中注意力，严格按照操作规程进行，发现异常立即停止使用并报告。' }
        ]
      },
      {
        title: '第四章：应急处理',
        duration: '20分钟',
        completed: false,
        content: [
          { type: 'title', text: '常见事故处理' },
          { type: 'text', text: '了解常见事故的应急处理方法，能够在事故发生时迅速采取正确的措施。' },
          { type: 'list', items: ['火灾：使用灭火器，拨打火警电话', '化学品溅洒：立即用大量清水冲洗', '触电：切断电源，进行急救', '气体泄漏：迅速撤离，通风换气'] },
          { type: 'title', text: '急救设备位置' },
          { type: 'text', text: '熟悉实验室及周边的急救设备位置，包括急救箱、洗眼器、喷淋装置等。' }
        ]
      },
      {
        title: '第五章：安全考核',
        duration: '30分钟',
        completed: false,
        content: [
          { type: 'title', text: '考核说明' },
          { type: 'text', text: '完成本课程学习后，需要通过安全知识考核才能获得实验室准入资格。' },
          { type: 'list', items: ['考核形式：在线答题', '及格分数：80分', '题目数量：20题', '考试时间：30分钟'] }
        ]
      }
    ])
    
    const questions = ref([
      {
        question: '实验室中，氧化剂和还原剂应该如何存放？',
        options: ['放在一起方便取用', '分开存放，避免接触', '可以混合存放', '无所谓'],
        answer: 1
      },
      {
        question: '发现实验室火灾时，首先应该做什么？',
        options: ['用水灭火', '使用灭火器', '切断电源，疏散人员', '继续工作'],
        answer: 2
      },
      {
        question: '化学品溅到眼睛里应该怎么办？',
        options: ['用手揉眼睛', '立即用大量清水冲洗', '等待医生处理', '用纸巾擦拭'],
        answer: 1
      },
      {
        question: '进入实验室必须穿戴的防护装备不包括？',
        options: ['实验服', '手套', '安全帽', '护目镜'],
        answer: 2
      },
      {
        question: '实验室安全考核的及格分数是多少？',
        options: ['60分', '70分', '80分', '90分'],
        answer: 2
      }
    ])
    
    const currentQuestion = computed(() => questions.value[quizIndex.value])
    
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
    
    const selectChapter = (index) => {
      currentChapter.value = index
    }
    
    const playVideo = () => {
      uni.showToast({
        title: '视频播放中...',
        icon: 'none'
      })
    }
    
    const previousChapter = () => {
      if (currentChapter.value > 0) {
        currentChapter.value--
      }
    }
    
    const nextChapter = () => {
      if (currentChapter.value < chapters.value.length - 1) {
        chapters.value[currentChapter.value].completed = true
        currentChapter.value++
        updateProgress()
      }
    }
    
    const updateProgress = () => {
      const completed = chapters.value.filter(c => c.completed).length
      currentLearning.value.progress = Math.round((completed / chapters.value.length) * 100)
    }
    
    const completeCourse = () => {
      showQuiz.value = true
    }
    
    const selectAnswer = (index) => {
      if (!showAnswer.value) {
        selectedAnswer.value = index
      }
    }
    
    const submitAnswer = () => {
      if (selectedAnswer.value >= 0) {
        showAnswer.value = true
      } else {
        uni.showToast({
          title: '请选择答案',
          icon: 'none'
        })
      }
    }
    
    const nextQuestion = () => {
      if (quizIndex.value < questions.value.length - 1) {
        quizIndex.value++
        selectedAnswer.value = -1
        showAnswer.value = false
      } else {
        completeQuiz()
      }
    }
    
    const completeQuiz = () => {
      const correctCount = questions.value.filter((q, i) => {
        const answered = quizIndex.value >= i
        return answered && selectedAnswer.value === q.answer
      }).length
      
      const score = Math.round((correctCount / questions.value.length) * 100)
      
      if (score >= 80) {
        currentLearning.value.progress = 100
        uni.showToast({
          title: `恭喜！考试通过，得分${score}分`,
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      } else {
        uni.showToast({
          title: `考试未通过，得分${score}分，请重新学习`,
          icon: 'none',
          duration: 2000
        })
        showQuiz.value = false
        quizIndex.value = 0
        selectedAnswer.value = -1
        showAnswer.value = false
      }
    }
    
    onMounted(() => {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const options = currentPage.$page?.options || {}
      if (options.id) {
        learningId.value = parseInt(options.id)
        loadLearningDetail(learningId.value)
      }
    })
    
    const loadLearningDetail = (id) => {
      const learnings = [
        { id: 1, title: '安全培训', description: '实验室安全操作规程与应急处理', deadline: '2024-01-20', progress: 60, type: 'learning' },
        { id: 2, title: '知识考核', description: 'Q1季度安全知识测试', deadline: '2024-01-25', progress: 0, type: 'learning' },
        { id: 3, title: '设备培训', description: 'MRI扫描仪操作培训课程', deadline: '2024-02-01', progress: 30, type: 'learning' },
        { id: 4, title: '数据安全', description: '科研数据保护与隐私合规培训', deadline: '2024-02-10', progress: 0, type: 'learning' },
        { id: 5, title: '实验规范', description: 'PCR实验操作规范培训', deadline: '2024-02-15', progress: 80, type: 'learning' },
        { id: 6, title: '合规考试', description: '实验室管理规范考核', deadline: '2024-02-20', progress: 0, type: 'learning' }
      ]
      
      const learning = learnings.find(l => l.id === id)
      if (learning) {
        currentLearning.value = learning
      }
    }
    
    return {
      currentLearning,
      chapters,
      currentChapter,
      showQuiz,
      quizIndex,
      selectedAnswer,
      showAnswer,
      currentQuestion,
      goBack,
      selectChapter,
      playVideo,
      previousChapter,
      nextChapter,
      completeCourse,
      selectAnswer,
      submitAnswer,
      nextQuestion
    }
  }
}
</script>

<style lang="scss" scoped>
.learning-page {
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
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
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

.progress-card {
  background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
  border-radius: 20rpx;
  padding: 16px;
  margin-bottom: 24rpx;
  color: #FFFFFF;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.progress-title {
  font-size: 32rpx;
  font-weight: 600;
}

.progress-badge {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
}

.badge-text {
  font-size: 24rpx;
  font-weight: 600;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.progress-bar-large {
  flex: 1;
  height: 16rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 8rpx;
  overflow: hidden;
}

.progress-fill-large {
  height: 100%;
  background-color: #FFFFFF;
  border-radius: 8rpx;
  transition: width 0.3s;
}

.progress-label {
  font-size: 24rpx;
  opacity: 0.8;
}

.chapter-list {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 16px;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 16rpx;
  display: block;
}

.chapter-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.completed {
    .chapter-icon {
      background-color: #49AA19;
    }
    
    .chapter-title {
      color: #8C8C8C;
    }
  }
  
  &.active {
    .chapter-title {
      color: #49AA19;
      font-weight: 600;
    }
  }
}

.chapter-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background-color: #E5E5E5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.icon-check {
  font-size: 24rpx;
  color: #FFFFFF;
}

.icon-number {
  font-size: 22rpx;
  color: #8C8C8C;
}

.chapter-info {
  flex: 1;
}

.chapter-title {
  font-size: 14px;
  color: #000000;
  display: block;
}

.chapter-duration {
  font-size: 12px;
  color: #B2B2B2;
  margin-top: 4rpx;
}

.chapter-arrow {
  font-size: 32rpx;
  color: #CCCCCC;
}

.content-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 16px;
  margin-bottom: 24rpx;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.content-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

.content-duration {
  font-size: 12px;
  color: #8C8C8C;
}

.video-container {
  margin-bottom: 20rpx;
}

.video-placeholder {
  height: 300rpx;
  background-color: #1A1A1A;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.play-btn {
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  
  &:active {
    background-color: rgba(255, 255, 255, 0.3);
  }
}

.play-icon {
  font-size: 32rpx;
  color: #FFFFFF;
  margin-left: 8rpx;
}

.video-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.content-body {
  margin-bottom: 20rpx;
}

.content-section {
  margin-bottom: 20rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-heading {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  display: block;
  margin-bottom: 12rpx;
}

.section-text {
  font-size: 14px;
  color: #595959;
  line-height: 1.6;
}

.section-list {
  padding-left: 16rpx;
}

.list-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8rpx;
}

.list-bullet {
  color: #49AA19;
  margin-right: 8rpx;
}

.list-text {
  font-size: 14px;
  color: #595959;
}

.section-image {
  margin-top: 12rpx;
  
  image {
    width: 100%;
    border-radius: 12rpx;
  }
}

.content-footer {
  display: flex;
  gap: 24rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #F0F0F0;
}

.footer-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 99999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  
  &.secondary {
    background-color: #F5F5F5;
    color: #8C8C8C;
  }
  
  &.primary {
    background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
    color: #FFFFFF;
  }
  
  &.success {
    background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
    color: #FFFFFF;
  }
}

.quiz-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 16px;
}

.quiz-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 16rpx;
  display: block;
}

.quiz-question {
  font-size: 14px;
  color: #333333;
  line-height: 1.5;
  margin-bottom: 20rpx;
  display: block;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.quiz-option {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #F7F7F7;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  
  &.selected {
    border-color: #49AA19;
    background-color: #E8F5E9;
  }
  
  &.correct {
    border-color: #49AA19;
    background-color: #E8F5E9;
  }
  
  &.wrong {
    border-color: #F53F3F;
    background-color: #FFF5F5;
  }
}

.option-label {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #8C8C8C;
  margin-right: 16rpx;
}

.quiz-option.selected .option-label,
.quiz-option.correct .option-label {
  background-color: #49AA19;
  color: #FFFFFF;
}

.quiz-option.wrong .option-label {
  background-color: #F53F3F;
  color: #FFFFFF;
}

.option-text {
  flex: 1;
  font-size: 14px;
  color: #333333;
}

.quiz-result {
  padding: 16rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.result-text {
  font-size: 14px;
  font-weight: 500;
  
  &.correct {
    color: #49AA19;
  }
  
  &.wrong {
    color: #F53F3F;
  }
}

.quiz-actions {
  display: flex;
}

.quiz-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 99999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  
  &.primary {
    background: linear-gradient(135deg, #177DDC 0%, #4CAFFF 100%);
    color: #FFFFFF;
  }
  
  &.success {
    background: linear-gradient(135deg, #49AA19 0%, #6BCB3D 100%);
    color: #FFFFFF;
  }
}
</style>