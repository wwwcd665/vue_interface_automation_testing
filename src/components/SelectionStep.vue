<template>
  <!-- 根元素div -->
  <div>
    <!-- 树形控件，用于展示和选择接口 -->
    <el-tree
        ref="treeRef"
        class="filter-tree"
        :data="treeData"
        node-key="interface_id"
        highlight-current
        default-expand-all
        show-checkbox
        :default-checked-keys="defaultCheckedKeys"
        @check="handleCheck"
    ></el-tree>
  </div>
  <el-divider/>
  <el-button type="success" @click="printCheckedNodes">确定</el-button>
</template>

<script>
import {mapState} from "vuex"; // 从vuex中导入mapState函数
import {ElOption, ElSelect, ElTree} from "element-plus"; // 导入Element Plus组件

export default {
  components: {
    ElTree, // 注册树形控件组件
    ElSelect, // 注册下拉选择框组件
    ElOption, // 注册下拉选择框选项组件
  },
  props: ["apiType"], // 接收外部传入的apiType属性
  watch: {
    // 监听apiType属性的变化
    apiType(newValue, oldValue) {
      this.queryApiList(); // 当apiType变化时，调用queryApiList方法
    },
  },
  data() {
    return {
      interfaceListData: [], // 存储接口列表数据
      treeData: [], // 存储树形数据
      defaultCheckedKeys: [], // 存储默认选中的节点键值
    };
  },
  computed: {
    // 映射vuex中的state
    ...mapState(["pro"]),

  },
  created() {
    this.queryApiList(); // 组件创建时调用queryApiList方法获取数据
  },
  methods: {
    // 异步获取接口列表数据
    async queryApiList() {
      const res = await this.$api.queryApiList(this.pro.project_id, this.apiType);
      this.interfaceListData = res.data.data; // 存储接口列表数据
      this.treeData = this.transformToTreeData(this.interfaceListData); // 转换数据为树形结构
    },
    // 处理树形控件复选框状态改变的事件
    handleCheck(node, checked, indeterminate) {
      console.log("1231231", node); // 打印节点信息和选中状态
    },
    // 递归获取所有节点的键值
    getAllIds(nodes) {
      let ids = [];
      nodes.forEach((node) => {
        ids.push(node.interface_id); // 将当前节点的键值加入数组
        if (node.children) {
          ids = [...ids, ...this.getAllIds(node.children)]; // 递归获取子节点的键值
        }
      });
      return ids;
    },
    // 将接口列表数据转换为树形数据
    transformToTreeData(data) {
      return data.map(item => {
        return {
          ...item,
          children: item.cases.map(caseItem => ({
            ...caseItem,
            label: caseItem.case_name, // 子节点显示名称为案例名称
            case_id: caseItem.case_id, // 使用案例ID作为唯一标识符
          })),
        };
      }).filter(item => item.children && item.children.length > 0); // 过滤掉没有子节点的项
    },
    printCheckedNodes() {
      // 获取树组件实例
      const tree = this.$refs.treeRef;
      // 只获取子节点的数据
      const checkedNodes = tree.getCheckedNodes(true);
      // 使用 getCheckedNodes 方法获取所有勾选的节点
      // const checkedNodes = tree.getCheckedNodes();
      // 发送数据
      this.$emit('checkedNodes', checkedNodes);

      // 清空所有勾选
      // 清空 defaultCheckedKeys 以确保 Vue 重新渲染树组件
      this.defaultCheckedKeys = [];

      // 使用 nextTick 确保 DOM 更新完成后重新设置树数据
      this.$nextTick(() => {
        this.treeData = [...this.treeData]; // 强制 Vue 重新渲染树组件
        tree.setCheckedKeys([]); // 再次尝试清空所有勾选
      });


    }
  }
};
</script>

<style scoped>
.filter-tree {
  /* 树形控件样式 */
}
</style>