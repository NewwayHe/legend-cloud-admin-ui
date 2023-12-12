<template>
	<section class="mb-50">
		<el-card>
			<div class="table">
				<el-row type="flex">
					<el-col>
						<el-radio-group v-model="switchType" size="medium" class="mb-20">
							<el-radio-button label="baseInfo">基础信息</el-radio-button>
							<el-radio-button label="paySet">系统配置</el-radio-button>
							<el-radio-button label="contactSet">客服设置</el-radio-button>
						</el-radio-group>
					</el-col>
				</el-row>
			</div>
			<keep-alive>
			    <component :is="switchType" />
			</keep-alive>
		</el-card>
	</section>
</template>
<script>
import baseInfo from './baseInfo'
import paySet from './paySet'
import contactSet from './contactSet'
import pushSet from './pushSet'
import sensitiveFont from './sensitiveFont'
import testSet from './testSet'
export default {
	name: 'baseSet',
	components: {baseInfo,paySet,contactSet,pushSet,sensitiveFont,testSet},
	data() {
		return {
			switchType: 'baseInfo',
		};
	},
	computed: {},
	watch: {},

	mounted() {},
	methods: {
		
	}
};
</script>
