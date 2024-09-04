<template>
    		<el-tree
            v-model="selectedNode"
            :data="deptOptions"
            :props="{ label: 'title', children: 'children' }"	
            :render-after-expand="false"
            node-key="stationId"	
            show-checkbox		
            check-strictly		
            highlight-current
            default-expand-all
            @check="handleCheck"	
            :filter-node-method="filterNode"
            ref="deptTreeRef"
            class="stafftree"
        />

</template>
<script setup>
import {ref} from 'vue'
    const deptOptions = ref([{
		"stationId": "8cd174b0-6c38-43f4-97b6-b64832b34d9a",
		"parentId": "",
		"title": "线路1",
		"children": [{
				"stationId": "cf5f8c07-a882-4e24-aec8-0983660c1dc9",
				"parentId": "8cd174b0-6c38-43f4-97b6-b64832b34d9a",
				"title": "车站2",
				"children": [{
						"stationId": "1cf5f8c07-a882-4e24-aec8-0983660c1dc9",
						"parentId": "cf5f8c07-a882-4e24-aec8-0983660c1dc9",
						"title": "计算机联锁图册",
						"children": [],
					},
					{
						"stationId": "2cf5f8c07-a882-4e24-aec8-0983660c1dc9",
						"parentId": "cf5f8c07-a882-4e24-aec8-0983660c1dc9",
						"title": "区间自动闭塞图册",
						"children": [],
					}
				],
				"disabled": false
			},
			{
				"stationId": "ef59bc57-aa42-43b8-960f-ce9caf745484",
				"parentId": "8cd174b0-6c38-43f4-97b6-b64832b34d9a",
				"title": "车站1",
				"children": [{
						"stationId": "1ef59bc57-aa42-43b8-960f-ce9caf745484",
						"parentId": "ef59bc57-aa42-43b8-960f-ce9caf745484",
						"title": "计算机联锁图册",
						"children": [],
					},
					{
						"stationId": "2ef59bc57-aa42-43b8-960f-ce9caf745484",
						"parentId": "ef59bc57-aa42-43b8-960f-ce9caf745484",
						"title": "区间自动闭塞图册",
						"children": [],
					}
				],
				"disabled": false
			}
		],
		"disabled": false
	},
		{
		"stationId": "5226d1f5-b85f-46c7-b05f-157815d590b8",
		"parentId": "",
		"title": "线路3",
		"children": [{
				"stationId": "cd8a7881-a2f0-4490-afe0-44bd639c149e",
				"parentId": "5226d1f5-b85f-46c7-b05f-157815d590b8",
				"title": "车站2",
				"children": [{
						"stationId": "1cd8a7881-a2f0-4490-afe0-44bd639c149e",
						"parentId": "cd8a7881-a2f0-4490-afe0-44bd639c149e",
						"title": "计算机联锁图册",
						"children": [],
					},
					{
						"stationId": "2cd8a7881-a2f0-4490-afe0-44bd639c149e",
						"parentId": "cd8a7881-a2f0-4490-afe0-44bd639c149e",
						"title": "区间自动闭塞图册",
						"children": [],
					}
				],
				"disabled": false
			},
			{
				"stationId": "289103d4-0d1f-4c3e-93b5-e382b0a58044",
				"parentId": "5226d1f5-b85f-46c7-b05f-157815d590b8",
				"title": "车站1",
				"children": [{
						"stationId": "1289103d4-0d1f-4c3e-93b5-e382b0a58044",
						"parentId": "289103d4-0d1f-4c3e-93b5-e382b0a58044",
						"title": "计算机联锁图册",
						"children": [],
					},
					{
						"stationId": "2289103d4-0d1f-4c3e-93b5-e382b0a58044",
						"parentId": "289103d4-0d1f-4c3e-93b5-e382b0a58044",
						"title": "区间自动闭塞图册",
						"children": [],
					}
				],
				"disabled": false
			},
			{
				"stationId": "481b0a4e-7523-4023-9a8c-1af6a51c125e",
				"parentId": "5226d1f5-b85f-46c7-b05f-157815d590b8",
				"title": "车站3",
				"children": [{
						"stationId": "1481b0a4e-7523-4023-9a8c-1af6a51c125e",
						"parentId": "481b0a4e-7523-4023-9a8c-1af6a51c125e",
						"title": "计算机联锁图册",
						"children": [],
					},
					{
						"stationId": "2481b0a4e-7523-4023-9a8c-1af6a51c125e",
						"parentId": "481b0a4e-7523-4023-9a8c-1af6a51c125e",
						"title": "区间自动闭塞图册",
						"children": [],
					}
				],
				"disabled": false
			}
		],
		"disabled": false
	}
]);
    const selectedNode = ref(null);
    const deptTreeRef = ref(null);
    
	/** 通过条件过滤节点  */
    const filterNode = (value, data) => {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    };

    //选中事件
    function handleCheck(checkedNode) {
      //实现单选关键就是这一点：在选中某个项之后，将选中的节点数组只设置成当前选中的节点，保证只有一个选项
    //   deptTreeRef.value.setCheckedKeys([checkedNode.stationId]);
    }
</script>


<style scoped>
    ::v-deep .stafftree > .el-tree-node > .el-tree-node__content > .el-checkbox {
      display: none; /* 隐藏一级节点复选框 */
    }

    ::v-deep .stafftree > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content > .el-checkbox {
      display: none; /* 隐藏二级节点复选框 */
    }

    /* 隐藏三级节点复选框 */
    /*::v-deep .stafftree > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content > .el-checkbox {*/
    /*  display: none;*/
    /*}*/
</style>
