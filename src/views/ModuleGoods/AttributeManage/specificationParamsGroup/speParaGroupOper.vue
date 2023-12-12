<template>
    <!-- mb-50 是因为底部有返回按钮 -->
    <section class="mb-50">
        <el-card>
            <div class="formWarp">
                <el-form ref="form" :model="form" :rules="formRules" label-width="150px" size="small">
                    <el-form-item label="规格参数分组标题：" prop="name">
                        <el-input v-model="form.name" class="w-450p" maxlength="20" show-word-limit placeholder="请输入"/>
                        <span class="font text-999 ml-15">规格参数分组标题，不会显示在用户端</span>
                    </el-form-item>
                    <el-form-item label="关联商品类目：">
                        <el-button type="primary" size="small" @click="openTree">选择商品类目</el-button>
                        <span class="font text-999 ml-15">
                            规格参数分组和商品类目关联后，使用该类目的商品可使用规格参数分组关联的规格、参数、品牌等信息
                        </span>
                        <div v-show="form.categoryList.length !== 0" class="mt-5 font-0">
                            <span>关联类目：</span>
                            <el-tag
                                v-for="(item, index) in form.categoryList"
                                :key="item.id"
                                class="mr-10 mb-10"
                                closable
                                size="small"
                                type="primary"
                                @close="delRelated(item, index)"
                            >
                                {{ item.name }}
                            </el-tag>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table px-20">
                <el-row type="flex" class="mb-20">
                    <el-col>
                        <el-radio-group v-model="status" size="large">
                            <el-radio-button label="1">关联规格</el-radio-button>
                            <el-radio-button label="2">关联参数</el-radio-button>
                            <el-radio-button label="3">关联参数组</el-radio-button>
                            <el-radio-button label="4">关联品牌</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 四个表格 -->
                    <speTable 
                        v-if="status == '1'" 
                        ref="speTable" 
                        :table-list.sync="speTableList" 
                        :is-edit="isEdit" 
                        @disassociate="delItem" 
                    />
                    <paramTable
                        v-if="status == '2'"
                        ref="paramTable"
                        :table-list.sync="paramTableList"
                        :is-edit="isEdit"
                        @disassociate="delItem"
                    />
                    <paramGroupTable
                        v-if="status == '3'"
                        ref="paramGroupTable"
                        :table-list.sync="paramGroupTableList"
                        :is-edit="isEdit"
                        @disassociate="delItem"
                    />
                    <brandTable
                        v-if="status == '4'"
                        ref="brandTable"
                        :table-list.sync="brandTableList"
                        :is-edit="isEdit"
                        @disassociate="delItem"
                    />
                </el-row>
            </div>
        </el-card>

        <!-- 类目Dialog -->
        <el-dialog title="关联商品类目" :visible.sync="visible" width="445px" custom-class="dialog-form">
            <div>
                <div class="overflow-y-scroll h-400p">
                    <el-form :inline="true" size="small">
                        <el-form-item>
                            <el-tree
                                ref="treeForm"
                                :data="treeData"
                                :props="defaultProps"
                                :default-expanded-keys="selectedNodeList"
                                :default-checked-keys="selectedNodeList"
                                node-key="id"
                                show-checkbox
                                accordion
                            />
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span slot="footer">
                <el-button size="small" @click="visible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="selectNode">确定</el-button>
            </span>
        </el-dialog>
        <Sticky>
            <el-button size="small" @click="goBack">返回</el-button>
            <ls-button type="primary" size="small" :asyncFunction="dbnSubmit">{{ isEdit ? '保存' : '新增' }}</ls-button>
        </Sticky>
    </section>
</template>

