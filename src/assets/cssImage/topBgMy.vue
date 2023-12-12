<template>
    <!-- 波动效果
        注意：父组件的容器要加入position:relative;并且设定宽和高
     -->
    <div
        class="content"
        :style="{
            '--themescolor': color,
            '--themesrgba09': themesRGBA09,
            '--themesrgba08': themesRGBA08,
            '--themesrgba07': themesRGBA07,
            '--themesrgba06': themesRGBA06,
            '--themesrgba05': themesRGBA05,
            '--themesrgba04': themesRGBA04,
            '--themesrgba03': themesRGBA03,
            '--themesrgba02': themesRGBA02,
            '--themesrgba01': themesRGBA01,
            borderRadius:borderRadius?'0 0 50% 50%':'0'
        }"
    >
        <!-- 波动 -->
        <div class="waves" :style="{left:`${type==2?'50%':'152px'}`,bottom:`${type==2?'110px':'48px'}`}"></div>
        <!-- 云朵 -->
        <div class="cloud" :style="{right:`35%`,bottom:`30%`}"></div>
        <div class="cloud" :style="{left:`28%`,bottom:`30%`}" v-if="type==2"></div>
    </div>
</template>

<script>
export default {
    props: {
        color: {//背景颜色
            type: String,
            default: '$mainColor'
        },
        borderRadius: {//是底部是否带弧度
            type: Boolean,
            default: true
        },
        type: {//类型，根据不同的类型，波动效果和云朵的定位不同
            type: [String,Number],
            default: 1
        }
    },
    data() {
        return {};
    },

    computed: {
        themesRGBA09() {
            const color = this.$utils.color.colorRgb(this.color)
            return `rgba(${color.r}, ${color.g},${color.b},.9)`;
        },
        themesRGBA08() {
            const color = this.$utils.color.colorRgb(this.color)
            return `rgba(${color.r}, ${color.g},${color.b},.8)`;
        },
        themesRGBA07() {
            const color = this.$utils.color.colorRgb(this.color)
            return `rgba(${color.r}, ${color.g},${color.b},.7)`;
        },
        themesRGBA06() {
            const color = this.$utils.color.colorRgb(this.color)
            return `rgba(${color.r}, ${color.g},${color.b},.6)`;
        },
        themesRGBA05() {
            const color = this.$utils.color.colorRgb(this.color)
            return `rgba(${color.r}, ${color.g},${color.b},.5)`;
        },
        themesRGBA04() {
            const color = this.$utils.color.colorRgb(this.color)
            return `rgba(${color.r}, ${color.g},${color.b},.4)`;
        },
        themesRGBA03() {
            const color = this.$utils.color.colorRgb(this.color)
            return `rgba(${color.r}, ${color.g},${color.b},.3)`;
        },
        themesRGBA02() {
            const color = this.$utils.color.colorRgb(this.color)
            return `rgba(${color.r}, ${color.g},${color.b},.2)`;
        },
        themesRGBA01() {
            const color = this.$utils.color.colorRgb(this.color)
            return `rgba(${color.r}, ${color.g},${color.b},.1)`;
        }
    },
    methods: {}
};
</script>

<style lang="scss" scoped>
.content {
    /* background: #0A212E; */
    background: var(--themescolor);
    position: absolute;
    margin: 0px;
    overflow: hidden;
    animation: colorloop 6s infinite;

    width: 160%;
    height: 100%;
    top: 0;
    left: -30%;
    // border-radius: 0 0 50% 50%;
}
@keyframes colorloop {
    0% {
        background: var(--themescolor);
    }
    13% {
        background: var(--themesrgba09);
    }
    25% {
        background: var(--themesrgba08);
    }
    38% {
        background: var(--themesrgba07);
    }
    50% {
        background: var(--themesrgba06);
    }
    63% {
        background: var(--themesrgba07);
    }
    75% {
        background: var(--themesrgba08);
    }
    88% {
        background: var(--themesrgba09);
    }
    100% {
        background: var(--themescolor);
    }
}

/* <!-- 云朵 --> */
.cloud {
    position: absolute;
    // right: 35%;
    // bottom: 30%;
    transform: scale(0.5);
    opacity: 0.7;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--themescolor);
    box-shadow: var(--themescolor) 65px -15px 0 -5px, var(--themescolor) 25px -25px, var(--themescolor) 30px 10px, var(--themescolor) 60px 15px 0 -10px,
        var(--themescolor) 85px 5px 0 -5px;
}
/* <!-- /云朵 --> */

/* <!-- 波动 --> */
.waves {
    position: absolute;
    // bottom: 48px;
    /* top: 50%; */
    /* background: var(--themesrgba08); */
    background: rgba(255, 255, 255, 0.3);
    /* left: 50%; */
    // left: 152px;
    width: 25px;
    height: 25px;
    margin-left: -12px;
    margin-top: -12px;
    border-radius: 50%;
    -webkit-backface-visibility: hidden;
}
.waves:before {
    position: absolute;
    background: var(--themesrgba06);
    /* background: white; */
    margin-left: -12px;
    margin-top: -12px;
    width: 50px;
    height: 50px;
    content: '';
    display: block;
    border-radius: 50%;
    -webkit-backface-visibility: hidden;
    animation: wave-animate 6s infinite ease-out;
}
.waves:after {
    position: absolute;
    background: var(--themesrgba06);
    /* background: white; */
    margin-left: -12px;
    margin-top: -12px;
    width: 50px;
    height: 50px;
    content: '';
    display: block;
    border-radius: 50%;
    -webkit-backface-visibility: hidden;
    opacity: 0;
    animation: wave-animate 6s 3s infinite ease-out;
}
@keyframes wave-animate {
    0% {
        transform: scale(0);
        opacity: 1;
        transform-origin: center;
    }
    100% {
        transform: scale(3);
        opacity: 0;
        transform-origin: center;
    }
}
/* <!-- /波动 --> */

</style>
