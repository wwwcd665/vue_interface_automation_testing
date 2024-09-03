<script>
import {VueDraggableNext} from 'vue-draggable-next'
import {ElMessage} from "element-plus";

export default {
  components: {
    draggable: VueDraggableNext
  },
  data() {
    return {
      list: [
        {id: 1, name: 'Item 1'},
        {id: 2, name: 'Item 2'},

      ]
    };
  },
  methods: {
    onEnd(evt) {
     ElMessage({
       message: '拖动结束',
       type: 'success',
     })
    }
  }

}
</script>

<template>
  <el-row :gutter="20" style="height: 100%">
    <!-- 左侧用例列表区域 -->
    <el-col :span="6">
      <div class="scene_list">
        <el-row :gutter="20">
          <el-col :span="17">
            <el-header class="title">场景管理</el-header>
          </el-col>
          <el-col :span="7">
            <el-button type="success" round style="margin-top: 20px;margin-left: -10px">
              <el-icon>
                <Plus/>
              </el-icon>
              添加场景
            </el-button>
          </el-col>
        </el-row>
        <el-divider style="margin: -5px 0"/>
        <el-main>
        </el-main>
      </div>
    </el-col>
    <!-- 右侧用例详情区域  -->
    <el-col :span="18">
      <div class="scene_info">
        <el-header class="title">测试场景信息</el-header>
        <el-divider content-position="left">场景名称</el-divider>
        <el-input
            v-model="input1"
            style="max-width: 700px;margin-left: 10px"
            placeholder="Please input"
        >
          <template #prepend>场景名称</template>
        </el-input>
        <el-button type="primary" style="margin-left: 10px">
          <el-icon>
            <FolderOpened/>
          </el-icon>
          保存
        </el-button>
        <el-button type="success">
          <el-icon>
            <Position/>
          </el-icon>
          运行
        </el-button>
        <el-button type="danger">
          <el-icon>
            <Delete/>
          </el-icon>
          删除
        </el-button>

        <el-divider content-position="left" style="margin-top: 40px">场景步骤</el-divider>
        <el-button type="success" style="margin-left: 20px">
          <el-icon>
            <ZoomIn/>
          </el-icon>
          添加步骤
        </el-button>
        <el-main style="max-height: calc(100vh - 300px)">
          <draggable v-model="list" :options="{ handle: '.handle' } " @start="onStart" @end="onEnd">

            <div v-for="item in list" :key="item.id" class="case">
              <el-menu
              >
                <el-menu-item :index="item.id">
                  {{ item.name }}
                  <div class="but">
                    <el-button type="primary" size="small">编辑</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                  </div>
                </el-menu-item>
              </el-menu>
            </div>

          </draggable>
        </el-main>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
/*用例列表区域*/
.scene_list {
  border: 2px solid #30e3ca;
  height: 100%;
}

/*用例编辑区域*/
.scene_info {
  border: 2px solid #30e3ca;
  height: 100%;
}


.title {
  font: 25px "微软雅黑";
  text-align: center;
  padding-top: 20px;
}

.case {
  width: 100%;
  //margin-left: 20px;
}

.but {
  margin-left: 80%;
  margin-top: -25px;
}

.el-menu-item {
  border-bottom: 1px solid #30e3ca; /* 蓝色边框 */
}
</style>