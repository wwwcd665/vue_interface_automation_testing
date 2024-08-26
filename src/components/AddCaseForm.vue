<script>
import apiInfoSVG from "@/assets/testcase/apiInfoSVG.vue"
import assertSVG from "@/assets/testcase/assertSVG.vue"
import caseNameSVG from "@/assets/testcase/caseNameSVG.vue"
import requestBodySVG from "@/assets/testcase/requestBodySVG.vue"
import requestHeaderSVG from "@/assets/testcase/requestHeaderSVG.vue"
import requestParamsSVG from "@/assets/testcase/requestParamsSVG.vue"
import scriptSVG from "@/assets/testcase/scriptSVG.vue"

export default {
  props: ['addCaseForApiInfo'],
  components: {
    apiInfoSVG,
    assertSVG,
    caseNameSVG,
    requestBodySVG,
    requestHeaderSVG,
    requestParamsSVG,
    scriptSVG
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
    }
  }
}
</script>

<template>

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
              :placeholder="this.addCaseForApiInfo.interface_path"
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
        <el-input v-model="input" style="width: 240px" placeholder="Please input"/>
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
        <el-input v-model="input" style="width: 240px" placeholder="Please input"/>
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
        <el-input v-model="input" style="width: 240px" placeholder="Please input"/>
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
        <el-input v-model="input" style="width: 240px" placeholder="Please input"/>
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
        <el-input v-model="input" style="width: 240px" placeholder="Please input"/>
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
        <el-input v-model="input" style="width: 240px" placeholder="Please input"/>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>

</style>