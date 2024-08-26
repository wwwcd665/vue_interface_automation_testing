<script>
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
    }
  },
  methods: {
    async queryApiList(proId, interfaceType) {
      console.log('1111111', interfaceType);
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
    addTestCase(itme){
      this.$emit('addTestCaseInfo',itme)
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
  <el-row class="tac">
    <el-menu
        default-active="2"
        class="el-menu-demo"
        style="width: 100%;"
        v-for="item in interfaceListData"
    >
      <el-divider style="margin: 5px 0"/>
      <el-sub-menu index="1">
        <template #title>
          <div style="width: 66px">
            <el-tag :type="getTagType(item.interface_method)">
              {{ item.interface_method.toUpperCase() }}
            </el-tag>
          </div>
          <span>{{ item.interface_name }}</span>
        </template>
        <el-menu-item-group>
          <el-divider style="margin: 5px 0"/>
           <el-menu-item :index="item.interface_id">
            <el-icon><List /></el-icon>
            登录成功
          </el-menu-item>
          <el-divider style="margin: 5px 0"/>
          <el-menu-item index="1-1" @click="addTestCase(item)">
            <el-icon>
              <CirclePlusFilled/>
            </el-icon>
            添加用例
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-row>
</template>

<style scoped>

</style>