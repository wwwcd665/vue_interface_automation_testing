<script>
import InterfaceList from "@/components/InterfaceLis.vue"
import {mapMutations,mapState} from "vuex";

export default {
  components: {
    InterfaceList
  },
  computed:{
    ...mapState(['pro'])
  },
  methods: {

  }
}
</script>

<template>
  <el-row :gutter="20" style="height: 100%">
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
              <el-tab-pane label="外部接口" >
                <InterfaceList :tabType="1"></InterfaceList>
              </el-tab-pane>
            </el-tabs>
          </el-main>
        </el-container>
      </div>
    </el-col>
    <el-col :span="14">
      <div class="grid-content">
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