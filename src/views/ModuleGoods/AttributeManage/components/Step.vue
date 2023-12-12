<template>
    <!-- 指引 -->
    <div class="lead">
        <h3>商品属性设置指引</h3>
        <div>
            <p>平台需要设置规格/参数/参数组/品牌/类目后，使用类目关联规格/参数/参数组/品牌，商家才可以在发布商品时使用使用该类目关联的规格/参数/参数组；</p>
            <slot></slot>
        </div>
        <div class="font-0">
            <el-button type="text" @click="$router.push({name:'specifications'})" size="small">设置规格</el-button>
            <el-button type="text" @click="$router.push({name:'params'})" size="small">设置参数</el-button>
            <el-button type="text" @click="$router.push({name:'commodityBrand'})" size="small">设置品牌</el-button>
            <el-button type="text" @click="$router.push({name:'commodityCategory'})" size="small">设置类目</el-button>
            <span class='mx-10 font-14 iconfont icon-a-nextstep text-ccc'></span>
            <el-button type="text" @click="$router.push({name:'paramsGroup'})" size="small">设置参数组</el-button>
            <span class='mx-10 font-14 iconfont icon-a-nextstep text-ccc'></span>
            <el-button type="text" @click="$router.push({name:'specificationParamsGroup'})" size="small">类目关联规格/参数/参数组/品牌</el-button>
            <span class='mx-10 font-14 iconfont icon-a-nextstep text-ccc'></span>
            <el-button type="text" class="text-333" size="small">商家发布商品</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Step'
}
</script>

<style lang='scss'>
/* 修改popover样式 不能加scoped */
.el-popover.atooltip {
    padding: 10px;
}
</style>

<style lang="scss" scoped>
::v-deep.el-step.is-horizontal {
    .el-step__line {
        height: 1px;
    }
}
::v-deep.el-step__title.is-wait {
    font-size: 12px;
}
</style>

<style lang="scss" scoped>
.step-wrapper {
    display: flex;
    justify-content: space-between;
    overflow: hidden;

    .step-1 {
        margin-left: 7%;
        position: relative;
        flex-basis: 33.3%;

        .item {
            margin-bottom: 20px;
            position: relative;

            .line {
                position: absolute;
                height: 1px;
                width: 100%;
                top: 50%;
                left: 0;
                background-color: #c0c4cc;
            }

            .button {
                position: relative;
                z-index: 1;
            }

            &:after {
                content: '';
                position: absolute;
                width: 1px;
                height: calc(100% + 20px);
                background-color: #c0c4cc;
                top: 50%;
                right: 0;
            }
        }

        .item:last-child:after {
            content: none;
        }

        .item:last-child {
            margin-bottom: 0;
        }

        &::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -100%;
            width: 100%;
            height: 1px;
            background-color: #c0c4cc;
        }
    }

    .step-2 {
        flex: 1;
        align-self: center;
        text-align: center;
        position: relative;
        flex-basis: 33.3%;

        .line {
            height: 1px;
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            background-color: #c0c4cc;
        }

        .button {
            position: relative;
            z-index: 1;
        }
    }

    .step-3 {
        flex: 1;
        position: relative;
        z-index: 1;
        flex-basis: 33.3%;

        .sumit {
            padding: 10px;
            border: 1px solid #409eff;
            border-radius: 5px;
            background: #409eff;
            color: #fff;
            font-size: 12px;
        }
    }
}
</style>
