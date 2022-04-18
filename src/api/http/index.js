import axios from 'axios'
import {
    ElLoading,
    ElMessage
} from 'element-plus';
import store from '@/store/index';
//创建axios的一个实例 

let loading;
//正在请求的数量
let requestCount = 0
//显示loading
const showLoading = () => {
    if (requestCount === 0 && !loading) {
        loading = ElLoading.service({
            text: "Loading  ",
            background: 'rgba(0, 0, 0, 0.7)',
            spinner: 'el-icon-loading',
        })
    }
    requestCount++;
}
//隐藏loading
const hideLoading = () => {
    requestCount--
    if (requestCount == 0) {
        loading.close()
    }
}
const clearToken = () => {
	store.commit('setBlock')
}
var instance = axios.create({
    // baseURL: 'http://8.134.216.239:18181/', //服务器接口
    baseURL: 'http://127.0.0.1:8000/',//本地接口
    timeout: 6000, //设置超时
    withCredentials: true, // 跨域
	headers: {
        "Content-Type": "application/json",
		'X-Requested-With': 'XMLHttpRequest',
	},
})
//请求拦截器 
instance.interceptors.request.use((config) => {
        // showLoading()
        // const token = window.localStorage.getItem('token');
        // token && (config.headers.Authorization = token)
        const token = localStorage.getItem('token')
        if(token && config.method == 'post'){
            config.headers['Authorization'] ='Bearer ' + token;
          }
        return config;
    }, (error) =>
    Promise.reject(error));

//响应拦截器
instance.interceptors.response.use((response) => {
    // hideLoading()
    return response.data;
}, (error) => {
    console.log(error)
    //响应错误
    if(error.response&&error.response.status){
	   const status = error.response.status
       let message = ''
	    switch (status) {
	        case 400:
	            message = '请求错误';
	            break;
	        case 401:
	            message = 'token过期';
				clearToken()
	            break;
	        case 404:
	            message = '请求地址出错';
	            break;
	        case 408:
	            message = '请求超时';
	            break;
	        case 500:
	            message = '服务器内部错误!';
	            break;
	        case 501:
	            message = '服务未实现!';
	            break;
	        case 502:
	            message = '网关错误!';
	            break;
	        case 503:
	            message = '服务不可用!';
	            break;
	        case 504:
	            message = '网关超时!';
	            break;
	        case 505:
	            message = 'HTTP版本不受支持';
	            break;
	        default:
	            message = '请求失败'
	    }
		    ElMessage.error(message);
		    return Promise.reject(error);
       }
    return Promise.reject(error);
});


export default instance;