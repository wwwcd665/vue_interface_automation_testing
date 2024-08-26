<script>

import {defineComponent} from "vue";
import InterfaceList from "@/components/InterfaceLis.vue";
import {mapState} from "vuex";
import CaseManager from "@/components/CaseManager.vue"
import AddCaseForm from "@/components/AddCaseForm.vue";

export default defineComponent({
  created() {
  },
  computed: {...mapState(['pro'])},
  components: {InterfaceList, CaseManager, AddCaseForm},
  data() {
    return {
      interfaceListData: [],
      // 保存激活的接口类型标签页，0项目接口，1外部接口
      apiTypetags: '',
      addCaseForApiInfo: {}
    }
  },
  methods: {
    getAddTestCaseAPIInfo(data) {
      this.addCaseForApiInfo = data
    }
  }
})
</script>

<template>
  <el-row :gutter="20" style="height: 100%">
    <!-- 左侧用例列表区域 -->
    <el-col :span="6">
      <div class="api_list">
        <el-header class="title">用例管理</el-header>
        <el-divider style="margin: -5px 0"/>
        <el-main>
          <el-tabs type="border-card">
            <el-tab-pane label="项目内部接口">
              <CaseManager :tabType="0" @addTestCaseInfo="getAddTestCaseAPIInfo"></CaseManager>
            </el-tab-pane>
            <el-tab-pane label="外部接口">
              <CaseManager :tabType="1" @addTestCaseInfo="getAddTestCaseAPIInfo"></CaseManager>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </div>
    </el-col>
    <!-- 右侧用例详情区域  -->
    <el-col :span="18">
      <div class="case_info">
        <AddCaseForm :addCaseForApiInfo="this.addCaseForApiInfo"></AddCaseForm>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
/*用例列表区域*/
.api_list {
  border: 2px solid #30e3ca;
  height: 100%;
}

/*用例编辑区域*/
.case_info {
  border: 2px solid #30e3ca;
  height: 100%;
}


.title {
  font: 25px "微软雅黑";
  text-align: center;
  padding-top: 20px;
}
</style>