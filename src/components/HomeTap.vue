<script>
import index, {mapState,mapMutations} from "vuex";
import {ElMessage} from "element-plus";

export default {
  computed: {
    ...mapState(['historyTags','pro']),
  },
  data() {
    return {
      username: window.sessionStorage.getItem('username'),
      // 环境下拉框数据
      options: [

      ],
      value: ''
    }
  },
  methods: {
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
    clickTag(tag) {
      console.log(tag)
      this.$router.push(tag.path)
    },
    closeTag(tag) {
      this.$store.commit('delHistoryTags', tag)
    },
    closeAllTag() {
      this.$store.commit('delAllHistoryTags', {})
    },
    queryEnvList() {

      //  获取环境列表
      this.$api.queryEnvList(this.pro.project_id).then(resp => {
        this.options = resp.data.data
      })
    },
    activationEnv(value){
      this.$store.commit("activationEnv", value)
    }
  },
  created() {
    this.queryEnvList()
  }

}

</script>

<template>
  <div class="box">
    <el-row :gutter="20" style="margin: 0">
      <!--  左侧标签区域    -->
      <el-col :span="13">
        <div class="tags">
          <el-tag
              v-for="tag in historyTags"
              :key="tag.path"
              closable
              type="success"
          @close="closeTag(tag)"
          @click="clickTag(tag)">
            {{ tag.title }}
          </el-tag>
        </div>
      </el-col>
      <!--  中间切换环境区域      -->
      <el-col :span="8">
        <el-row :gutter="20">
          <!--  关闭标签页        -->
          <el-col :span="7">
            <div class="close_label">
              <el-tooltip content="关闭所有标签页" placement="top">
                <el-button type="info" plain size="small" @click="closeAllTag">关闭标签页</el-button>
              </el-tooltip>

            </div>
          </el-col>
          <el-col :span="6">
            <span style="  line-height: 50px;">切换环境:</span>
          </el-col>
          <el-col :span="11">
            <div class="env_select">
              <el-select v-model="value"  @visible-change="this.queryEnvList()"  placeholder="选择执行环境" size="small" style="width: 180px">
                <el-option
                    v-for="item in options"
                    :key="item.envid"
                    :label="item.label"
                    :value="item.envname"
                    @click="activationEnv(item)"
                />
              </el-select>
            </div>
          </el-col>

        </el-row>
      </el-col>
      <!--   右侧用户下拉区域     -->
      <el-col :span="3">
        <el-dropdown class="user_dropdown">
				<span class="el-dropdown-link">
					<el-icon color="black">
						<User/>
					</el-icon>
					<span style="margin: 3px;color: black;"> {{ username }} </span>
					<el-icon color="black">
						<CaretBottom/>
					</el-icon>
				</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="this.$router.push('/projects')">选择项目</el-dropdown-item>
              <el-dropdown-item @click='logout'>注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.box {
  height: 50px; /* 这里设置父元素的高度为视口高度 */
  align-items: stretch; /* 确保子元素扩展到父元素的高度 */
  margin: 0;
}

.el-row {
  height: 50px; /* 确保行元素填满父元素的高度 */
}

/* 标签历史 */
.tags {
  height: 50px;
  border-right: 2px solid #30e3ca;
  line-height: 50px;
}
.tags .el-tag {
  margin-left: 10px;
}

/* 关闭标签按钮*/
.close_label {
  border-right: 2px solid #30e3ca;
  height: 50px;
  margin-right: -10px;
  line-height: 50px;
}

/*环境下拉框*/
.env_select {
  line-height: 50px;
  margin-left: -25px;
}

/*用户下拉菜单*/
.user_dropdown {
  line-height: 50px;
  border-left: 2px solid #30e3ca;
  padding-left: 10px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}


</style>