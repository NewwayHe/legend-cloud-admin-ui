<!--
    个人分销中心装修
-->
<template>
  <el-card>
    <el-row type="flex" justify="space-around">
        <el-col  class="flex-center" style="max-width: 429px;">
            <iphonePreview :scale="0.7">
                <slot slot="screen">
                    <!-- 备注：如果用height="100%"的话，会出现一个小小的滚动条，如果用pointer-events: none;则滚动不了 -->
                    <!-- <iframe id="iframeId" :src="iframeUrl" height="100%" width="100%" frameborder="0"></iframe> -->
                    <el-image :src="require('@/assets/images/mobile_index.png')" fit="contain"></el-image>
                    <!-- 遮罩层 (防止点击iframe里面的元素)-->
                    <div
                        class="w-100 position-absolute top-0 left-0"
                        style="background-color: rgba(0,0,0,.5);height: 100%;"
                        v-show="true"
                        @mousedown.prevent="()=>{}"
                        @mousewheel.prevent="()=>{}"
                    ></div>
                    <div v-if="form.photos" class="w-100 px-10 center-xy flex-col-center" style="max-height:80%;">
                        <el-image v-if="!isEdit" :src="$photoServer + form.photos" fit="contain"></el-image>
                        <div class="text-center"><i class="font-32 text-fff iconfont icon-close"></i></div>
                    </div>
                </slot>
            </iphonePreview>
        </el-col>
        <el-col class="flex-1 font-14 position-relative">
            <div class="formWarp mb-50">
                <el-form ref="form" :model="form" :rules="rules" label-width="132px" size="small">
                    <div class="form-title">基本信息</div>
                    <el-form-item label="广告弹窗标题：" prop="title">
                        <el-input v-model="form.title" :disabled="!isEdit" :maxlength="25" style="width: 450px" show-word-limit placeholder="请输入"/>
                    </el-form-item>
                    <el-form-item label="广告弹窗有效期：" prop="dateTime">
                        <el-date-picker
                            v-model="form.dateTime"
                            :disabled="!isEdit"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00','23:59:59']"
                            range-separator="至"
                            start-placeholder="使用开始时间"
                            end-placeholder="使用结束时间"
                            @change="changeDate"
                        />
                    </el-form-item>
                    <el-form-item label="权重：" prop="seq">
                        <el-input v-model.number="form.seq" :disabled="!isEdit" :oninput="$inputInteger" style="width: 450px" placeholder="大于0的正整数" :maxlength="4"/>
                        <span class="text-666 font-12">权重越低越靠前显示</span>
                    </el-form-item>

                    <el-divider class="my-30"/>
                    <div class="form-title">投放设置</div>
                    <el-form-item label="投放用户:" prop="advertiseUesrType">
                        全部用户
                        <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content" class="line-h-md" style="max-width: 310px">
                                投放用户，用于控制可查看广告弹窗的用户；<br/>
                                同一个用户在不同的手机设备中重新登录，会重新按照规则显示弹窗；<br/>
                                小程序删除后重新进入小程序，会重新按照规则显示弹窗；<br/>
                            </div>
                            <i class="el-icon-question font-16 text-blue v-text-bottom" ></i>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="投放页面:" prop="advertisePage">
                        首页
                    </el-form-item>
                    <el-form-item label="投放渠道(多选):" prop="sourceList">
                        <el-select v-model="form.sourceList" :disabled="!isEdit" multiple :collapse-tags="false" placeholder="请选择" style="width: 450px">
                            <el-option
                            label="用户PC端"
                            value="PC">
                            </el-option>
                            <el-option
                            label="用户移动端"
                            value="APP">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="投放频率(单选):" prop="advertiseFrequency">
                        <el-radio-group v-model="form.advertiseFrequency" :disabled="!isEdit" @change="advertiseFrequencyChange">
                            <div class="flex-start" style="margin-bottom: 18px">
                                <el-radio label="有效期内显示" class="mr-10">
                                    有效期内显示
                                </el-radio>
                                <el-form-item label-width="0px" style="margin:0;" prop="count2" :rules="[form.advertiseFrequency=='有效期内显示'?{required:true,message:'请填写投放次数',trigger:'blur'}:'']">
                                    <el-input class="mr-10" style="width: 121px" v-model="form.count2" :disabled="!isEdit" :maxlength="3"><template slot="append">次</template></el-input>
                                    <el-tooltip class="item" effect="dark" placement="top">
                                        <div slot="content" class="line-h-md" style="max-width: 310px">
                                            投放频率，用于控制广告弹窗显示的频率和次数；<br/>

                                            包括：有效期内显示X次、每天显示X次、每次打开页面都显示；<br/>

                                            有效期内显示X次，用于控制广告弹窗在弹窗设置的有效期内总共显示的次数；<br/>

                                            每天显示X次，用于控制广告弹窗在弹窗设置的有效期内每天打开首页总共显示的次数；<br/>

                                            每次打开页面都显示，用于控制广告弹窗在弹窗设置的有效期内每次返回首页都显示弹窗；<br/>
                                        </div>
                                        <i class="el-icon-question font-16 text-blue v-text-bottom" ></i>
                                    </el-tooltip>
                                </el-form-item>
                            </div>
                            <div class="flex-start" style="margin-bottom: 18px">
                                <el-radio label="每天显示" class="mr-10">每天显示</el-radio>
                                <el-form-item label-width="0px" style="margin:0;" prop="count1" :rules="[form.advertiseFrequency=='每天显示'?{required:true,message:'请填写投放次数',trigger:'blur'}:'']">
                                    <el-input class="mr-10" style="width: 121px" v-model="form.count1" :disabled="!isEdit" :maxlength="3"><template slot="append">次</template></el-input>
                                </el-form-item>
                            </div>
                            <div class="flex-start" style="margin-bottom: 18px">
                                <el-radio label="每次打开页面都显示弹窗" class="mr-10">每次打开页面都显示弹窗</el-radio>
                            </div>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="点击限制(单选):" prop="clickLimit">
                        <el-radio-group v-model="form.clickLimit" :disabled="!isEdit">
                            <div>
                                <el-radio :label="1" class="mr-10" style="line-height:32px;">
                                    用户点击弹窗后，弹窗不显示（只可限制已登录用户）
                                    <el-tooltip class="item" effect="dark" placement="top">
                                        <div slot="content" class="line-h-md" style="max-width: 310px">
                                            点击限制，用于控制广告弹窗的显示限制；
                                            <br />
                                            包括点击后不再显示广告弹窗、点击后仍会显示广告弹窗；
                                            <br />
                                            点击限制优先级高于投放频率；
                                        </div>
                                        <i class="el-icon-question font-16 text-blue v-text-bottom" ></i>
                                    </el-tooltip>
                                </el-radio>
                            </div>
                            <div >
                                <el-radio :label="2" class="mr-10" style="line-height:32px;">用户点击弹窗后，弹窗仍会显示</el-radio>
                            </div>
                        </el-radio-group>
                    </el-form-item>
                    <el-divider class="my-30"/>
                    <div class="form-title">样式设置</div>
                    <el-form-item label="上传图片：" prop="photos">
                        <template v-if="!isEdit">
                            <el-image v-if="form.photos" :src="$photoServer + form.photos" style="width:100px;height:100px;"></el-image>
                            <span v-else>-</span>
                        </template>
                        <template v-else>
                            <imgCenter v-model="form.photos" @input="$refs.form.validateField('brandPic')" :key="form.photos"></imgCenter>
                            <span class="font-12 ml-15 v-top" style="color:#afafaf;">建议尺寸：500*600px，小于5M，最多上传一张图片</span>
                        </template>
                    </el-form-item>
                    <el-form-item label="跳转链接：" prop="brandPic">
                        <dialogUrl ref="dialogUrl" v-model="form" field="url"></dialogUrl>
                    </el-form-item>
                </el-form>
            </div>
        </el-col>
    </el-row>
    <Sticky>
        <el-button :disabled="!canEdit" v-show="!isEdit" @click="()=>{$router.go(-1)}" size="medium">返回</el-button>
        <div v-show="isEdit">
            <el-button :disabled="saveLoading" @click="cancelEdit" size="medium">取消编辑</el-button>
            <el-button type="primary" @click="submit" size="medium" :loading="saveLoading">保存</el-button>
        </div>
    </Sticky>
  </el-card>
