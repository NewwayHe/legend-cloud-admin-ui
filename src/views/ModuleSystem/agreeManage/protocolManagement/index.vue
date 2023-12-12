<!--
    * Desc    : 协议管理
-->
<template>
    <section class="">
        <div class="table">
            <el-card class="mb-15">
                <el-alert type="info" class="theme mb-20" :closable="false" show-icon>
                    <p>每个协议都可配置一个链接，用户可查看配置的链接内容</p>
                </el-alert>
                <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" class="w-100" header-row-class-name="headerRow">
                    <el-table-column label="序号" type="index" width="48"/>
                    <el-table-column prop="name" label="协议" align="center" />
                    <el-table-column label="连接" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.code == 'USER_REGISTER' || scope.row.code=='PRIVACY_POLICY'">
                                {{ $config.shareUrl }}/ModulesUser/register/agreement?code={{ scope.row.code }}
                            </span>
                            <span v-else>{{ $config.shareUrl }}/agreeMent?code={{ scope.row.code }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
                        <template slot-scope="scope">
                            <span class="edit">
                                <el-link type="primary" @click="edit(scope.row)">编辑</el-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
        <el-dialog title="配置协议连接" custom-class="dialog-form" width="420px" :visible.sync="dialogForm.isVisible">
            <div style="padding: 10px 5px 20px 5px">
                <p>{{ dialogForm.formData.name }}</p>
            </div>
            <el-form ref="myForm" :model="dialogForm.formData" :rules="dialogForm.formRule" label-width="95px" size="small" label-position="right">
                <el-form-item label="链接：" prop="url">
                    <el-input v-model="dialogForm.formData.url" placeholder="输入框" style="width: 200px" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="dialogForm.isVisible = false">取 消</el-button>
                <el-button v-ls-loading type="primary" size="small" @click.stop="updateUrl('myForm')">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import common from '@/mixins/pages/commom'
import cud from '@/mixins/pages/cud'
import { protocolApi } from '@/api/ModuleSystem'

export default {
    name: 'ProtocolManagement',
    components: {},
    mixins: [common, cud],
    data() {
        return {
            url: {
                getData: '/basic/admin/protocol/query',
                update: '/basic/admin/protocol/update/url',
            },
            dialogForm: {
                formRule: {
                    url: [
                        {
                            required: true,
                            message: '请输入 url',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 150,
                            message: '长度在 0 到 150 个字符',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        }
    },
    computed: {},
    watch: {},
    created() {},
    destroyed() {},
    mounted() { },
    methods: {
        edit(data) {
            console.log(data)
            this.$router.push({
                name: 'agreementEdit',
                query: {
                    id: data.id || ''
                }
            })
        },
        updateUrl(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    protocolApi
                        .updateUrl(this.dialogForm.formData)
                        .then((res) => {
                            if (res.code == 1) {
                                console.log('======', res)
                                this.getData()
                                this.dialogForm.isVisible = false
                                this.$message.success('更新成功')
                            }
                        })
                        .catch((e) => {
                            // code=0,成功返回；反之，失败提示
                            if (e.code && e.code !== 0) {
                                this.$message.error(e.message)
                            }
                        })
                } else {
                    console.error('Error submit ----- Form invalid !')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>
