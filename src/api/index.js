import axios from "axios";

const http = axios.create({
    baseURL: "http://127.0.0.1:8083",
    // baseURL: "http://47.115.62.246:8899",
    headers: {
        "Content-Type": "application/json"
    }
})

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default {
    login(params) {
        return http.post("/user/login", params)
    },
    queryPro(params) {
        return http.get("/pro/projects", {params: {id: params}})
    },
    deletePro(params) {
        return http.delete("/pro/projects" + "?pro_id=" + params)
    },
    addPro(params) {
        return http.post("/pro/projects", params)
    },
    updatePro(params) {
        return http.put("/pro/projects", params)
    },
    queryEnvList(params) {
        return http.get("/pro/envs", {params: {projectid: params}})
    },
    addEnvList(params) {
        return http.post("/pro/envs", params)
    },
    delEnvList(parmas) {
        return http.delete("/pro/envs" + "?envid=" + parmas)
    },
    queryEnvInfo(params) {
        return http.get("/pro/env" + "?envid=" + params)
    },
    saveEnvInfo(params) {
        return http.post("/pro/env", params)
    },
    queryApiList(proid, apitype, interfeceID) {
        if (interfeceID) {
            return http.get("/pro/interfacelist" + "?project_id=" + proid + "&interface_type=" + apitype + "&interfacet_id=" + interfeceID)
        } else {
            return http.get("/pro/interfacelist" + "?project_id=" + proid + "&interface_type=" + apitype)
        }
    },
    addApiList(params) {
        return http.post("/pro/interfacelist", params)
    },
    delApiList(parmas) {
        return http.delete("/pro/interfacelist" + "?interface_id=" + parmas)
    },
    updateApiList(params) {
        return http.put("/pro/interfacelist", params)
    },
    debug(params){
        return http.post("/test/debug", params)
    },
    queryCaseInfo(params){
        return http.get("/test/case" + "?case_id=" + params)
    },
    addCase(params){
        return http.post("/test/case", params)
    },
    deleteCase(params){
        return http.delete("/test/case" + "?case_id=" + params)
    },
    updateCase(params){
        return http.put("/test/case", params)
    },
    caseRun(params){
        return http.post("/test/run", params)
    },
    saveScene(params){
        return http.post("/test/scene", params)
    } ,
    querySceneList(proid, sceneid ) {
        if (sceneid) {
            return http.get("/test/scene" + "?project_id=" + proid + "&scene_id=" + sceneid )
        } else {
            return http.get("/test/scene" + "?project_id=" + proid )
        }
    },
    delScene(params){
        return http.delete("/test/scene" + "?scene_id=" + params)
    },
    updateScene(params){
        return http.put("/test/scene", params)
    }

}