<template>
    <el-dialog title="编辑" custom-class="dialog-form-small" :visible.sync="isVisible" :before-close="handleClose" :close-on-click-modal="false">
        <el-form ref="ruleForm" :model="form" size="small" label-width="auto" label-position="top">
            <div v-for="(setItem, index) in form.setList" :key="index" :style="{ marginBottom: index !== form.setList.length - 1 ? '18px' : '0' }">
                <!-- // 单选类型 -->
                <el-form-item
                    v-if="setItem.dataType == 'Boolean'"
                    :label="setItem.des + '：'"
                    :prop="'setList.' + index + '.value'"
                    :rules="{ required: true, message: setItem.des + '不能为空', trigger: 'blur' }"
                    class="form-radio"
                >
                    <el-radio-group v-if="setItem.des == '启用'" v-model="setItem.value">
                        <el-radio label="true">启用</el-radio>
                        <el-radio label="false">禁用</el-radio>
                    </el-radio-group>
                    <el-radio-group v-else-if="setItem.des == '开关'" v-model="setItem.value">
                        <el-radio label="true">开</el-radio>
                        <el-radio label="false">关</el-radio>
                    </el-radio-group>
                    <el-radio-group v-else v-model="setItem.value">
                        <el-radio label="true">是</el-radio>
                        <el-radio label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- // 输入框类型 -->
                <el-form-item
                    v-else-if="setItem.dataType == 'String'"
                    :label="setItem.des + '：'"
                    :prop="'setList.' + index + '.value'"
                    :rules="{ required: true, message: setItem.des + '不能为空', trigger: 'blur' }"
                >
                    <el-input v-model="setItem.value" placeholder="请输入" />
                </el-form-item>
                <!-- // 文件类型 -->
                <el-form-item
                    v-else-if="setItem.dataType == 'int' || setItem.dataType == 'Integer' || setItem.dataType == 'BigDecimal'"
                    :label="setItem.des + '：'"
                    :prop="'setList.' + index + '.value'"
                    :rules="{ required: true, message: setItem.des + '不能为空', trigger: 'blur' }"
                >
                    <el-input
                        v-model="setItem.value"
                        type="number"
                        placeholder="请输入"
                        :oninput="setItem.dataType == 'BigDecimal' ? $inputMoney : $inputInteger"
                    />
                </el-form-item>

                <el-form-item
                    v-else-if="setItem.dataType == 'File'"
                    :label="setItem.des + '：'"
                    :prop="'setList.' + index + '.value'"
                    :rules="{ required: true, message: setItem.des + '不能为空', trigger: 'blur' }"
                >
                    <upload v-model="setItem.value" :is-private="isPrivate(setItem)" button is-hidden-img />
                    <span class="ml-10">{{ setItem.value ? '已选择文件' : '未选择任何文件' }}</span>
                </el-form-item>

                <el-form-item
                    v-else-if="setItem.dataType == 'CheckBox' && setItem.sysParamValueItemDTOS"
                    :label="setItem.des + '：'"
                    :prop="'setList.' + index + '.checkBoxIds'"
                    :rules="{ required: true, message: setItem.des + '不能为空', trigger: 'blur' }"
                >
                    <el-checkbox-group v-model="setItem.checkBoxIds">
                        <el-row type="flex" class="flex-wrap">
                            <el-checkbox v-for="(checkItem, i) in setItem.sysParamValueItemDTOS" :key="i" :label="checkItem.id">
                                {{ checkItem.value }}
                            </el-checkbox>
                        </el-row>
                    </el-checkbox-group>
                </el-form-item>
            </div>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="isVisible = false">取 消</el-button>
            <el-button type="primary" size="small" :loading="loading" @click="submitForm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { orderSet } from '@/api/ModuleSystem.js'
import Upload from '@/components/Upload'
export default {
    name: 'DialogAudit',
    components: {
        Upload
    },
    props: {
        type: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            loading: false, //
            set: '',
            isVisible: false,
            setType: '',
            form: {
                setList: []
            }
        }
    },
    watch: {},
    methods: {
        isPrivate(setItem) {
            if (setItem.des.indexOf('证书') != -1) {
                return true
            } else {
                return false
            }
        },
        // 展示弹窗
        showDialog(type) {
            this.setType = type
            this.isVisible = true
            this.getFormList()
        },

        // 获取表单数据
        getFormList() {
            orderSet
                .orderSetting({
                    sysParamName: this.setType
                })
                .then((res) => {
                    this.form.setList = res.data
                })
        },

        // 点击模板时初始化数据
        handleClose() {
            this.$refs.ruleForm.resetFields()
            this.isVisible = false
        },

        // 提交表单

        submitForm() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.loading = true
                    const checkBoxList = []
                    const paramList = this.form.setList.map((item) => {
                        if (item.dataType == 'CheckBox') {
                            item.sysParamValueItemDTOS.forEach((checkItem) => {
                                checkBoxList.push({
                                    id: checkItem.id,
                                    value: item.checkBoxIds.includes(checkItem.id)
                                })
                            })
                        }
                        return {
                            id: item.id,
                            value: item.value
                        }
                    })
                    orderSet
                        .orderSysEdit({
                            groupBy: this.type,
                            name: this.setType,
                            sysParamValueItemDTOS: [...paramList, ...checkBoxList]
                        })
                        .then((res) => {
                            if (res.code == 1) {
                                this.isVisible = false
                                this.$message.success('编辑成功')
                            }
                            this.loading = false
                        })
                        .catch((err) => {
                            this.loading = false
                        })
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
// 当input框启用show-word-limit时,防止.el-form-item__content元素的 line-height: 40px;对.el-input__count元素的line-height进行样式污染
::v-deep .el-textarea {
    .el-input__count {
        line-height: normal !important;
    }
}
::v-deep .form-radio {
    display: flex;
    align-items: center;
    .el-form-item__label {
        padding: 0 12px 0 0;
    }
}
</style>
