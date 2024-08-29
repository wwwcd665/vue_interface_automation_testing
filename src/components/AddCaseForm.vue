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
  props: ['selectTestCaseId', 'addCaseForApiId'],
  computed: {
    ...mapState(['activationEnvInfo']),
    formattedRunTime() {
      return this.apiRunResult.run_time.toFixed(2);
    },
    formattedResponseHeaders() {
      // 确保apiRunResult.response_headers存在且不是null
      return this.apiRunResult.response_headers ? JSON.stringify(this.apiRunResult.response_headers, null, 2) : '';
    },
    formattedResponseBody() {
      // 确保apiRunResult.response_headers存在且不是null
      return this.apiRunResult.response_body ? JSON.stringify(this.apiRunResult.response_body, null, 2) : '';
    },
    apiRundRawer() {
      this.apiRunResult = {
        "run_time": 0
      }
    }
  },
  watch: {
    // 监听环境列表变化时，重新请求环境列表数据
    activationEnvInfo(newValue, oldValue) {
      this.queryEnvInfo()
    },
    // 监听选择添加接口按钮，用例输入框重新获取环境信息的请求头，其他信息清空
    addCaseForApiId(newValue, oldValue) {
      this.$api.queryApiList(this.addCaseForApiId.project_id, this.addCaseForApiId.interface_type, this.addCaseForApiId.interface_id).then(resp => {
        if (resp.data.code == 200) {
          const data = resp.data.data[0]
          console.log("addCaseForApiId:", data)
          this.caseInfo = {}
          this.caseInfo.path = data.interface_path
          this.caseInfo.method = data.interface_method
          this.queryEnvInfo()
          // 从父类组件重置selectTestCaseId的值
          this.$emit('resetTestCaseId', '')
        }
      })
    },
    // 选择的用例发生变化时，重新获取用例数据
    selectTestCaseId(newvalue, oldvalue) {
      this.$api.queryCaseInfo(this.selectTestCaseId).then(resp => {
        if (resp.data.code == 200) {
          const data = resp.data.data
          console.log("selectTestCaseId:", data)
          this.caseInfo = {}
          this.caseInfo.caseName = data.case_name
          this.caseInfo.body = data.body
          this.caseInfo.params = data.params
          this.caseInfo.pro_script = data.pro_script
          this.caseInfo.pre_script = data.pre_script
          this.caseInfo.headers = data.headers
          this.caseInfo.case_id = data.case_id
          this.caseInfo.path = data.path
          this.caseInfo.method = data.method
        }
      })


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
      openMenus: ['1', '2', '5', '6'],
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
      },
      // 接口执行结果抽屉
      apiRundRawer: false,
      //   接口运行结果
      apiRunResult: {
        run_time: 0
      },
      addCaseForApiInfo: {}
    }
  },
  methods: {
    // 获取环境信息
    queryEnvInfo() {
      const envID = this.activationEnvInfo.envid
      this.$api.queryEnvInfo(envID).then(resp => {
        if (resp.data.code == 200) {
          this.envList = resp.data.data
          this.caseInfo.headers = resp.data.data.headers
        } else {
          ElMessage.error("获取环境信息异常")
        }
      })
    },
    // 判断新增用例还是更新用例
    operationCase() {
      if (this.caseInfo.case_id == undefined || this.caseInfo.case_id == null || this.caseInfo.case_id == "") {
        console.log("新增用例")
        this.saveCase()
      } else {
        this.updateCase()
      }
    },
    //   保存用例
    saveCase() {
      const data = {
        "interface_id": this.addCaseForApiId.interface_id,
        "case_name": this.caseInfo.caseName,
        "pre_script": this.caseInfo.pre_script,
        "pro_script": this.caseInfo.pro_script,
        "params": this.caseInfo.params,
        "body": this.caseInfo.body,
        "headers": this.caseInfo.headers,
        "method": this.caseInfo.method,
        "path": this.caseInfo.path,
        "project_id": this.addCaseForApiId.project_id
      }
      // 确保没有值的字段也会传递给后端
      const jsonData = JSON.stringify(data, (key, value) => {
        return value === undefined || value === null ? "" : value;
      });
      if (jsonData.case_name == "") {
        ElMessage.error("用例名称不能为空")
      } else {
        this.$api.addCase(jsonData).then(resp => {
          if (resp.data.code == 200) {
            ElMessage.success("保存成功")
            this.$router.go(0);
          } else {
            ElMessage.error("保存失败")
          }
        })
      }
    },
    // 更新用例
    updateCase() {
      const data = {
        "case_id": this.caseInfo.case_id,
        "interface_id": this.addCaseForApiId.interface_id,
        "case_name": this.caseInfo.caseName,
        "pre_script": this.caseInfo.pre_script,
        "pro_script": this.caseInfo.pro_script,
        "params": this.caseInfo.params,
        "body": this.caseInfo.body,
        "headers": this.caseInfo.headers,
        "method": this.caseInfo.method,
        "path": this.caseInfo.path,
        "project_id": this.addCaseForApiId.project_id
      }
      // 确保没有值的字段也会传递给后端
      const jsonData = JSON.stringify(data, (key, value) => {
        return value === undefined || value === null ? "" : value;
      });
      if (jsonData.case_name == "") {
        ElMessage.error("用例名称不能为空")
      } else {
        this.$api.updateCase(jsonData).then(resp => {
          if (resp.data.code == 200) {
            ElMessage.success("更新成功")
            this.$router.go(0);
          } else {
            ElMessage.error("更新失败")
          }
        })
      }
    },
    deleteCase() {
      // 判断selectTestCase不为空
      if (this.caseInfo.case_id == undefined || this.caseInfo.case_id == null || this.caseInfo.case_id == '') {
        ElMessage.warning("请选择要删除的用例")
      } else {
        const case_id = this.caseInfo.case_id
        this.$api.deleteCase(case_id).then(resp => {
          if (resp.data.code == 200) {
            ElMessage.success("删除成功")
            //   删除成功，刷新页面
            this.$router.go(0);

          } else {
            ElMessage.error("删除失败")
          }
        })
      }
    },
    // 判断执行类型，是调试还是执行用例
    runCaseType() {
      //todo 前后置脚本和断言的处理
      if (this.caseInfo.case_id !== undefined && this.caseInfo.case_id !== null && this.caseInfo.case_id !== '') {
        this.runCase()
      } else {
        this.debugrunCase()
      }
      this.apiRundRawer = true
    },
    // 调试用例
    debugrunCase() {
      const data = {
        "url": this.envList.host + this.caseInfo.path,
        "method": this.caseInfo.method,
        "headers": this.caseInfo.header,
        "body": this.caseInfo.body,
        "params": this.caseInfo.params,
        "pre_script": this.caseInfo.pre_script,
        "pro_script": this.caseInfo.pro_script
      }
      const jsonData = JSON.stringify(data, (key, value) => {
        return value === undefined || value === null ? "" : value;
      });
      this.$api.caseRun(jsonData).then(resp => {
        if (resp.data.code == 200) {
          this.apiRunResult = resp.data.data[0]
        }
      })
    },
    // 执行用例
    runCase() {

      const data = {
        "case_id": this.caseInfo.case_id,
        "interface_id": this.addCaseForApiId.interface_id,
        "env_id": this.activationEnvInfo.envid
      }
      // 确保没有值的字段也会传递给后端
      const jsonData = JSON.stringify(data, (key, value) => {
        return value === undefined || value === null ? "" : value;
      });
      this.$api.caseRun(jsonData).then(resp => {
        if (resp.data.code == 200) {
          this.apiRunResult = resp.data.data[0]
        }
      })
    },
    // 执行时间
    apiRundRawerColse() {
      this.apiRunResult = {
        run_time: 0
      }
    }
  }
  ,
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
                :placeholder="this.envList.host+this.caseInfo.path"
            >
              <template #prepend>
                <el-select
                    :placeholder="this.caseInfo.method"
                    size="large"
                    style="width: 160px"
                >
                  <el-option
                      :label="this.caseInfo.method"
                      :value="this.caseInfo.method"
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
                   v-model="this.caseInfo.headers"
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
    <el-button type="primary" style="margin-left: 10px" @click="runCaseType">
      <el-icon>
        <Promotion/>
      </el-icon>
      运行
    </el-button>
    <el-button type="success" style="margin-left: 10px" @click="operationCase">
      <el-icon>
        <Checked/>
      </el-icon>
      保存
    </el-button>
    <el-button type="warning" style="margin-left: 10px" @click="deleteCase">
      <el-icon>
        <DeleteFilled/>
      </el-icon>
      删除
    </el-button>
  </div>

  <!-- 接口执行结果抽屉 -->
  <el-drawer v-model="apiRundRawer" title="接口执行结果" :with-header="true" @close="apiRundRawerColse">
    <el-divider content-position="left">运行结果</el-divider>
    <el-tag type="success" size="large" v-if="apiRunResult.response_result==='OK'">OK</el-tag>
    <el-tag type="error" size="large" v-else>error</el-tag>
    <el-divider content-position="left">运行时间</el-divider>
    <el-input
        v-model="formattedRunTime"
        style="max-width: 600px"
    >
      <template #prepend>接口运行时间:秒</template>
    </el-input>

    <el-divider content-position="left">响应头</el-divider>
    <AceEdit width="100%"
             height="300px"
             v-model="formattedResponseHeaders"
             lang="json"
             theme="chrome"
             :readOnly='false'
    ></AceEdit>
    <el-divider content-position="left">响应体</el-divider>
    <AceEdit width="100%"
             height="300px"
             v-model="formattedResponseBody"
             lang="json"
             theme="chrome"
             :readOnly='false'
    ></AceEdit>
  </el-drawer>

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