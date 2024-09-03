<script>
import AceEdit from "@/components/AceEdit.vue"
import {mapState} from "vuex";
import interfaceEnvSVG from "@/assets/interfaceEnvSVG.vue"
import {ElMessage, ElMessageBox} from 'element-plus';


export default {
  components: {
    AceEdit,
    interfaceEnvSVG
  },
  computed: {
    ...mapState(['pro','activationEnv'])
  },
  created() {
    this.queryEnvList(this.pro.project_id)
  },
  data() {
    return {
      AddEnvFormVisible: false,
      AddEnvForm: {
        AddEnvName: '',
      },
      rules: {
        AddEnvName: [
          {required: true, message: '请输入环境名称', trigger: 'blur'},
        ]
      },
      jsonData: '',
      pyData: '',
      envListL: [],
      envInfoID: '',
      envInfo: {
        envname: '',
        host: '',
        headers: '',
        dbhost: '',
        dbport: '',
        dbuser: '',
        dbpassword: '',
        tool_func: '',
        variables: '',
        variables_table: [],

      }
    }
  },
  methods: {
    addEnvList() {
      const params = {
        envname: this.AddEnvForm.AddEnvName,
        projectid: this.pro.project_id
      }
      this.$refs.rules.validate(async (valid) => {
        if (valid) {
          const resp = await this.$api.addEnvList(params)
          if (resp.data.code == 200) {
            ElMessage({
              message: '环境添加成功',
              type: 'success',
            });
            this.AddEnvFormVisible = false;
            this.AddEnvName = '';
            this.queryEnvList(this.pro.project_id)
          } else {
            ElMessage({
              message: resp.data.msg,
              type: 'error',
            });
          }
        } else {
          ElMessage({
            message: '环境名称不能为空',
            type: 'error',
          });
        }
      })

    },
    async queryEnvList() {
      const res = await this.$api.queryEnvList(this.pro.project_id)
      this.envListL = res.data.data
      console.log(res.data.data)
    },
    openAddEnvList() {
      this.AddEnvFormVisible = true
      this.AddEnvForm.AddEnvName = ''
    },
    deleteEnvList(id) {
      console.log('id:', id)
      ElMessageBox.confirm('确认删除项目?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 调用后端API进行删除操作
        this.$api.delEnvList(id).then(response => {
          if (response.data.code == 200) {
            // 显示成功消息
            ElMessage({
              type: 'success',
              message: '项目删除成功',
            });
            this.queryEnvList()
            this.envInfo = {}
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
    async switchEnvInfo(id) {
      this.envInfoID = id
      this.envInfo.envname = ''
      const res = await this.$api.queryEnvInfo(id)
      if (res.data.code == 200 && res.data.data) {
        this.envInfo = res.data.data

        // 转换变量，表格形式显示
        if (res.data.data.variables) {
          const tableData = JSON.parse(res.data.data.variables)
          let variables = Object.entries(tableData).map(([key, value]) => {
            return {
              name: key, // 假设 date 是变量名
              date: value // name 是变量值
            };
          });
          this.envInfo.variables_table = variables
        }
      }
    },
    async saveEnvInfo() {
      const params = {
        envid: this.envInfoID,
        envname: this.envInfo.envname,
        host: this.envInfo.host,
        headers: this.envInfo.headers,
        dbhost: this.envInfo.dbhost,
        dbport: this.envInfo.dbport,
        dbuser: this.envInfo.dbuser,
        dbpassword: this.envInfo.dbpassword,
        variables: this.envInfo.variables,
        tool_func: this.envInfo.tool_func
      }
        // 确保没有值的字段也会传递给后端
      const jsonData = JSON.stringify(params, (key, value) => {
        return value === undefined || value === null ? "" : value;
      });
      const resp = await this.$api.saveEnvInfo(jsonData)
      if (resp.data.code == 200) {
        ElMessage({
          message: '环境保存成功',
          type: 'success',
        });
        this.queryEnvList()
      } else {
        ElMessage({
          message: resp.data.msg,
          type: 'error',
        });
      }
    }
  }
}

</script>

<template>
  <el-row :gutter="20" style="height: 100%">
    <el-col :span="4">
      <div class="env_list">
        <div class="env_add">
          <interfaceEnvSVG style="height: 20px;width: 20px; margin-bottom: -2px "></interfaceEnvSVG>
          <span class="env_text">测试环境</span>
          <el-button plain size="small" style="  margin-bottom: 7px;" @click="openAddEnvList">
            <el-icon>
              <Plus/>
            </el-icon>
            添加
          </el-button>
        </div>
        <el-menu>
          <el-menu-item v-for="(item,index) in envListL"
                        :key="item.envid" class="env_item"
                        @click="switchEnvInfo(item.envid)"
          ><span>{{ item.envname }}</span>
            <el-tooltip
                class="box-item"
                effect="dark"
                content="删除环境"
                placement="top"
            >
              <el-icon style="float: right; margin-left: 10px;" @click="deleteEnvList(item.envid)">
                <CircleClose/>
              </el-icon>
            </el-tooltip>

          </el-menu-item>

        </el-menu>

      </div>
    </el-col>
    <el-col :span="10">
      <div class="env_info">
        <!--  环境基本信息      -->
        <el-divider content-position="left">环境基本信息</el-divider>
        <el-input
            v-model="envInfo.envname"
            style="max-width: 600px"
            placeholder="环境名称"
        >
          <template #prepend>环境名称</template>
        </el-input>
        <el-input
            v-model="envInfo.host"
            style="max-width: 600px"
            placeholder="host"
        >
          <template #prepend>环境域名</template>
        </el-input>
        <!--    请求头&数据库    -->
        <el-divider content-position="left">请求头&数据库</el-divider>
        <el-tabs type="border-card" style="height: 310px">
          <el-tab-pane label="请求头" class="env_head">
            <AceEdit style="height:250px"
                     v-model="envInfo.headers"
                     lang="json"
                     theme="chrome"
                     :readOnly='false'
            ></AceEdit>
          </el-tab-pane>
          <el-tab-pane label="数据库" class="env_db">
            <div class="env_db_table">
              <el-input
                  v-model="envInfo.dbhost"
                  style="max-width: 600px"
                  placeholder="host"
              >
                <template #prepend>域名</template>
              </el-input>
              <el-input
                  v-model="envInfo.dbport"
                  style="max-width: 600px"
                  placeholder="port"
              >
                <template #prepend>端口</template>
              </el-input>
              <el-input
                  v-model="envInfo.dbuser"
                  style="max-width: 600px"
                  placeholder="user"
              >
                <template #prepend>账号</template>
              </el-input>
              <el-input
                  v-model="envInfo.dbpassword"
                  style="max-width: 600px"
                  placeholder="password"
              >
                <template #prepend>密码</template>
              </el-input>
            </div>
          </el-tab-pane>
        </el-tabs>
        <!--   全局变量     -->
        <el-divider content-position="left">全局变量</el-divider>
        <el-tabs type="border-card">
          <el-tab-pane label="全局变量" class="env_variable">
            <AceEdit style="height:250px"
                     v-model="envInfo.variables"
                     lang="json"
                     theme="chrome"
                     :readOnly='false'
            ></AceEdit>
          </el-tab-pane>
          <el-tab-pane label="表格形式显示" class="env_variable_table">
            <el-table :data="envInfo.variables_table" stripe style="width: 100%"
                      border
                      show-overflow-tooltip
            >
              <el-table-column prop="name" label="变量名" width="200"/>
              <el-table-column prop="date" label="变量值"/>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="调试运行">Role</el-tab-pane>

        </el-tabs>
        <div class="env_info_button">
          <el-button type="success" round @click="saveEnvInfo">保存环境</el-button>
          <el-button type="danger" round @click="deleteEnvList(this.envInfoID)">删除环境</el-button>
        </div>
      </div>
    </el-col>
    <el-col :span="10">
      <div class="env_tool">
        <el-divider content-position="left">全局工具函数</el-divider>
        <AceEdit height="750px"
                 v-model="envInfo.tool_func"
                 lang="python"
                 theme="chrome"
                 :readOnly='false'
        ></AceEdit>
      </div>
    </el-col>
  </el-row>

  <!-- 添加环境弹窗 -->
  <el-dialog v-model="AddEnvFormVisible"
             title="添加环境" width="500">
    <el-form :model="AddEnvForm" :rules="rules" ref="rules">
      <el-form-item label="环境名称" :label-width="formLabelWidth" prop="AddEnvName">
        <el-input v-model="AddEnvForm.AddEnvName" placeholder="输入环境名称" autocomplete="off"
                  maxlength="20"
                  minlength="1" show-word-limit/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="AddEnvFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addEnvList" color="#11999e">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>


</template>

<style scoped>
/*环境页面左侧列表*/
.env_list {
  border: 2px solid #30e3ca;
  height: 100%;
  padding: 0 10px;
}

/* 环境列表上部 */
.env_add {
  height: 40px;
  margin: 0 auto;
  line-height: 40px;
  border-bottom: 2px solid #30e3ca;
}

.env_add .env_text {
  margin-left: 5px;
  margin-right: 20px;
  font: 22px "微软雅黑";
  color: #11999e; /* 字体颜色应单独指定 */
}

/* 环境列表 */
.env_item {
  width: 100%; /* 确保每个菜单项占据全部宽度 */
  background: #11999e;
  margin-top: 2px;
  display: flex; /* 使用Flexbox布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.env_item span {
  width: 100%; /* 确保span占据全部宽度 */
  text-align: center;
  color: #40514e;
}

/* 中间的环境信息 */
.env_info {
  border: 2px solid #30e3ca;
  height: 100%;
}


/* 右侧工具函数 */
.env_tool {
  border: 2px solid #30e3ca;
  height: 100%;
}


/* 环境信息按钮 */
.env_info_button {
  padding-top: 2px;
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center;
}
</style>