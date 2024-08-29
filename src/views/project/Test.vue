<script>

import {defineComponent} from "vue";
import InterfaceList from "@/components/InterfaceLis.vue";
import {mapState} from "vuex";
import CaseManager from "@/components/CaseManager.vue"
import AddCaseForm from "@/components/AddCaseForm.vue";

export default defineComponent({
  created() {
  },
  watch: {
    // selectTestCase(newvalue, oldvalue) {
    //   // 值更新，子组件的值对应更新
    //   // this.$refs.addCaseForm.selectTestCase(newvalue)
    //   console.log("newvalue:", newvalue)
    // }
  },
  computed: {...mapState(['pro'])},
  components: {InterfaceList, CaseManager, AddCaseForm},
  data() {
    return {
      interfaceListData: [],
      // 保存激活的接口类型标签页，0项目接口，1外部接口
      apiTypetags: '',
      // 保存添加用例的接口信息
      addCaseForApiId: {

      },
      //   保存查看的用例信息
      selectTestCaseId: {

      }

    }
  },
  methods: {
    getAddTestCaseAPIInfo(data) {
      // this.selectTestCase = {
      //
      // }
      console.log("getAddTestCaseAPIInfo-data:", data)
      this.addCaseForApiId = data
    },
    getSelectTestCase(data) {
      console.log("getSelectTestCase-data:", data)
      this.selectTestCaseId = data
    },
    resetTestCaseId(){
      this.selectTestCaseId = ""
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
              <CaseManager :tabType="0" @addTestCaseInfo="getAddTestCaseAPIInfo"
                           @selectTestCase="getSelectTestCase"></CaseManager>
            </el-tab-pane>
            <el-tab-pane label="外部接口">
              <CaseManager :tabType="1" @addTestCaseInfo="getAddTestCaseAPIInfo"
                           @selectTestCase="getSelectTestCase"></CaseManager>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </div>
    </el-col>
    <!-- 右侧用例详情区域  -->
    <el-col :span="18">
      <div class="case_info">
        <AddCaseForm :selectTestCaseId="this.selectTestCaseId" :addCaseForApiId="this.addCaseForApiId" @resetTestCaseId="resetTestCaseId"></AddCaseForm>
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