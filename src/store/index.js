import {createStore} from 'vuex'

export default createStore({
    // 定义state值
    state: {
        // 保存进入项目信息
         pro: localStorage.getItem('pro') ? JSON.parse(localStorage.getItem('pro')) : { /* 初始状态值 */ },
        //   保存标签历史
        historyTags: [],
        //   保存激活的环境信息
        activationEnvInfo: localStorage.getItem('envInfo') ? JSON.parse(localStorage.getItem('envInfo')) : { /* 初始状态值 */ },
    },
    // 定义计算属性，由state内的值计算得到
    getters: {},
    // 定义函数，可以修改state的值，只能通过mutations来修改值
    mutations: {
        updateProInfo(state, pro) {
            state.pro = pro
            localStorage.setItem('pro', JSON.stringify(pro));
        },
        addHistoryTags(state, tag) {
            console.log("tag:", tag)
            //   判断列表中是否存在标签
            const res = state.historyTags.find(item => item.path === tag.path)
            if (!res) {
                state.historyTags.push({
                    path: tag.path,
                    title: tag.meta.title,
                })
            }
        },
        delHistoryTags(state, tag) {
            state.historyTags = state.historyTags.filter(item => item.path !== tag.path)

        },
        delAllHistoryTags(state) {
            state.historyTags = []
        },
        activationEnv(state, envInfo){
            state.activationEnvInfo = envInfo
            localStorage.setItem('envInfo', JSON.stringify(envInfo));
        },

    },
    // 异步请求
    actions: {},
    // 按模块定义state
    modules: {}
})
