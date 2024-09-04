<script>
import {VueDraggableNext} from 'vue-draggable-next'
import {ElMessage,ElMessageBox} from "element-plus";
import {mapState} from "vuex";
import SelectionStep from "@/components/SelectionStep.vue"

export default {
  components: {
    draggable: VueDraggableNext,
    SelectionStep,

  },
  computed: {
    ...mapState(['activationEnvInfo', 'pro'])
  },
  created() {
    this.querySceneList()
  },
  data() {
    return {
      // 场景信息
      scene_info: {
        scene_id :'',
        scene_name: '',
        steps: []
      },
      // 场景列表
      scene_list: [],
      addStepDrawer:false,

    };
  },
  methods: {
    onEnd(evt) {
      ElMessage({
        message: '拖动结束',
        type: 'success',
      })
    },
    addScene(){
      this.scene_info={}
    },
    saveScene() {
      if (this.scene_info.name == '') {
        ElMessage({
          message: '场景名称不能为空',
          type: 'error',
        })
        return
      }
      const data = {
        scene_name: this.scene_info.name,
        steps: this.scene_info.steps,
        project_id: this.pro.project_id
      }
          // 确保没有值的字段也会传递给后端
      const jsonData = JSON.stringify(data, (key, value) => {
        return value === undefined || value === null ? "" : value;
      });
      this.$api.saveScene(jsonData).then(resp => {
        if (resp.data.code == 200) {
          ElMessage({
            message: '场景保存成功',
            type: 'success',
          });
        //   重新请求数据
          this.querySceneList()
        } else {
          ElMessage({
            message: resp.data.msg,
            type: 'error',
          });
        }
      })
    },
    deleteScene(){
      ElMessageBox.confirm('确认删除项目?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 调用后端API进行删除操作
        this.$api.delScene(this.scene_info.scene_id).then(response => {
          if (response.data.code == 200) {
            // 显示成功消息
            ElMessage({
              type: 'success',
              message:'项目删除成功',
            })
            this.querySceneList()
          }else {
            ElMessage({
              message: "删除失败",
              type: 'error',
            });
          }
        })
      })
    },
    querySceneList(scene_id,scene_name) {
      const project_id = this.pro.project_id
      this.$api.querySceneList(project_id, scene_id).then(resp => {
        if (resp.data.code == 200) {
          if (scene_id == null) {
            this.scene_list = resp.data.data
          }else{
            this.scene_info.scene_name =scene_name
            this.scene_info.steps = resp.data.data
            this.scene_info.scene_id = scene_id
          }
        } else {
          ElMessage({
            message: resp.data.msg,
            type: 'error',
          });
        }
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
            <el-button type="success" round style="margin-top: 20px;margin-left: -10px" @click="addScene" >
              <el-icon>
                <Plus/>
              </el-icon>
              添加场景
            </el-button>
          </el-col>
        </el-row>
        <el-divider style="margin: -5px 0"/>
        <el-main>
          <el-menu v-for="item in scene_list" :key="item.scene_id"
                   @open="handleOpen"
                   @close="handleClose"
          >
            <el-menu-item :index="item.scene_id" @click="querySceneList(item.scene_id,item.scene_name )" >
              <el-icon>
                <List/>
              </el-icon>
              {{ item.scene_name }}
            </el-menu-item>
          </el-menu>
        </el-main>
      </div>
    </el-col>
    <!-- 右侧用例详情区域  -->
    <el-col :span="18">
      <div class="scene_info">
        <el-header class="title">测试场景信息</el-header>
        <el-divider content-position="left">场景名称</el-divider>
        <el-input
            v-model="scene_info.scene_name"
            style="max-width: 700px;margin-left: 10px"
            placeholder="输入场景名称"
        >
          <template #prepend>场景名称</template>
        </el-input>
        <el-button type="primary" style="margin-left: 10px" @click="saveScene">
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
        <el-button type="danger" @click="deleteScene">
          <el-icon>
            <Delete/>
          </el-icon>
          删除
        </el-button>

        <el-divider content-position="left" style="margin-top: 40px">场景步骤</el-divider>
        <el-button type="success" style="margin-left: 20px" @click="addStepDrawer = true">
          <el-icon>
            <ZoomIn/>
          </el-icon>
          添加步骤
        </el-button>
        <el-main style="max-height: calc(100vh - 300px)">
          <draggable v-model="list" :options="{ handle: '.handle' } " @start="onStart" @end="onEnd">
            <div v-for="item in scene_info.steps" :key="item.step_id" class="case">
              <el-menu
              >
                <el-menu-item :index="item.step_id">
                  <div style="width: 80%;">
                  {{ item.step_name }}
                    </div>
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


<!-- 添加步骤抽屉 -->
   <el-drawer v-model="addStepDrawer" title="添加步骤" :with-header="true">
     <el-tabs type="border-card">
    <el-tab-pane label="项目内部接口" >
<SelectionStep :apiType="0"></SelectionStep>
    </el-tab-pane>
    <el-tab-pane label="外部接口" >
<SelectionStep :apiType="1"></SelectionStep>
    </el-tab-pane>
  </el-tabs>
     <el-button type="success" >确定</el-button>
  </el-drawer>
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
  margin-top: -25px;
}

.el-menu-item {
  border-bottom: 1px solid #30e3ca; /* 蓝色边框 */
}
</style>