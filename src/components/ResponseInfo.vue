<script>

import AceEdit from "@/components/AceEdit.vue";

export default ({
  components: {
    AceEdit
  },
  data() {
    return {
      debugApiInfo: {
        response: ''
      }
    }
  }
})
</script>

<template>
  <el-divider content-position="left" style="margin: 15px 0;">响应数据</el-divider>
  <div>
    <AceEdit style="height:250px"
             v-model="debugApiInfo.response"
             lang="json"
             theme="chrome"
             height="300px"
             :readOnly='false'
    ></AceEdit>
  </div>
</template>

<style scoped>

</style>