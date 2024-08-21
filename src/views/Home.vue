<template>

  <!-- 项目首页的盒子 -->
  <div class="project">
    <!-- 左侧菜单的盒子 -->
    <div class="left_box">
      <HomeMeun></HomeMeun>
    </div>
    <!-- 右侧的盒子 -->
    <div class="right_box">
      <!-- 顶部标签栏 -->
      <div class="top_box">
        <HomeTap></HomeTap>
      </div>
      <!-- 主体页面内容展示区域 -->
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>

</template>

<script>
import HomeMeun from "@/components/HomeMeun.vue";
import HomeTap from "@/components/HomeTap.vue";

export default {
  props: [],
  components: {
    HomeMeun,
    HomeTap
  },
  data() {
    return {
      // 在此自动生成

    };
  },
  watch: {},
  computed: {},
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
  },
  mounted() {
  },
  beforeUpdate() {
  },
  updated() {
  },
  destoried() {
  },
  methods: {
    // 在此自动生成
    request() {
      // 网络请求，可选
    },

  },
  fillter: {},
};
</script>

<style scoped>
.project {
  height: 100vh;
  background:#30e3ca;
  display: flex;
}

/* 左侧盒子 */
.left_box {
  //width: 200px;
  height: 100vh;
  margin-top: 7px;
  //border-right: solid 1px #11999e;
}


/* 右侧盒子 */
.right_box {
  flex: 1;
}

/* 顶部标签栏盒子 */
.top_box {
  height: 50px;
  background: #fff;
  margin-top: 2px;
}

/* 页面内容展示区域的样式 */
.main {
  background: #fff;
  margin-top: 3px;
  height: calc(100vh - 68px);
  //border-radius: 3px;
}

</style>