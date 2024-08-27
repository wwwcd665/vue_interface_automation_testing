<script>
import apiInfoSVG from "@/assets/testcase/apiInfoSVG.vue"
import assertSVG from "@/assets/testcase/assertSVG.vue"
import caseNameSVG from "@/assets/testcase/caseNameSVG.vue"
import requestBodySVG from "@/assets/testcase/requestBodySVG.vue"
import requestHeaderSVG from "@/assets/testcase/requestHeaderSVG.vue"
import requestParamsSVG from "@/assets/testcase/requestParamsSVG.vue"
import scriptSVG from "@/assets/testcase/scriptSVG.vue"
import {mapState} from "vuex";
import AceEdit from "@/components/AceEdit.vue";
import {ElMessage} from 'element-plus';

export default {
  props: ['addCaseForApiInfo', 'selectTestCase'],
  computed: {
    ...mapState(['activationEnvInfo'])
  },
  watch: {
    // 监听环境列表变化时，重新请求环境列表数据
    activationEnvInfo(newValue, oldValue) {
      this.queryEnvInfo()
    },
    // 选择的用例发生变化时，重新获取用例数据
    selectTestCase(newvalue, oldvalue) {
      this.caseInfo.caseName = this.selectTestCase.case_name
      this.caseInfo.body = this.selectTestCase.body
      this.caseInfo.params = this.selectTestCase.params
      this.caseInfo.pro_script = this.selectTestCase.pro_script
      this.caseInfo.pre_script = this.selectTestCase.pre_script
      this.caseInfo.header = this.selectTestCase.headers
      this.caseInfo.case_id = this.selectTestCase.case_id
      this.addCaseForApiInfo.interface_path = this.selectTestCase.path
      this.addCaseForApiInfo.interface_method= this.selectTestCase.method
    }
  },
  components: {
    apiInfoSVG,
    assertSVG,
    caseNameSVG,
    requestBodySVG,
    requestHeaderSVG,
    requestParamsSVG,
    scriptSVG,
    AceEdit
  },
  data() {
    return {
      openMenus: ['1', '2'],
      // 接口请求方法枚举值
      apiMethods: [
        {value: 'get', label: 'GET'},
        {value: 'post', label: 'POST'},
        {value: 'put', label: 'PUT'},
        {value: 'delete', label: 'DELETE'}],
      //   环境信息
      envList: [],
      //   用例信息
      caseInfo: {
        caseName: "",
        pre_script: "",
        pro_script: "",
        params: "",
        body: "",
        header: ""
      }
    }
  },
  methods: {
    // 获取环境信息
    queryEnvInfo() {
      const envID = this.activationEnvInfo.envid
      console.log('envID:', envID)
      this.$api.queryEnvInfo(envID).then(resp => {
        if (resp.data.code == 200) {
          this.envList = resp.data.data
          this.caseInfo.header = resp.data.data.headers
        } else {
          ElMessage.error("获取环境信息异常")
        }
      })
    },
    //   保存用例
    saveCase() {
      const data = {
        "interface_id": this.addCaseForApiInfo.interface_id,
        "case_name": this.caseInfo.caseName,
        "pre_script": this.caseInfo.pre_script,
        "pro_script": this.caseInfo.pro_script,
        "params": this.caseInfo.params,
        "body": this.caseInfo.body,
        "header": this.caseInfo.header,
        "method": this.addCaseForApiInfo.interface_method,
        "path": this.addCaseForApiInfo.interface_path,
        "project_id": this.addCaseForApiInfo.project_id
      }
      if (data.case_name == "") {
        ElMessage.error("用例名称不能为空")
      } else {
        this.$api.addCase(data).then(resp => {
          if (resp.data.code == 200) {
            ElMessage.success("保存成功")
          } else {
            ElMessage.error("保存失败")
          }
        })
      }
    }
  },
  created() {
    this.queryEnvInfo()


  }
}
</script>

