<template>
  <view class="custom-tabbar">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tab-item"
      :class="{ active: currentIndex === index }"
      @click="switchTab(index)"
    >
      <view class="icon-wrapper">
        <Dashboard v-if="index === 0" :size="24" :stroke-width="1.5" :fill="currentIndex === index ? '#177DDC' : '#8C8C8C'" :stroke="currentIndex === index ? '#177DDC' : '#8C8C8C'" />
        <Microscope v-else-if="index === 1" :size="24" :stroke-width="1.5" :fill="currentIndex === index ? '#177DDC' : '#8C8C8C'" :stroke="currentIndex === index ? '#177DDC' : '#8C8C8C'" />
        <Flask v-else-if="index === 2" :size="24" :stroke-width="1.5" :fill="currentIndex === index ? '#177DDC' : '#8C8C8C'" :stroke="currentIndex === index ? '#177DDC' : '#8C8C8C'" />
        <Monitor v-else-if="index === 3" :size="24" :stroke-width="1.5" :fill="currentIndex === index ? '#177DDC' : '#8C8C8C'" :stroke="currentIndex === index ? '#177DDC' : '#8C8C8C'" />
        <User v-else :size="24" :stroke-width="1.5" :fill="currentIndex === index ? '#177DDC' : '#8C8C8C'" :stroke="currentIndex === index ? '#177DDC' : '#8C8C8C'" />
      </view>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { Dashboard, Microscope, Flask, Monitor, User } from '@icon-park/vue-next'

const props = defineProps({
  current: {
    type: Number,
    default: 0
  }
})

const currentIndex = ref(props.current)

const tabList = [
  { pagePath: '/pages/tabs/workbench/workbench', text: '工作台' },
  { pagePath: '/pages/tabs/research/research', text: '科研' },
  { pagePath: '/pages/tabs/lab/lab', text: '实验室' },
  { pagePath: '/pages/tabs/monitor/monitor', text: '物联' },
  { pagePath: '/pages/tabs/mine/mine', text: '我的' }
]

const switchTab = (index) => {
  if (currentIndex.value === index) return
  currentIndex.value = index
  uni.switchTab({
    url: tabList[index].pagePath,
    fail: (err) => {
      console.error('switchTab failed:', err)
    }
  })
}
</script>

<style lang="scss" scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  
  &.active {
    .tab-text {
      color: #177DDC;
      font-weight: 500;
    }
  }
}

.icon-wrapper {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-text {
  font-size: 22rpx;
  color: #8C8C8C;
  margin-top: 6rpx;
}
</style>
