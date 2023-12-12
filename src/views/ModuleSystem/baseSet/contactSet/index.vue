<!-- /*
 * @Descripttion:支付配置
*/ -->
<template>
	<section class="formWarp">
		<el-card shadow="never">
			<el-form ref="form" :model="resData" label-width="132px" size="small" v-loading="isLoading">
				<el-form-item label="客服设置：">
					<el-switch v-model="resData.openFlag"></el-switch>
					<span class="ml-20 text-999">设置客服后用户可以在个人中心展示平台客服</span>
				</el-form-item>
				<template v-if="resData.openFlag">
					<el-form-item label="微信二维码：" prop="wvCode" :rules="[{ required: true, message: '请上传微信二维码图片', trigger: 'change' }]">
						<div class="flex-start" style="align-items: flex-start;">
							<imgCenter
								v-model="resData.wvCode"
								isPreview
								:uploadStyle="{ width: '120px', height: '120px', marginRight: '10px' }"
								@input="$refs.form?$refs.form.validate():''"
							></imgCenter>
						</div>
					</el-form-item>
					<el-form-item label="微信号：" prop="wxNumber" :rules="[{ required: true, message: '请输入微信号', trigger: 'blur' }]">
						<el-input v-model="resData.wxNumber" class="w-450p" maxlength="50" />
					</el-form-item>
					<el-form-item label="客服电话：" class="btn_lastItem">
						<el-input v-model="resData.contactPhone" class="w-450p" maxlength="15" />
					</el-form-item>
					<el-form-item class="btnArea">
						<el-button type="primary" size="small" @click="onSubmit" v-ls-loading>保存</el-button>
					</el-form-item>
				</template>
			</el-form>
		</el-card>
	</section>
</template>

<script>
import { basic } from '@/api/ModuleSystem';
export default {
	name: 'contactSet',
	components: {},
	data() {
		return {
			resData: {
				openFlag: false,
				wvCode: '',
				wxNumber: '',
				contactPhone: ''
			},
			isLoading: true
		};
	},
	mounted() {
		this.getData();
	},
	methods: {
		getData() {
			this.isLoading = true;
			basic
				.contactInformationGet()
				.then(res => {
					if (res.code && res.data) {
						this.resData = res.data;
					}
				})
				.finally(() => {
					this.isLoading = false;
				});
		},
		// 提交
		onSubmit() {
			this.$refs.form.validate(valid => {
				if (valid) {
					basic.contactInformationSave(this.resData).then(res => {
						if (res.code) {
							this.$message.success('编辑成功');
							this.getData();
						}
					});
				}
			});
		},
	}
};
</script>