<template>
  <!-- calc()函数用于执行CSS表达式 -->
  <div style=" max-height: calc(100vh - 110px); overflow-y: auto;">
    <el-menu
        class="el-menu-demo"
        style="width: 100%;"
        :default-openeds="openMenus"
    >
      <!--  API信息 -->
      <el-divider style="margin: 5px 0"/>
      <el-sub-menu index="1">
        <template #title>
          <el-icon>
            <apiInfoSVG/>
          </el-icon>
          <span>API信息</span>
        </template>
        <el-menu-item-group>
          <el-main style="margin-top: -25px">
            <el-input
                style="max-width: 999px"
                :placeholder="this.envList.host+this.addCaseForApiInfo.interface_path"
            >
              <template #prepend>
                <el-select
                    :placeholder="this.addCaseForApiInfo.interface_method"
                    size="large"
                    style="width: 160px"
                >
                  <el-option
                      :label="this.addCaseForApiInfo.interface_method"
                      :value="this.addCaseForApiInfo.interface_method"
                  />
                </el-select>
              </template>
            </el-input>
          </el-main>
        </el-menu-item-group>
      </el-sub-menu>
      <!-- 用例名称 -->
      <el-divider style="margin: 5px 0"/>
      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <caseNameSVG/>
          </el-icon>
          <span>用例名称</span>
        </template>
        <el-menu-item-group>
          <el-main style="margin-top: -25px">
            <el-input
                v-model="caseInfo.caseName"
                style="max-width: 999px"
                placeholder="输入用例名称"
            >
              <template #prepend>用例名称</template>
            </el-input>
          </el-main>
        </el-menu-item-group>
      </el-sub-menu>
      <!-- 前置脚本 -->
      <el-divider style="margin: 5px 0"/>
      <el-sub-menu index="3">
        <template #title>
          <el-icon>
            <scriptSVG/>
          </el-icon>
          <span>前置脚本</span>
        </template>
        <el-menu-item-group>
          <AceEdit width="70%"
                   v-model="this.caseInfo.pre_script"
                   lang="python"
                   theme="chrome"
                   :readOnly='false'
          ></AceEdit>
          <div class="script_button"></div>
        </el-menu-item-group>
      </el-sub-menu>
      <!-- 请求头 -->
      <el-divider style="margin: 5px 0"/>
      <el-sub-menu index="4">
        <template #title>
          <el-icon>
            <request-body-s-v-g/>
          </el-icon>
          <span>请求头</span>
        </template>
        <el-menu-item-group>
          <AceEdit style="height:250px"
                   v-model="this.caseInfo.header"
                   lang="json"
                   theme="chrome"
                   :readOnly='false'
          ></AceEdit>
        </el-menu-item-group>
      </el-sub-menu>
      <!-- 查询参数 -->
      <el-divider style="margin: 5px 0"/>
      <el-sub-menu index="5">
        <template #title>
          <el-icon>
            <request-params-s-v-g/>
          </el-icon>
          <span>查询参数</span>
        </template>
        <el-menu-item-group>
          <AceEdit style="height:250px"
                   v-model="this.caseInfo.params"
                   lang="json"
                   theme="chrome"
                   :readOnly='false'
          ></AceEdit>
        </el-menu-item-group>
      </el-sub-menu>
      <!-- 请求体 -->
      <el-divider style="margin: 5px 0"/>
      <el-sub-menu index="6">
        <template #title>
          <el-icon>
            <request-body-s-v-g/>
          </el-icon>
          <span>请求体</span>
        </template>
        <el-menu-item-group>
          <AceEdit style="height:250px"
                   v-model="this.caseInfo.body"
                   lang="json"
                   theme="chrome"
                   :readOnly='false'
          ></AceEdit>
        </el-menu-item-group>
      </el-sub-menu>
      <!-- 后置&断言脚本 -->
      <el-divider style="margin: 5px 0"/>
      <el-sub-menu index="7">
        <template #title>
          <el-icon>
            <assert-s-v-g/>
          </el-icon>
          <span>后置&断言脚本</span>
        </template>
        <el-menu-item-group>
          <AceEdit width="70%"
                   v-model="this.caseInfo.pro_script"
                   lang="python"
                   theme="chrome"
                   :readOnly='false'
          ></AceEdit>
          <div class="script_button"></div>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>
  <el-divider style="margin: 1px 0"/>
  <div class="button-container">
    <el-button type="primary" style="margin-left: 10px">
      <el-icon>
        <Promotion/>
      </el-icon>
      运行
    </el-button>
    <el-button type="success" style="margin-left: 10px" @click="saveCase">
      <el-icon>
        <Checked/>
      </el-icon>
      保存
    </el-button>
    <el-button type="warning" style="margin-left: 10px">
      <el-icon>
        <DeleteFilled/>
      </el-icon>
      删除
    </el-button>
  </div>
</template>

<style scoped>
/* 前后置脚本旁边的按钮 */
.script_button {
  float: right;
  height: 100px;
  width: 12vw;
  margin-right: 9vw;
  background: #30e3ca;
  transform: translateY(-220px);
}

.button-container {
  text-align: center;
}

.button-container button {
  margin: 0 30px;
}

</style>