<template>
    <div style="width：50%">
        <el-card class="mb-15">
            <el-form ref="ruleForm" :model="form">
                <div class="mt-20">
                    <span style="font-size: 14px">协议名称：</span>
                    <span style="font-size: 14px">{{ form.name }}</span>
                </div>
                <el-form-item>
                    <div class="mt-10 d-flex">
                        <div>协议来源：</div>
                        <el-radio-group v-model="form.orderType">
                            <div class="d-flex" style="margin-top: 14px">
                                <el-radio label="外部协议链接"></el-radio>
                            </div>
                            <div class="mt-20">
                                <el-radio label="富文本编辑"></el-radio>
                            </div>
                        </el-radio-group>
                    </div>
                </el-form-item>
                <div v-if="form.orderType == '外部协议链接'" class="mt-20 w-450p">
                    <el-form-item>
                        <el-input v-model="form.url" placeholder="请输入"></el-input>
                    </el-form-item>
                </div>

                <div v-else class="mt-20">
                    <el-form-item>
                        <TinyMce v-model="form.text" />
                    </el-form-item>
                </div>
                <div class="w-100 flex-center mt-30">
                    <el-form-item style="margin-bottom: 0;">
                        <el-button @click="onCancel" size="small">返回</el-button>
                        <el-button type="primary" @click="onSave" size="small">保存</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import TinyMce from '@/components/TinyMceNew'
import { protocolApi } from '@/api/ModuleSystem'
export default {
    name: 'AgreementEdit',
    components: {
        TinyMce
    },
    data() {
        return {
            orderType: '123',
            form: {
                orderType: '外部协议链接',
                url: '',
                text: '',
                id: ''
            }
        }
    },
    created() {
        this.form.id = this.$route.query.id
        this.getInfo()
    },
    methods: {
        onSave() {
            if (this.form.orderType == '外部协议链接') {
                this.form.text = ''
                this.form.type = 0
            } else {
                this.form.url = ''
                this.form.type = 1
            }
            protocolApi
                .updateUrl(this.form)
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.success('保存成功')
                        this.$router.push({
                            name: 'protocolManagement'
                        })
                    }
                })
                .catch((e) => {
                    // code=0,成功返回；反之，失败提示
                    if (e.code && e.code !== 0) {
                        this.$message.error(e.message)
                    }
                })
        },
        onCancel() {
            this.$router.go(-1)
        },
        getInfo() {
            protocolApi.queryById({ id: this.form.id }).then((res) => {
                this.form.url = res.data.url
                this.form.text = res.data.text
                this.form.name = res.data.name
                this.form.orderType = res.data.type == 0 ? '外部协议链接' : '富文本编辑'
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>
