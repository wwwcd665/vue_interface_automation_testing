<script>
import {ElMessage, ElMessageBox} from 'element-plus';
import {mapState} from "vuex";

export default {
  // 声明接收父组件传递的tabType属性，保存打开的接口类型标签页
  props: ['tabType'],
  computed: {
    ...mapState(['pro'])
  },
  // 侦听器，接口类型标签页变化时，重新请求接口列表数据
  watch: {
    tabType(newValue, oldValue) {
      this.queryApiList(this.pro.project_id, newValue)
    }
  },
  data() {
    return {
      interfaceListData: [],
      // 是否显示新增和编辑接口抽屉&判断新增还是编辑
      apiFormVisible: false,
      editStatus: false,
      // 保存接口类型标签页
      apiTypetags: '',
      //   接口显示信息
      apiInfo: {
        interface_name: '',
        interface_path: '',
        interface_method: '',
        interface_type: '',
        interface_id: ''
      },

      // 接口请求方法枚举值
      apiMethods: [
        {value: 'get', label: 'GET'},
        {value: 'post', label: 'POST'},
        {value: 'put', label: 'PUT'},
        {value: 'delete', label: 'DELETE'}
      ],
      apiTypes: [
        {value: '0', label: '项目内部接口'},
        {value: '1', label: '外部接口'}
      ],
      rules: {
        // 新增编辑接口信息校验
        apiInfo: {
          interface_name: [
            {required: true, message: '请输入接口名称', trigger: 'blur'},
          ],
          interface_path: [
            {required: true, message: '请输入接口地址', trigger: 'blur'},
          ],
          interface_method: [
            {required: true, message: '请选择请求方法', trigger: 'blur'},
          ],
          interface_type: [
            {required: true, message: '请选择接口类型', trigger: 'blur'},
          ],
        }
      }
    }
  },
  methods: {
    async queryApiList(proId, interfaceType) {
      this.apiTypetags = interfaceType
      const res = await this.$api.queryApiList(proId, interfaceType)
      this.interfaceListData = res.data.data

    },
    getTagType(method) {
      const methodMap = {
        'GET': 'primary',
        'POST': 'success',
        'PUT': 'warning',
        'DELETE': 'danger'
      };
      return methodMap[method.toUpperCase()] || 'info'; // 默认为 'info'
    },
    openAddAPIForm() {
      this.apiFormVisible = true
      this.editStatus = true
    },
    openEditAPIForm(interfaceID) {
      this.apiFormVisible = true
      this.editStatus = false
      this.$api.queryApiList(this.pro.project_id, this.apiTypetags, interfaceID).then(resp => {
        if(resp.data.code == 200) {
          console.log("12312",resp.data.data[0])
          this.apiInfo = resp.data.data[0]
        }
      })

    },
    confirmClick(){
      if(this.editStatus) {
        this.addApiList()
      } else {
        this.updateApiList()
      }
    },
    addApiList() {
      this.$refs.apiForm.validate(async valid => {
        if (valid) {
          const params = {
            interface_name: this.apiInfo.interface_name,
            interface_path: this.apiInfo.interface_path,
            interface_method: this.apiInfo.interface_method,
            interface_type: this.apiInfo.interface_type,
            project_id: this.pro.project_id,
          }
          const resp = await this.$api.addApiList(params)
          if (resp.data.code == 200) {
            this.apiFormVisible = false
            ElMessage({
              message: '新增接口成功',
              type: 'success',
            })
            this.queryApiList(this.pro.project_id, this.apiTypetags)
            this.apiInfo = {}
          } else {
            ElMessage({
              message: '新增接口失败',
              type: 'error',
            })
          }
        }
      })
    },
    cancelClick() {
      this.apiFormVisible = false
      this.apiInfo = {}
    },
    handleClick(interfaceId) {
      ElMessageBox.confirm('确认删除该接口?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 调用后端API进行删除操作
        this.$api.delApiList(interfaceId).then(response => {
          if (response.data.code == 200) {
            // 显示成功消息
            ElMessage({
              type: 'success',
              message: '接口删除成功',
            });
            this.queryApiList(this.pro.project_id, this.apiTypetags)
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
    updateApiList() {
      this.$refs.apiForm.validate(async valid => {
        if (valid) {
          const params = {
            interface_name: this.apiInfo.interface_name,
            interface_path: this.apiInfo.interface_path,
            interface_method: this.apiInfo.interface_method,
            interface_type: this.apiInfo.interface_type,
            interface_id: this.apiInfo.interface_id,
          }
          const resp = await this.$api.updateApiList(params)
          if (resp.data.code == 200) {
            ElMessage({
              message: '接口更新成功',
              type: 'success',
            });
            this.apiFormVisible = false
            this.apiInfo = {}
            this.queryApiList(this.pro.project_id, this.apiTypetags)
          } else {
            ElMessage({
              message: resp.data.msg,
              type: 'error',
            });
          }
        }
      }).catch(error => {
        ElMessage({
          message: '接口更新失败',
          type: 'error',
        });
      });
    }

  },
  created() {
    const interfaceType = this.tabType
    const proId = this.pro.project_id
    this.queryApiList(proId, interfaceType)
  }
}
</script>

<template>
  <el-button type="success" round size="small" color="#11999e" @click="openAddAPIForm">添加接口</el-button>
  <el-table :data="interfaceListData" style="width: 100%;height: 650px" stripe border fixed-header>
    <el-table-column prop="interface_name" label="接口名称" width="130px"/>
    <el-table-column prop="interface_path" label="接口地址" width="240px"/>
    <el-table-column label="请求方法" width="100px">
      <template #default="scope">
        <el-tag :type="getTagType(scope.row.interface_method)">
          {{ scope.row.interface_method.toUpperCase() }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="100px">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="openEditAPIForm(scope.row.interface_id)">编辑</el-button>
        <el-button link type="primary" size="small" @click="handleClick(scope.row.interface_id)">
          删除
        </el-button>

      </template>
    </el-table-column>
  </el-table>

  <!-- 新增编辑接口抽屉 -->
  <el-drawer v-model="apiFormVisible" :title="this.editStatus ? '新增接口' : '编辑接口'" with-header
             :direction="direction">
    <template #default>
      <el-form :model="apiInfo" :rules="rules.apiInfo" ref="apiForm">
        <div>
          <el-form-item label="接口名称" prop="interface_name" required>
            <el-input
                v-model="apiInfo.interface_name"
                style="max-width: 600px;height:40px"
                placeholder="接口名称"
                maxlength="20"
            >
              <template #prepend>接口名称</template>
            </el-input>
          </el-form-item>
          <el-form-item label="接口地址" prop="interface_path" required>
            <el-input
                v-model="apiInfo.interface_path"
                style="max-width: 600px;height:40px"
                placeholder="接口地址"
            >
              <template #prepend>接口地址</template>
            </el-input>
          </el-form-item>
          <el-form-item label="请求方法" prop="interface_method" required>
            <el-select
                v-model="apiInfo.interface_method"
                placeholder="选择接口请求方法"
                size="large"
                style="width: 240px"
            >
              <el-option
                  v-for="item in apiMethods"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="接口类型" prop="interface_type" required>
            <el-select
                v-model="apiInfo.interface_type"
                placeholder="选择接口类型"
                size="large"
                style="width: 240px"
            >
              <el-option
                  v-for="item in apiTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick" style="background: #11999e">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>

</style>