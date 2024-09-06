<script>
import AceEdit from "@/components/AceEdit.vue";

export default {
  props: ["runResult"],
  components: {AceEdit},
  methods: {},
  computed: {
    formattedHeaders() {
      return this.runResult.map(item => ({
        ...item,
        response_headers: JSON.stringify(item.response_headers, null, 2),
        response_body: JSON.stringify(item.response_body, null, 2),
        request_info: JSON.stringify(item.request_info, null, 2)
      }));
    }
  }

}


</script>

<template>

  <el-tabs type="border-card">
    <el-tab-pane v-for="(item,index) in formattedHeaders" :label="item.case_name">
      <el-divider content-position="left">运行结果</el-divider>
      <el-tag type="success" size="large" v-if="item.reason==='OK'">OK</el-tag>
      <el-tag type="error" size="large" v-else>error</el-tag>
      <el-divider content-position="left">运行时间</el-divider>
      <el-input
          v-model="item.run_time"
          style="max-width: 600px"
          disabled
      >
        <template #prepend>接口运行时间:秒</template>
      </el-input>
      <el-divider content-position="left">响应头</el-divider>
      <AceEdit width="100%"
               height="300px"
               v-model="item.response_headers"
               lang="json"
               theme="chrome"
               :readOnly='false'
      ></AceEdit>
      <el-divider content-position="left">响应体</el-divider>
      <AceEdit width="100%"
               height="300px"
               lang="json"
               v-model="item.response_body"
               theme="chrome"
               :readOnly='false'
      ></AceEdit>
      <el-divider content-position="left">实际请求信息</el-divider>
      <AceEdit width="100%"
               height="300px"
               lang="json"
               v-model="item.request_info"
               theme="chrome"
               :readOnly='false'
      ></AceEdit>
    </el-tab-pane>
  </el-tabs>


</template>


<style scoped>

</style>