</template>

<script>
import vuedraggable from 'vuedraggable'
import iphonePreview from '@/components/iphonePreview';
import DialogUrl from './components/dialogUrl/dialogUrl.vue';
import { createUUID, debounce } from '@/utils/utils.js'
import { popupAdvertApi } from '@/api/ModuleMarketing.js'
export default {
    components: {
        iphonePreview,
        DialogUrl,
        vuedraggable,
    },
    computed: {
    },
    watch: {
    },

    data() {
        let defaultList = [];
        for(let i = 0; i < 3; ++i) {        //如果请求接口获取无数据时 则使用默认值
            defaultList.push({ id: createUUID(), text: '', color: '#333', pic: '', url: {} })
        }
        var dateTimeValidate = (rule, value, callback)=>{
            if(new Date(value[1]).getTime()<=new Date().getTime()){
                callback(new Error('结束时间不得小于当前时间'));
            }else{
                callback();
            }
        }
        var advertiseFrequencyValidate = (rule, value, callback)=>{
            if(value && (value == '有效期内显示' || value == '每天显示') &&!this.form.count){
                callback(new Error('请填写投放次数'));
            }else{
                callback()
            }
        }
        return {
            defaultLogoPic: require('@/assets/images/logo.png'),
            postBody: {     //请求参数
                category: 'DISTRI_CENTER',   //页面类型 [INDEX：首页，INDEX-T：首页模板，POSTER：海报页，POSTER-T：海报模板，DISTRI_CENTER: 分销中心]
                id: '',     //第一次为空 后面全为编辑操作
                source: 'mobile', // 来源[pc：pc端 mobile：移动端]
                name: '',       //页面名称
            },
            isLoading: true,       //是否在请求    
            isError: false,     //是否请求错误  报错后整个页面不允许被操作
            canEdit: true,      //是否可以被编辑 如果请求的code不为1 则不可以被编辑
            isEdit: false,      //是否处于编辑状态
            saveLoading: false,     //保存的loading
            showAmi: false,     //是否显示按钮组的提醒动画
            iframeUrl:this.$shareRedirectUrl + `?detailsType=index&device=mobile`,
            pageType:this.$route.query.type || 'add',
            form:{
                dateTime:[],
                advertiseFrequency:'有效期内显示',
                clickLimit:1,
                advertisePage:'首页',
                advertiseUesrType:'全部用户'
            },
            resBackUp:{},
            rules:{
                title:[{required:true,message:'请填写广告弹窗标题',trigger:'blur'}],
                dateTime:[{required:true,message:'请填写广告弹窗有效期',trigger:'blur'},{ validator:dateTimeValidate,trigger:'blur' }],
                seq:[{required:true,message:'请填写权重',trigger:'blur'}],
                advertiseUesrType:[{required:true,message:'请选择投放用户',trigger:'blur'}],
                sourceList:[{required:true,message:'请选择投放渠道',trigger:'blur'}],
                advertiseFrequency:[{required:true,message:'请选择投放频率类型',trigger:'blur'},/* {validator:advertiseFrequencyValidate,trigger:'change'} */],
                clickLimit:[{required:true,message:'请选择点击限制',trigger:'blur'}],
                photos:[{required:true,message:'请选择弹窗图片',trigger:'blur'}],
                count:[{required:true,message:'请填写投放次数',trigger:'blur'}],
            }
        }
    },
    mounted() {
        this.initHandler()
    },
    methods: {
        test(str){
            if(str==this.form.advertiseFrequency){
                return 'count'
            }else{
                return 'nothing'
            }
        },
        initHandler(){
            if(['lookInfo','edit','copy'].includes(this.pageType)){
                popupAdvertApi.queryAdvertise(this.$route.query.id).then(res=>{
                    if(res.code){
                        console.log(res)
                        this.form = this.$utils.object.deepClone(res.data)
                        this.resToForm(this.form)
                        this.resBackUp = this.$utils.object.deepClone(res.data)
                    }
                })
            }
            if(['add','edit','copy'].includes(this.pageType)){
                this.isEdit = true
            }
        },

        cancelEdit(){
            if(this.pageType=='add' || this.pageType=='copy' ){
                this.$router.go(-1)
            }else{
                this.isEdit = false
                this.form = this.$utils.object.deepClone(this.resBackUp)
                this.resToForm(this.resBackUp)
            }
        },
        resToForm(data){
            if(data.advertiseFrequency=='有效期内显示'){
                this.$set(this.form,'count2',data.count.toString()||'')
                this.$set(this.form,'count1','')
            }else if(data.advertiseFrequency=='每天显示'){
                 this.$set(this.form,'count1',data.count+''||'')
                this.$set(this.form,'count2','')
            }
            this.$set(this.form,'dateTime',[data.startTime, data.endTime])
            this.$forceUpdate()
        },

        submit(){
            console.log(this.$refs.form)
            this.$refs.form.validate((valid)=>{
                if(valid){
                    let $api= this.pageType=='edit'?'editAdvertise':'addAdvertise'
                    popupAdvertApi[$api]({...this.form, count:this.form.advertiseFrequency=='有效期内显示'?this.form.count2 : this.form.count1}).then(res=>{
                        if(res.code){
                            this.$message.success('成功新增弹窗广告')
                            this.$router.go(-1)
                        }
                    })
                }else{
                    return false
                }
            })
        },

        advertiseFrequencyChange(e){
            // 重新校验,清除校验错误信息
            this.$forceUpdate()
            if(e=='有效期内显示'){
                this.$refs.form.validateField('count1')
            }else if(e=='每天显示'){
                this.$refs.form.validateField('count2')
            }else{
                this.$refs.form.validateField('count1')
                this.$refs.form.validateField('count2')
            }
            this.$forceUpdate()
        },


        changeDate(e){ 
            if (this.form.dateTime) {
                this.$set(this.form, 'startTime', this.form.dateTime[0])
                this.$set(this.form, 'endTime', this.form.dateTime[1])
            } else {
                this.$set(this.form, 'startTime', '')
                this.$set(this.form, 'endTime', '')
            }
        }
    }
}
</script>

<style lang='scss' scoped></style>