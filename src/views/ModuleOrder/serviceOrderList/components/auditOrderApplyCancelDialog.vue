<template>
	<el-dialog title="审核" custom-class="dialog-form-small" :visible.sync="isVisible" @close="handleClose">
		<el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="98px">
			<el-form-item label="审核结果：" prop="agree">
				<el-radio-group v-model="ruleForm.agree">
					<el-radio :label="true">通过</el-radio>
					<el-radio :label="false">拒绝</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item
				label="审核意见："
				prop="adminMessage"
				:rules="{
					required: !ruleForm.agree,
					message: '请填写审核意见',
					trigger: 'blur'
				}"
			>
				<el-input v-model="ruleForm.adminMessage" show-word-limit type="textarea" maxlength="50" :autosize="{ minRows: 3, maxRows: 4 }" />
			</el-form-item>
		</el-form>
		<span slot="footer" class="font-0">
			<el-button size="small" @click="isVisible = false">取 消</el-button>
			<el-button v-ls-loading type="primary" size="small" @click="submitForm">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { serviceOrderApi } from '@/api/ModuleOrder'
export default {
	name: 'auditOrderApplyCancelDialog',
	props: {
		orderItemList: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			isVisible: false,
			rules: {
				status: [
					{
						required: true,
						message: '请选择审核结果',
						trigger: 'change'
					}
				]
			},
			ruleForm: {
				agree: true,
				adminMessage: ''
			}
		}
	},
	methods: {
		showDialog() {
			this.isVisible = true
		},
		// 点击模板时初始化数据
		handleClose() {
			this.$refs.ruleForm.resetFields()
			this.isVisible = false
		},
		// 提交
		submitForm() {
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					const params = this.orderItemList.map((v) => {
						return { refundId: v.id, orderType: v.orderType, adminMessage: this.ruleForm.adminMessage }
					})
					serviceOrderApi
						.confirmRefundCancelList({
							...this.ruleForm,
							confirmRefundDTO: params
						})
						.then((res) => {
							if (res.code) {
								this.isVisible = false
								this.$emit('finish')
							}
						})
						.catch((err) => {
							this.$message.error(err.msg)
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
</style>
