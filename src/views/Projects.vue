<script>
import {ElMessage, ElMessageBox} from 'element-plus';
import {mapMutations} from "vuex";


export default {
  data() {
    return {
      // 项目列表显示用
      ProjectList: [{
        project_name: '',
        project_leader: '',
        project_desc: ''
      }],
      ProjectFormVisible: false,
      editStatus: false,
      // 新增的编辑弹窗用
      operationProjectForm: {
        project_name: "",
        project_id: "",
        project_leader: window.sessionStorage.getItem('username'),
        project_desc: "",

      },
      ProjectFormrules: {
        project_name: [
          {required: true, message: '请输入项目名', trigger: 'blur'},
        ],
        project_leader: [
          {required: true, message: '请输入负责人', trigger: 'blur'},
        ],
      }

    }
  },
  methods: {
    ...mapMutations(['updateProInfo']),
    logout() {
      window.sessionStorage.removeItem('token')
      ElMessage({
        message: '已注销登录！',
        type: 'info',
      })
      this.$router.push({
        name: "login"
      })
    },
    async queryAll() {
      await this.$api.queryPro().then(
          resp => {
            const data = resp.data.data
            this.ProjectList = data
          })
    },
    deletePro(id) {
      ElMessageBox.confirm('确认删除项目?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 调用后端API进行删除操作
        this.$api.deletePro(id).then(response => {
          if (response.data.code == 200) {
            // this.ProjectList
            // 显示成功消息
            ElMessage({
              type: 'success',
              message: '项目删除成功',
            });
            this.queryAll()
          } else {
            // 删除失败，显示错误消息
            ElMessage({
              type: 'error',
              message: '项目删除失败: ' + response.data.msg,
            });
          }
        }).catch(error => {
          // 处理API调用错误
          ElMessage({
            type: 'error',
            message: '项目删除失败，服务器错误',
          });
        });
      }).catch(() => {
        // 用户取消删除
        ElMessage({
          type: 'info',
          message: '删除操作已取消',
        });
      });
    },
    clearProjectForm() {
      this.operationProjectForm.project_name = '';
      this.operationProjectForm.project_desc = '';
      this.operationProjectForm.project_id = '';
      this.operationProjectForm.project_leader = window.sessionStorage.getItem('username');
    },
    subPro() {
      if (this.editStatus) {
        this.editProject()
      } else {
        this.addProject()
      }
    },
    closeProjectForm() {
      this.ProjectFormVisible = false;
      this.editStatus = false;
      this.clearProjectForm()
    },
    addProject() {
      this.$refs.ProjectFormrules.validate(async (valid) => {
        if (valid) {
          const resp = await this.$api.addPro(this.operationProjectForm)
          if (resp.data.code == 200) {
            ElMessage({
              message: '项目添加成功',
              type: 'success',
            });
            this.ProjectFormVisible = false;
            this.operationProjectForm.project_name = '';
            this.operationProjectForm.project_desc = '';
            this.operationProjectForm.project_id = '';

            this.queryAll()
          } else {
            ElMessage({
              message: resp.data.msg,
              type: 'error',
            });
          }
        } else {
          return false;
        }
      });

    },
    async editProjectForm(id) {
      this.editStatus = true
      this.ProjectFormVisible = true
      const resp = await this.$api.queryPro(id)
      this.operationProjectForm = resp.data.data[0]
    },
    editProject() {
      // 调用更新接口
      this.$refs.ProjectFormrules.validate(async (valid) => {
        if (valid) {
          const resp = await this.$api.updatePro(this.operationProjectForm)
          if (resp.data.code == 200) {
            ElMessage({
              message: '项目更新成功',
              type: 'success',
            });
            this.ProjectFormVisible = false;
            this.editStatus = false;
            this.clearProjectForm()
            this.queryAll()
          } else {
            ElMessage({
              message: resp.data.msg,
              type: 'error',
            });
          }
          this.clearProjectForm()
        }

      })
    },
    inProject(pro_info) {
      // 将项目信息传递给store
      this.updateProInfo(pro_info)
      // 跳转到项目详情页面
      this.$router.push({
        name: "home"
      })

    }

  },
  created() {
    this.queryAll()
  },
  watch: {
    ProjectFormVisible(newValue, oldValue) {
      if (!newValue) { // 如果弹窗被关闭（失去焦点）
        this.clearProjectForm(); // 调用清理函数
        this.editStatus = false; // 重置编辑状态
      }
    },
  },
}
</script>

