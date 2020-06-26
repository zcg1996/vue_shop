<template>
	<div>
		<!--面包屑导航区-->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/params' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>参数列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片视图-->
		<el-card>
			<!--头部警告区域-->
			<el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
			<!--选择商品分类区域-->
			<el-row class="cat_opt">
				<el-col>
					<span>选择商品分类：</span>
					<!--选择商品分类的级联选择器-->
					<el-cascader v-model="selectedCateKeys" :options="catelist" :props="cateProps" @change="handleChange"></el-cascader>
				</el-col>
			</el-row>
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
			    <el-tab-pane label="动态参数" name="many">
			    	<el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
			    	<!--动态参数表格-->
			    	<el-table :data="manyTableData" border stripe>
			    		<el-table-column type="expand">
			    			<template slot-scope="scope">
			    				<el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
			    				<!--输入的文本框-->
			    				<el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
								</el-input>
								<!--添加按钮-->
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
			    			</template>
			    		</el-table-column>
			    		<!--索引列-->
			    		<el-table-column type="index"></el-table-column>
			    		<el-table-column label="参数名称" prop="attr_name"></el-table-column>
			    		<el-table-column label="操作">
			    			<template slot-scope="scope">
			    				<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
			    				<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
			    			</template>
			    		</el-table-column>
			    	</el-table>
			    </el-tab-pane>
			    <el-tab-pane label="静态属性" name="only">
			    	<el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
			    	<!--静态属性表格-->
			    	<el-table :data="onlyTableData" border stripe>
			    		<el-table-column type="expand">
			    			<template slot-scope="scope">
			    				<el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
			    				<!--输入的文本框-->
			    				<el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
								</el-input>
								<!--添加按钮-->
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
			    			</template>
			    		</el-table-column>
			    		<!--索引列-->
			    		<el-table-column type="index"></el-table-column>
			    		<el-table-column label="属性名称" prop="attr_name"></el-table-column>
			    		<el-table-column label="操作">
			    			<template slot-scope="scope">
			    				<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
			    				<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
			    			</template>
			    		</el-table-column>
			    	</el-table>
			    </el-tab-pane>
  			</el-tabs>
		</el-card>
		<!--添加参数对话框-->
		<el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			<el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="100px">
			  	<el-form-item :label="titleText" prop="attr_name">
			    	<el-input v-model="addForm.attr_name"></el-input>
			  	</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="addDialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="addParams">确 定</el-button>
			</span>
		</el-dialog>
		<!--修改参数对话框-->
		<el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
			<el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="100px">
			  	<el-form-item :label="titleText" prop="attr_name">
			    	<el-input v-model="editForm.attr_name"></el-input>
			  	</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="editDialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="editParams">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data(){
		return {
			catelist: [],
			cateProps: {
				expandTrigger: 'hover',
				value: 'cat_id',
				label: 'cat_name',
				children: 'children'
			},
			selectedCateKeys: [],
//			被激活的页签的名称
			activeName: 'many',
			manyTableData: [],
			onlyTableData: [],
			addDialogVisible: false,
			addForm: {
				attr_name: ''
			},
			addFormRules: {
				attr_name: [{required: true, message: '请输入参数名称', trigger: 'blur'}]
			},
			editDialogVisible: false,
			editForm: {},
			editFormRules: {
				attr_name: [{required: true, message: '请输入参数名称', trigger: 'blur'}]
			},
			inputVisible: false,
			inputValue: ''
		}
	},
	created() {
//		获取所有的商品列表分类
		this.getCateList();
	},
	methods: {
		async getCateList(){
			const { data:res } = await this.$http.get('categories');
			if(res.meta.status !== 200){
				return this.$message.error('获取商品分类失败');
			}
			this.catelist = res.data;
		},
		handleChange(){
			this.getParamsData();
		},
		handleTabClick(){
			this.getParamsData();
		},
//		获取参数列表的数据
		async getParamsData(){
			if(this.selectedCateKeys.length !== 3){
				this.selectedCateKeys = [];
				this.manyTableData = [];
				this.onlyTableData = [];
				return
			}
			const { data:res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel:this.activeName } } );
			if(res.meta.status !== 200){
				return this.$message.error('获取参数列表失败');
			}
			res.data.forEach(item => {
				item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
				item.inputVisible = false;
				item.inputValue = '';
			})
			console.log(res.data);
			if(this.activeName == 'many'){
				this.manyTableData = res.data;
			}else{
				this.onlyTableData = res.data;
			}
		},
		addDialogClosed() {
			this.$refs.addFormRef.resetFields();
		},
		addParams(){
			this.$refs.addFormRef.validate(async valid => {
				if(!valid) return
				const { data:res } = await this.$http.post(`categories/${this.cateId}/attributes`, 
															{ attr_name: this.addForm.attr_name, attr_sel: this.activeName });
				if(res.meta.status !== 201){
					return this.$message.error('添加参数失败');
				}
				this.$message.success('添加参数成功');
				this.addDialogVisible = false;
				this.getParamsData();
			})
		},
		async showEditDialog(attr_id){
			const { data:res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}` , { params: {attr_sel: this.activeName}});
			if(res.meta.status !== 200){
				return this.$message.error('获取参数信息失败');
			}
			this.editForm = res.data;
			this.editDialogVisible = true;
		},
		editDialogClosed(){
			this.$refs.editFormRef.resetFields();
		},
//		点击按钮修改参数信息
		editParams() {
			this.$refs.editFormRef.validate(async valid => {
				if(!valid) return
				const { data:res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, 
															{ attr_name: this.editForm.attr_name, attr_sel: this.activeName });
				if(res.meta.status !== 200){
					return this.$message.error('修改参数信息失败');
				}
				this.$message.success('修改参数成功');
				this.editDialogVisible = false;
				this.getParamsData();
			})
		},
//		根据ID删除对应的参数
		async removeParamsById(attr_id){
			const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
		        confirmButtonText: '确定',
		        cancelButtonText: '取消',
		        type: 'warning'
		    }).catch(err => err)
			if(confirmResult !== 'confirm'){
				return this.$message.info('已经取消删除');
			}
			const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);
			if(res.meta.status !== 200){
				console.log(res);
				return this.$message.error('删除参数失败');
			}
			this.$message.success('删除参数成功');
			this.getParamsData();
		},
		handleInputConfirm(row){
			if(row.inputValue.trim().length === 0) {
				row.inputValue = '';
				row.inputVisible = false;
				return 
			}
//			如果没有return着证明输入了内容,需要做后续处理
			row.attr_vals.push(row.inputValue.trim());
			row.inputValue = '';
			row.inputVisible = false;
			this.saveAttrVals(row);
		},
		showInput(row){
			row.inputVisible = true;
//			$nextTick方法的额作用.就是当页面上元素被重新渲染之后,才会执行回调函数中的代码
			this.$nextTick(_ => {
	        	this.$refs.saveTagInput.$refs.input.focus();
	        });
		},
//		将对attr_vals的操作保存到数据库
		async saveAttrVals(row){
			const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ')});
			if(res.meta.status !== 200){
				return this.$message.error('修改参数失败');
			}
			this.$message.success('修改参数成功');
		},
		handleClose(i, row){
			row.attr_vals.splice(i , 1);
			this.saveAttrVals(row);
		}
	},
	computed: {
		isBtnDisabled() {
			if(this.selectedCateKeys.length !== 3){
				return true;
			}
			return false;
		},
//		当前选中的三级分类的ID
		cateId(){
			if(this.selectedCateKeys.length === 3){
				return this.selectedCateKeys[2];
			}
			return null;
		},
		titleText(){
			return this.activeName === 'many' ? '动态参数' : '静态属性';
		}
	}
}
</script>

<style lang="less" scoped>
.cat_opt {
	margin: 25px 0;
}
.el-tag {
	margin: 5px;
}
.input-new-tag {
	width: 120px;
}
</style>