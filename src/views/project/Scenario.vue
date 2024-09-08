<script>

import {VueDraggableNext} from 'vue-draggable-next'
import {ElMessage, ElMessageBox} from "element-plus";
import {mapState} from "vuex";
import SelectionStep from "@/components/SelectionStep.vue"
import scriptSVG from "@/assets/testcase/scriptSVG.vue";
import apiInfoSVG from "@/assets/testcase/apiInfoSVG.vue";
import requestParamsSVG from "@/assets/testcase/requestParamsSVG.vue";
import AceEdit from "@/components/AceEdit.vue";
import caseNameSVG from "@/assets/testcase/caseNameSVG.vue";
import assertSVG from "@/assets/testcase/assertSVG.vue";
import requestBodySVG from "@/assets/testcase/requestBodySVG.vue";
import RunResult from "@/components/RunResult.vue"
import AddCaseForm from "@/components/AddCaseForm.vue";
export default {
  components: {
    requestBodySVG, assertSVG, caseNameSVG, AceEdit, requestParamsSVG, apiInfoSVG, scriptSVG,
    draggable: VueDraggableNext,
    SelectionStep,
    RunResult,AddCaseForm

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
        scene_id: '',
        scene_name: '',
        steps: []
      },
      // 场景列表
      scene_list: [],
      addStepDrawer: false,
      editStepDrawer: false,

      // 编辑步骤
      editStepForm: {},
      openMenus: ["1", "2", "6"],

      editCaseId:null,
      interface_id:"",

      // 运行结果抽屉
      apiRundRawer :false,
      // 保存运行结果
      runResult :{}

    };
  },
  methods: {
    onEnd(evt) {
      ElMessage({
        message: '拖动成功',
        type: 'success',
      })
    },
    addScene() {
      this.scene_info = {}
    },
    judge() {
      if (this.scene_info.scene_id == undefined || this.scene_info.scene_id == null || this.scene_info.scene_id == "") {
        this.saveScene()
      } else {
        this.updateScene()
      }
    },
    updateScene() {
      const data = {
        scene_id: this.scene_info.scene_id,
        scene_name: this.scene_info.scene_name,
        steps: this.scene_info.steps,
        project_id: this.pro.project_id
      }
      // 确保没有值的字段也会传递给后端
      const jsonData = JSON.stringify(data, (key, value) => {
        return value === undefined || value === null ? "" : value;
      });
      this.$api.updateScene(jsonData).then(resp => {
        if (resp.data.code == 200) {
          ElMessage({
            message: '场景修改成功',
            type: 'success',
          });
          //   刷新整个页面
          this.$router.go(0);

        } else {
          ElMessage({
            message: resp.data.msg,
            type: 'error',
          });
        }
      })
    },
    saveScene() {
      if (this.scene_info.scene_name == undefined || this.scene_info.scene_name == '' || this.scene_info.scene_name == null) {
        ElMessage({
          message: '场景名称不能为空',
          type: 'error',
        })
        return
      }
      const data = {
        scene_name: this.scene_info.scene_name,
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
          //   刷新整个页面
          this.$router.go(0);

        } else {
          ElMessage({
            message: resp.data.msg,
            type: 'error',
          });
        }
      })
    },
    deleteScene() {
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
              message: '项目删除成功',
            })
            this.querySceneList()
          } else {
            ElMessage({
              message: "删除失败",
              type: 'error',
            });
          }
        })
      }).catch(() => {
        // 用户取消删除
        ElMessage({
          type: 'info',
          message: '删除操作已取消',
        });
      });
    },
    querySceneList(scene_id, scene_name) {
      const project_id = this.pro.project_id
      this.$api.querySceneList(project_id, scene_id).then(resp => {
        if (resp.data.code == 200) {
          if (scene_id == null) {
            this.scene_list = resp.data.data
          } else {
            this.scene_info.scene_name = scene_name
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
    },
    // 接收选择的节点数据
    checkedNodes(data) {
      this.addStepDrawer = false
      //   遍历data，获取 case_id: 10, case_name: '接口1'，追加到scene_info.step列表中
      data.forEach(item => {
        // 创建一个新对象，将 item 的属性复制到新对象中
        const newItem = {...item};
        // 将新对象添加到 scene_info.steps 列表中
        this.scene_info.steps.push(newItem);
      });
    },
    deleteStep(case_id) {
      // 根据  case_id查找元素的索引
      const index = this.scene_info.steps.findIndex(item => item.case_id === case_id);
      // 如果找到了，则删除该元素
      if (index !== -1) {
        this.scene_info.steps.splice(index, 1);
      }
    },
    editStep(id,interface_id) {
      this.editStepDrawer = true
      this.editCaseId = id
      this.interface_id = interface_id
      this.$api.queryCaseInfo(id).then(resp => {
        this.editStepForm = resp.data.data
      })
    },
    updateStep() {
      ElMessageBox.confirm('将同步修改用例数据，确认修改?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const data = {
          "case_id": this.editStepForm.case_id,
          "interface_id": this.editStepForm.interface_id,
          "case_name": this.editStepForm.case_name,
          "pre_script": this.editStepForm.pre_script,
          "pro_script": this.editStepForm.pro_script,
          "params": this.editStepForm.params,
          "body": this.editStepForm.body,
          "headers": this.editStepForm.headers,
          "method": this.editStepForm.method,
          "path": this.editStepForm.path,
          "project_id": this.editStepForm.project_id
        }
        // 确保没有值的字段也会传递给后端
        const jsonData = JSON.stringify(data, (key, value) => {
          return value === undefined || value === null ? "" : value;
        });
        this.$api.updateCase(jsonData).then(resp => {
          if (resp.data.code == 200) {
            ElMessage.success("更新成功")
            this.$router.go(0);
          } else {
            ElMessage.error("更新失败")
          }
        })
      }).catch(() => {
            // 用户取消删除
            ElMessage({
              type: 'info',
              message: '删除操作已取消',
            });
          }
      )
    },
    runScene() {
      const data = {
        env_id: this.activationEnvInfo.envid,
        project_id: this.pro.project_id,
        scene_id: this.scene_info.scene_id,
        scene_name: this.scene_info.scene_name,
        steps: this.scene_info.steps
      }
      // 确保没有值的字段也会传递给后端
      const jsonData = JSON.stringify(data, (key, value) => {
        return value === undefined || value === null ? "" : value;
      });
      this.$api.runScene(jsonData).then(resp => {
        if (resp.data.code == 200) {
          ElMessage({
            message: '场景执行成功',
            type: 'success',
          });
          this.runResult = resp.data.data
          this.apiRundRawer = true
        } else {
          ElMessage({
            message: resp.data.msg,
            type: 'error',
          });
        }
      })
    }
  },


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
            <el-button type="success" round style="margin-top: 20px;margin-left: -10px" @click="addScene">
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
            <el-menu-item :index="item.scene_id" @click="querySceneList(item.scene_id,item.scene_name )">
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
        <el-button type="primary" style="margin-left: 10px" @click="judge">
          <el-icon>
            <FolderOpened/>
          </el-icon>
          保存
        </el-button>
        <el-button type="success" @click="runScene">
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
          <draggable v-model="scene_info.steps" :options="{ handle: '.handle' } " @start="onStart" @end="onEnd">
            <div v-for="item in scene_info.steps" :key="item.case_id" class="case">
              <el-menu
              >
                <el-menu-item :index="item.case_id">
                  <div style="width: 80%;">
                    {{ item.case_name }}
                  </div>
                  <div class="but">
                    <el-button type="primary" size="small" @click="editStep(item.case_id,item.interface_id)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteStep(item.case_id)">删除</el-button>
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
      <el-tab-pane label="项目内部接口">
        <SelectionStep :apiType="0" @checkedNodes="checkedNodes"></SelectionStep>
      </el-tab-pane>
      <el-tab-pane label="外部接口">
        <SelectionStep :apiType="1" @checkedNodes="checkedNodes"></SelectionStep>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>

  <!-- 编辑步骤抽屉 -->
  <el-drawer v-model="editStepDrawer" :title="'编辑步骤-'+editStepForm.case_name" :with-header="true" width="400px">
<!--  :init="1" 代表场景页面编辑用例  -->
  <AddCaseForm :selectTestCaseId="this.editCaseId" :interface_id="this.interface_id" :init="1" ></AddCaseForm>
  </el-drawer>



  <!-- 运行结果抽屉 -->
  <el-drawer v-model="apiRundRawer" :title="'执行结果-'+scene_info.scene_name" :with-header="true" width="20%">
    <RunResult :runResult="runResult"></RunResult>
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
}

.but {
  margin-top: -25px;
}

.el-menu-item {
  border-bottom: 1px solid #30e3ca; /* 蓝色边框 */
}
</style>