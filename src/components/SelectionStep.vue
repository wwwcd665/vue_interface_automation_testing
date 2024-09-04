<template>
  <!-- 根元素div -->
  <div>
    <!-- 下拉选择框，用于选择全选或取消 -->
    <el-select v-model="selectAll" style="margin-bottom: 10px;" @change="handleSelectAllChange" placeholder="全选&取消" >
      <el-option value="all" label="全部">全部</el-option>
      <el-option value="none" label="取消">取消</el-option>
    </el-select>
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
</template>

<script>
import { mapState } from "vuex"; // 从vuex中导入mapState函数
import { ref, nextTick } from "vue"; // 从vue中导入ref和nextTick函数
import { ElTree, ElSelect, ElOption } from "element-plus"; // 导入Element Plus组件

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
    selectAll: {
      get() {
        return this.selectAllValue; // 获取全选下拉框的值
      },
      set(value) {
        this.handleSelectAllChange(value); // 设置全选下拉框的值
      },
    },
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
    // 处理全选下拉框的值改变
    handleSelectAllChange(value) {
      if (value === "all") {
        this.defaultCheckedKeys = this.getAllIds(this.treeData); // 全选时，获取所有节点的键值
      } else {
        this.defaultCheckedKeys = []; // 取消全选时，清空选中的节点键值
        nextTick(() => {
          this.$refs.treeRef.setCheckedKeys([]); // 清空树形控件选中的节点
        });
      }
    },
    // 处理树形控件复选框状态改变的事件
    handleCheck(node, checked, indeterminate) {
      console.log("1231231",node); // 打印节点信息和选中状态
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
  },
};
</script>

<style scoped>
.filter-tree {
  /* 树形控件样式 */
}
</style>