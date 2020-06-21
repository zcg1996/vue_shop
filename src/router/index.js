import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

Vue.use(VueRouter)

const routes = [
  	{path:'/', redirect:'/login'},
	{path:'/login', component: Login},
	{
		path:'/home', 
		component: Home, 
		redirect: '/welcome',
		children:[
			{path:'/welcome', component: Welcome},
			{path:'/users', component: Users},
			{path:'/rights', component: Rights},
			{path:'/roles', component: Roles}
		]
	}
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
//	to表示将要访问的路径,from表示从哪个路径来,next是个函数,表示放行
	if(to.path === '/login') return next();
	const tokenStr = window.sessionStorage.getItem('token');
	if(!tokenStr){
		return next('/login');
	}
	next();
})

const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}


export default router
