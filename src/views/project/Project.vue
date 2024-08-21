<script >
import {mapState} from "vuex";

export default {
  computed:{
    ...mapState(['pro'])
  },
  methods: {
    queryProjectInfo() {
      this.$api.queryPro().then(resp => {
        this.ProjectList = resp.data.data
      })
    }
  },
  created() {
  this.queryProjectInfo()
  }
}
</script>

<template>
  <h1>项目内容</h1>
</template>


<style scoped>

</style>