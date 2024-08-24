<script>
import InterfaceList from "@/components/InterfaceLis.vue"
import {mapState} from "vuex";
import RequestInfo from "@/components/RequestInfo.vue"
import ResponseInfo from "@/components/ResponseInfo.vue"
import {ElMessage} from 'element-plus';

export default {
  components: {
    InterfaceList,
    RequestInfo,
    ResponseInfo
  },
  computed: {
    ...mapState(['pro', 'activationEnvInfo'])
  },
  methods: {
    runDebugApi() {
      //   判断请求地址是不是http开头的
      if (this.debugAPIInfo.request_url.startsWith('http')) {
        // 直接使用完整的请求路径
        const requestData = {
          "request_url": this.debugAPIInfo.request_url,
          "request_method": this.debugAPIInfo.request_method,
          "request_headers": this.debugAPIInfo.request_headers,
          "request_params": this.debugAPIInfo.request_params,
          "request_body": this.debugAPIInfo.request_body,
          "request_pre_script": this.debugAPIInfo.request_pre_script,
        }
        this.$api.debug(requestData).then(resp => {
          if (resp.data.code == 200) {
            this.debugResponseInfo = resp.data.data
          } else {
            ElMessage.error(resp.data.msg)
          }
        })
      } else if(this.debugAPIInfo.request_url == ""){
        ElMessage.warning('请输入接口地址')
      }
      else {
        // 使用系统内置的环境拼接路径
        if (this.activationEnvInfo.envid) {
          const requestData = {
            "envID": this.activationEnvInfo.envid,
            "request_url": this.debugAPIInfo.request_url,
            "request_method": this.debugAPIInfo.request_method,
            "request_headers": this.debugAPIInfo.request_headers,
            "request_params": this.debugAPIInfo.request_params,
            "request_body": this.debugAPIInfo.request_body,
            "request_pre_script": this.debugAPIInfo.request_pre_script,
            "request_post_script": this.debugAPIInfo.request_post_script,
          }
          this.$api.debug(requestData).then(resp => {
            if (resp.data.code == 200) {
              this.debugResponseInfo = resp.data.data
            } else {
              ElMessage.error(resp.data.msg)
            }
          })

        } else {

          ElMessage.warning('请先选择一个环境')
        }

      }
    }
  },
  data() {
    return {
      // 接口请求方法枚举值
      apiMethods: [
        {value: 'get', label: 'GET'},
        {value: 'post', label: 'POST'},
        {value: 'put', label: 'PUT'},
        {value: 'delete', label: 'DELETE'}],
      debugAPIInfo: {
        request_method: 'get',
        request_url: 'user/login',
        request_headers: '{\n' +
            '    "Content-Length": "54",\n' +
            '    "Content-Type": "application/json",\n' +
            '    "User-Agent": "Apifox/1.0.0 (https://apifox.com)",\n' +
            '    "Accept": "*/*",\n' +
            '    "Host": "127.0.0.1:8809",\n' +
            '    "Accept-Encoding": "gzip, deflate, br",\n' +
            '    "Connection": "keep-alive"\n' +
            '}',
        request_params: '',
        request_body: '{\n' +
            '    "username": "admin",\n' +
            '    "password": "123456"\n' +
            '}',
        request_pre_script: '',
        request_post_script: '',
      },
      debugResponseInfo:''
    }
  }
}
</script>

<template>
  <el-row :gutter="20" style="height: 100%">
    <!--  左侧接口管理列表区域  -->
    <el-col :span="10">
      <div class="common-layout">
        <el-container>
          <el-header class="title">接口管理</el-header>
          <el-divider style="margin: -5px 0"/>
          <el-main>
            <el-tabs type="border-card">
              <el-tab-pane label="项目内部接口">
                <InterfaceList :tabType="0"></InterfaceList>
              </el-tab-pane>
              <el-tab-pane label="外部接口">
                <InterfaceList :tabType="1"></InterfaceList>
              </el-tab-pane>
            </el-tabs>
          </el-main>
        </el-container>
      </div>
    </el-col>
    <!--  右侧接口调试区域  -->
    <el-col :span="14">
      <div class="grid-content">
        <el-container>
          <el-header class="title">接口调试</el-header>
          <el-divider style="margin: -5px 0"/>
          <el-main>
            <el-input
                v-model="debugAPIInfo.request_url"
                style="max-width: 800px"
                placeholder="输入接口地址"
            >
              <template #prepend>
                <el-select
                    v-model="debugAPIInfo.request_method"
                    placeholder="请求方法"
                    size="large"
                    style="width: 160px"
                >
                  <el-option
                      v-for="item in apiMethods"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </template>
            </el-input>
            <el-button type="success" size="large" style="background: #30e3ca;color: black " @click="runDebugApi">运行
            </el-button>
          </el-main>
        </el-container>
        <RequestInfo :debugAPIInfo="debugAPIInfo" @update:debugAPIInfo="debugAPIInfo = $event"></RequestInfo>
        <ResponseInfo :debugResponseInfo="this.debugResponseInfo"></ResponseInfo>
      </div>
    </el-col>

  </el-row>
</template>

<style scoped>
.common-layout {
  border: 2px solid #30e3ca;
  height: 100%;
}

.grid-content {
  border: 2px solid #30e3ca;
  height: 100%;
}

.title {
  font: 25px "微软雅黑";
  text-align: center;
  padding-top: 20px;
}
</style>