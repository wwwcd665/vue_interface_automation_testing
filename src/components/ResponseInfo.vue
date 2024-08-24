<template>
  <el-divider content-position="left" style="margin: 15px 0;">响应数据</el-divider>
  <div>
    <AceEdit style="height:250px"
             v-model="debugResponseInfoStr"
             lang="json"
             theme="chrome"
             height="300px"
             :readOnly='false'
    ></AceEdit>
  </div>
</template>

<script>
import AceEdit from "@/components/AceEdit.vue";

export default ({
  props: ['debugResponseInfo'],
  components: {
    AceEdit
  },
  data() {
    return {
      debugResponseInfoStr: '', // 初始化为一个空字符串
    };
  },
  watch: {
    // 当 debugResponseInfo 发生变化时，更新 debugResponseInfoStr
    debugResponseInfo(newVal) {
      this.debugResponseInfoStr = typeof newVal === 'object' ? JSON.stringify(newVal, null, 2) : newVal;
    }
  }
})
</script>