<script>
import { specificationParamsGroup } from '@/api/ModuleGoods'
import { request } from '@/utils/request'
import speTable from './components/speTable'
import paramTable from './components/paramTable'
import paramGroupTable from './components/paramGroupTable'
import brandTable from './components/brandTable'
import { debounce } from '@/utils/utils'
export default {
    components: {
        speTable,
        paramTable,
        paramGroupTable,
        brandTable,
    },
    data() {
        return {
            form: {
                id: '',
                name: '',
                categoryList: []
            },
            formRules: {
                name: [
                    {
                        required: true,
                        message: '标题不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            status: '1',
            speTableList: [],
            paramTableList: [],
            paramGroupTableList: [],
            brandTableList: [],
            visible: false,
            treeData: [], // 类目树
            defaultProps: {
                // 类目树的配置项
                children: 'children',
                label: 'name',
                disabled: 'optional'
            },
            num: 0, // 限制只能选择一个节点
            selectedNode: {}, // 选中的类目(废弃)
            selectedNodeList: [], // 选中的类目id数组
            isEdit: false // 编辑
        }
    },
    beforeRouteEnter(to,from,next) {
        if(to.query.type == 'edit') {
            to.meta.title = '编辑规格参数分组'     //更改tab页同步标题
        }else {
            to.meta.title = '新增规格参数分组'     //更改tab页同步标题
        }
        next()
    },
    mounted() {
        if (this.$route.query.type === 'edit') {
            this.form.id = this.$route.query.id
            this.isEdit = true
            this.getAggDetail()
        } else {
            this.isEdit = false
        }
        this.getRelatedTree(this.$route.query.id)
    },
    methods: {
        // 获取规格分组信息(编辑时调用)
        getAggDetail() {
            specificationParamsGroup
                .productDetailPropertyAgg(this.form.id)
                .then((res) => {
                    // TODO => 修改了可以关联多个类目，所以这里回去数据需要更改
                    this.form = Object.assign({}, this.form, res.data)
                    this.selectedNodeList = res.data.categoryList.map((item) => item.id)
                    this.speTableList = res.data.specificationList
                    this.paramTableList = res.data.paramList
                    this.paramGroupTableList = res.data.paramGroupList
                    this.brandTableList = res.data.brandList
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 提交
        async dbnSubmit() {
			await this.$refs.form.validate().then(async (res)=>{
					if (this.isEdit) {
						console.log('22222222222')
						await this.edit()
						console.log('33333333333')
					} else {
						await this.add()
					}
			}).catch(err=>{
				
			})
        },

        // 新增
        add() {
            return new Promise((resolve)=>{
                specificationParamsGroup
                .add({
                    name: this.form.name,
                    categoryList: this.processData(this.form.categoryList, 'categoryId'),
                    specificationList: this.processData(this.speTableList, 'propId'),
                    paramList: this.processData(this.paramTableList, 'propId'),
                    paramGroupList: this.processData(this.paramGroupTableList, 'groupId'),
                    brandIdList: this.processData(this.brandTableList, 'brandId')
                })
                .then((res) => {
                    this.$message({
                        message: '新增成功',
                        type: 'success',
                    })
                    this.$router.push({
                        name: 'specificationParamsGroup'
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(()=>{
                    resolve()
                })
            })
            
        },

        // 编辑
        edit() {
            return new Promise((resolve)=>{
            specificationParamsGroup
                .edit({
                    id: this.form.id,
                    name: this.form.name,
                    categoryList: this.processData(this.form.categoryList, 'categoryId'),
                    specificationList: this.processData(this.speTableList, 'propId'),
                    paramList: this.processData(this.paramTableList, 'propId'),
                    paramGroupList: this.processData(this.paramGroupTableList, 'groupId'),
                    brandIdList: this.processData(this.brandTableList, 'brandId')
                })
                .then((res) => {
                    this.$message({
                        message: '编辑成功',
                        type: 'success',
                    })
                    this.$router.push({
                        name: 'specificationParamsGroup'
                    })
                })
                .catch((err) => {
                    console.log(err)
                }).finally(()=>{
                    resolve()
                })
            })
        },

        // 处理数据
        processData(list, name) {
            return list.reduce((arr, item, index) => {
                item[name] = item.id
                item.seq = index + 1
                arr.push(item)
                return arr
            }, [])
        },

        // 打开类目树
        openTree() {
            this.visible = true
        },

        // 类目树
        getRelatedTree(id) {
            console.log(id, 'id')
            specificationParamsGroup
                .getTree({ productPropertyAggId: id })
                .then((res) => {
                    this.treeData = res.data
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 获取选择的类目
        selectNode() {
            console.log(this.$refs.treeForm.getCheckedNodes())
            if (this.$refs.treeForm.getCheckedNodes().length === 0) {
                this.$message.info('请选择关联类目')
                return
            }
            this.selectedNodeList = this.$refs.treeForm.getCheckedNodes().reduce((arr, item) => {
                arr.push(item.id)
                return arr
            }, [])
            this.form.categoryList = this.$refs.treeForm.getCheckedNodes()
            this.visible = false
        },

        // 获取节点id
        getNodeId(arr) {
            return arr.reduce((arr, item) => {
                arr.push(item.id)
                return arr
            }, [])
        },

        // 删除当前已关联的类目
        delRelated(item, index) {
            this.form.categoryList.splice(index, 1)
            this.selectedNodeList.splice(index, 1)
        },

        // 限制只能选择单个节点
        treeSelect(data, checked, node) {
            this.num++
            if (this.num % 2 === 0) {
                if (checked) {
                    this.$refs.treeForm.setCheckedNodes([])
                    this.$refs.treeForm.setCheckedNodes([data])
                    // 交叉点击节点
                } else {
                    this.$refs.treeForm.setCheckedNodes([])
                    // 点击已经选中的节点，置空
                }
            }
        },

        // 取消关联
        delItem(scope, keyName, url) {
            console.log(scope, 'scope')
            this.$confirm('确定取消关联吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    request
                        .delete(url + scope.row[keyName])
                        .then((res) => {
                            this.getAggDetail()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch(() => {
                    this.$message.info('取消操作')
                })
        },

        // 返回列表页
        goBack() {
            this.$router.push({
                name: 'specificationParamsGroup'
            })
        }
    }
}
</script>