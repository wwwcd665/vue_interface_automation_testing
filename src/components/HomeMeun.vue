<template>
  <div class="toggle-button" @click="isCollapse = !isCollapse">
    <el-icon :size="20">
      <Expand v-if="isCollapse"/>
      <Fold v-if="!isCollapse"/>
    </el-icon>


  </div>
<!-- 开启路由模式router，菜单会根据index的值进行路由跳转  -->
  <el-menu :collapse="isCollapse" class="el-menu-vertical-demo" default-active="2" router @close="handleClose"
           @open="handleOpen"  el-menu-active-color="#11999e">

    <el-menu-item  v-for="(item,index) in meunoption" :key="index" :index="item.path">
      <el-tooltip :content="item.title" placement="top">
      <el-icon>
        <component :is="item.icon"/>
      </el-icon>
         </el-tooltip>
      <span slot="title">{{ item.title }}</span>
    </el-menu-item>


  </el-menu>
</template>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
  min-height: 400px;
}

.toggle-button {
  font-size: 18px;
  color: black;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  color: black;
  margin-top: 7px;
  border-bottom: 3px solid #11999e;
  padding-bottom: 13px;
}

/* 覆盖Element UI的el-menu的背景颜色 */
.el-menu-vertical-demo {
  background-color: #30e3ca; /* 你希望设置的背景颜色 */
}

/* 如果需要设置toggle-button的背景颜色，可以添加如下样式 */
{
  background-color: #30e3ca
; /* 你希望设置的toggle-button背景颜色 */
}

.el-menu-vertical-demo .el-menu-item {
  color: #11999e; /* 这会影响菜单项的文本和图标颜色 */
}
</style>

<script>
import interfaceManagementSVG from "../assets/interfaceManagementSVG.vue"
import interfaceTestSVG from "../assets/interfaceTastSVG.vue"
import interfaceScenarioSVG from "../assets/interfaceScenarioSVG.vue"
import interfacePlanSVG from "../assets/interfacePlanSVG.vue"
import interfaceEnvSVG from "../assets/interfaceEnvSVG.vue"
import interfaceTaskSVG from "../assets/interfaceTaskSVG.vue"
import interfaceBUGSVG from "../assets/interfaceBUGSVG.vue"
import interfaceStatementSVG from "../assets/interfaceStatementSVG.vue"



export default {
  components: {
    interfaceManagementSVG,
    interfaceTestSVG,
    interfaceScenarioSVG,
    interfacePlanSVG,
    interfaceEnvSVG,
    interfaceTaskSVG,
    interfaceBUGSVG,
    interfaceStatementSVG
  },
  data() {
    return {
      isCollapse: true,
      meunoption: [
        {path: '/project', title: '项目首页', icon: 'House'},
        {path: '/manager', title: '接口管理', icon: 'interfaceManagementSVG'},
        {path: '/test', title: '接口测试', icon: 'interfaceTestSVG'},
        {path: '/scenario', title: '测试场景', icon: 'interfaceScenarioSVG'},
        {path: '/plan', title: '测试计划', icon: 'interfacePlanSVG'},
        {path: '/env', title: '测试环境', icon: 'interfaceEnvSVG'},
        {path: '/task', title: '定时任务', icon: 'interfaceTaskSVG'},
        {path: '/bug', title: 'Bug管理', icon: 'interfaceBUGSVG'},
        {path: '/statement', title: '测试报表', icon: 'interfaceStatementSVG'},

      ]
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>