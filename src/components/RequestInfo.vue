<script>
import AceEdit from "@/components/AceEdit.vue"

export default {
  // 声明父类传递的数据
  props: ['debugAPIInfo'],
  // 声明组件
  components: {
    AceEdit
  },
  data() {
    return {
      // 为父组件的属性创建子组件的属性状态，方便监听
      localRequestHeaders: this.debugAPIInfo.request_headers,
      localRequestParams: this.debugAPIInfo.request_params,
      localRequestBody: this.debugAPIInfo.request_body,
      localRequestPreScript: this.debugAPIInfo.request_pre_script,
      localRequestPostScript: this.debugAPIInfo.request_post_script,
    }
  },
  watch: {
    // 监听子组件的数据变化，使用emit事件通知父组件更新户数
    localRequestHeaders(newVal) {
      this.$emit('update:debugAPIInfo', {...this.debugAPIInfo, request_headers: newVal});
    },
    localRequestParams(newVal) {
      this.$emit('update:debugAPIInfo', {...this.debugAPIInfo, request_params: newVal});
    },
    localRequestBody(newVal) {
      this.$emit('update:debugAPIInfo', {...this.debugAPIInfo, request_body: newVal});
    },
    localRequestPreScript(newVal) {
      this.$emit('update:debugAPIInfo', {...this.debugAPIInfo, request_pre_script: newVal});
    },
    localRequestPostScript(newVal) {
      this.$emit('update:debugAPIInfo', {...this.debugAPIInfo, request_post_script: newVal});
    }
  }

}
</script>

<template>
  <el-divider content-position="left" style="margin: 5px 0;">请求信息</el-divider>
  <el-tabs type="border-card" style="    margin-top: 15px;">
    <el-tab-pane label="请求头(headers)">
      <AceEdit style="height:250px"
               v-model="localRequestHeaders"
               lang="json"
               theme="chrome"
               :readOnly='false'
      ></AceEdit>
    </el-tab-pane>
    <el-tab-pane label="查询参数(params)">
      <AceEdit style="height:250px"
               v-model="localRequestParams"
               lang="json"
               theme="chrome"
               :readOnly='false'
      ></AceEdit>
    </el-tab-pane>
    <el-tab-pane label="请求体(body)">
      <AceEdit style="height:250px"
               v-model="localRequestBody"
               lang="json"
               theme="chrome"
               :readOnly='false'
      ></AceEdit>
    </el-tab-pane>
    <el-tab-pane label="前置脚本">
      <AceEdit style="height:250px"
               v-model="localRequestPreScript"
               lang="json"
               theme="chrome"
               :readOnly='false'
      ></AceEdit>
    </el-tab-pane>
    <el-tab-pane label="后置脚本">
      <AceEdit style="height:250px"
               v-model="localRequestPostScript"
               lang="json"
               theme="chrome"
               :readOnly='false'
      ></AceEdit>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>