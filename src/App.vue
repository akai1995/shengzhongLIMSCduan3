<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import '@/static/styles/public.scss';

page {
  background-color: #F7F7F7;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 28rpx;
  color: #262626;
  line-height: 1.5;
  box-sizing: border-box;
}

view, text {
  box-sizing: border-box;
}

image {
  display: block;
}

.page-container {
  min-height: 100vh;
  background-color: #F7F7F7;
  padding-bottom: 120rpx;
}
</style>