<template>
  <div class="pro_box">
    <!-- 顶部区域 -->
    <div class="top_box">
      <div class="title">项目列表</div>
      <div class="btn_box">
        <el-button type="success" size="default" icon="Plus" @click="ProjectFormVisible = true" color="#11999e">
          添加项目
        </el-button>
        <el-button type="success" size="default" icon="User" @click='logout' color="#11999e">退出登录</el-button>
      </div>
    </div>
    <!-- 项目列表区域 -->
    <div>

      <el-row :gutter="20">
        <el-col :span="4" v-for="item in ProjectList" :key="item.project_id">
          <el-card class="box_card">
            <!--    项目描述弹窗         -->
            <el-popover
                placement="top-start"
                title="项目描述"
                :width="200"
                trigger="hover"
                :content="item.project_desc"
            >
              <template #reference>
                <div class="pro_info" @click="inProject(item)">
                  <!--    项目图标区域        -->
                  <div>
                    <el-icon class="icon_box" size="20">
                      <DataBoard/>
                    </el-icon>
                  </div>
                  <!--   项目名称区域          -->
                  <div class="pro_name">
                    <span>{{ item.project_name }}</span>
                  </div>
                  <!--    项目负责人        -->
                  <div class="leader">
                    <span> 项目负责人：{{ item.project_leader }}</span>
                  </div>
                </div>
              </template>
            </el-popover>

            <!--    操作按钮          -->
            <div class="btns">
              <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="编辑项目信息"
                  placement="bottom"
              >
                <el-button size="small" icon="Edit" @click="editProjectForm(item.project_id)" color="#30e3ca">编辑
                </el-button>
              </el-tooltip>
              <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="删除项目"
                  placement="bottom"
              >
                <el-button type="info" size="small" icon="Delete" @click="deletePro(item.project_id)" color="#40514e">
                  删除
                </el-button>
              </el-tooltip>

            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>


  <!-- 新增项目弹窗 -->
  <el-dialog v-model="ProjectFormVisible"
             :title="this.editStatus ? '编辑项目' : '新增项目'" width="500">
    <el-form :model="operationProjectForm" :rules="ProjectFormrules" ref="ProjectFormrules">
      <el-form-item label="项目名称" :label-width="formLabelWidth" prop="project_name">
        <el-input v-model="operationProjectForm.project_name" placeholder="输入项目名称" autocomplete="off"
                  maxlength="20"
                  minlength="1" show-word-limit/>
      </el-form-item>
      <el-form-item label="项目负责人" :label-width="formLabelWidth" prop="project_leader">
        <el-input v-model="operationProjectForm.project_leader" autocomplete="off" maxlength="20" minlength="1"
                  show-word-limit/>
      </el-form-item>
      <div style="margin: 20px 0"/>
      <el-input

          style="width: 470px"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="请输入项目描述"
          v-model="operationProjectForm.project_desc"
          maxlength="100" minlength="1" show-word-limit
      />
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeProjectForm">取消</el-button>
        <el-button type="primary" @click="subPro" color="#11999e">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>


</template>

<style scoped>
.pro_box {
  max-width: 88%;
  margin: 0 auto;
  padding-top: 40px;
}

/* 顶部区域样式 */
.top_box {
  border-bottom: solid 5px #11999e;
  height: 34px;
}

/* 顶部的文字 */
.top_box .title {
  float: left;
  color: #11999e;
  font: bold 27px/32px '微软雅黑';
}

/*按钮区域  */
.top_box .btn_box {
  float: right;

}

/*项目列表区域 */
.box_card {
  height: 240px;
  width: 180px;
  margin: 0 auto;
  margin-top: 40px;
}

/* 卡片样式 */
.pro_info {
  text-align: center;
  height: 185px;
  cursor: pointer;

}

.pro_info .icon_box {
  background: #30e3ca;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 auto;
  text-align: center;
}

.pro_info .pro_name {
  padding-top: 22px;
  font: bold 20px/20px '微软雅黑';
}

.pro_info .leader {
  font: 10px/10px '微软雅黑';
  color: #c2bfb7;
  padding-top: 10px;
}

.btns {
  height: 100px;
}


</style>