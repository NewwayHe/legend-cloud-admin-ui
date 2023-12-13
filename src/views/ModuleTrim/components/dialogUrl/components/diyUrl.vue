<template>
    <!-- /*
 * @Descripttion:选择链接弹框组件
*/ -->
    <div class="w-100 text-center px-30 py-20">
        <el-input
            v-model="value[field].url"
            class="position-relative"
            type="textarea"
            placeholder="输入外部链接请加上http://或https://， #代表正在开发中。
如果要采用内部链接，可以不加http，例如：
PC端[某商品详情页面]的链接是：http://diamonds.legendshop.cn/views/111，则可以在这里输入(注意第一个字要：/')：/views/111；
手机端[某商品详情页面]的链接：：https://mdiamonds.legendshop.cn/commonModules/goodsDetail/goodsDetail?goodsInfoId=111，可以以在这里输入(注意第一个字要：/')：/goodsDetail/goodsDetail?goodsInfoId=111。
PS：微信小程序如果需要添加外部链接，则必需先到微信公众平台将相应的外部链接添加到【业务域名】内"
            maxlength="500"
            show-word-limit
            rows="10"
            clearable
            @input="choice"
        />
        <i
            v-if="value[field].url"
            class="el-icon-error font-20 text-ccc v-bottom position-absolute"
            style="right: 35px; top: 25px"
            @click="value[field].url = ''"
        />
    </div>
</template>
<script>
export default {
    components: {},
    props: {
        value: {
            type: Object,
            default: () => {
                return {}
            }
        },
        parmas: {
            type: Object,
            default: () => {
                return {}
            }
        },
        field: {
            //如果是对象，显示的键名，选中的对象是存放到value[this.field]里的
            type: String,
            default: ''
        }
    },
    data() {
        return {}
    },
    computed: {},
    watch: {},
    created() {},
    methods: {
        choice(e) {
            let item = {
                name: e,
                type: '自定义',
                url: e, // 当点击‘常用功能’里的选项后再点击自定义，由于value值是‘常用功能’里的值，如果el-input里v-model是用id或name值的话，会将‘常用功能’里的值赋到页面上，所以只能用另外一个参数来保存该值
                id: true //由于页面是判断有ID值才显示内容，所以这里随便赋一个id值，该值可以为
            }
            this.$set(this.value, this.field, this.$utils.object.deepClone(item))
        }
    }
}
</script>

<style lang="scss" scoped></style>
