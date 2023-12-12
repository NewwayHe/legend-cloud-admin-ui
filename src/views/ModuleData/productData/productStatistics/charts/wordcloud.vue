<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-wordcloud'
export default {
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '300px'
        },
        chartList: {
            type: Array
        }
    },
    data() {
        return {
            chart: null,
            maskImage:
                'data:image/jpeg;base64,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5eWRizMepJqOiivCP1ZJJWQUUUUDCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArrfAHik+G9eUTOfsNyQkw7L6N+FclRVQm4SUkYYnD08TRlRqLRn1krK6hlIKkZBHcUtcB8LfE39raIdNuHzdWQAGTy0fY/h0/Ku/r6GnUVSCkj8fxuEnhK8qE91/SYUUUVZyhRRRQAUUUUAFFFFAHGfErxF/Yfhp4YX23d5mKPHUL/ABH8v518/wBdb8Rde/tzxXP5bZt7X9xF6HHU/ia5KvCxdX2lR9kfq3D+A+p4ON170tX+i+SCiiiuY9sKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA2PC+uSeHvEFrqCE7FbbKo/iQ9RX0vDNHcQRzRMGjkUMrDuD0r5Qr3X4Ua9/aXhxtPlbM9idoz1KHp+XIr0cBVtJ031PjeLcBz0o4uK1jo/Tp9z/M76iiivVPgAooooAKKKKACsLxjrA0Pwte3gbEuzZF/vtwP8a3a8k+MurZew0hG4AM8g/Rf61jiKns6bkenk+E+t42nSe17v0Wv/APKCSzFicknJNJRRXz5+vBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAV1fw61r+xvF9qXbbBc/uJPTnofzxXKUqOyOrqcMpyD6GqhJwkpLoYYqhHEUZUZbSVj6yorK8NaoNZ8OWN+DlpYhv/wB4cH9RWrX0cWpK6PxirTlTm4S3Tt9wUUUUyAooooAK+bvHOp/2r4x1GcNlEk8pPovFfQmsXg07Rr28Jx5MLv8AiBxXy3I7SSM7HLMSSfc15uYz0UT7Xg7D3nUrvpZL56v8kNoooryz7wKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD2r4O6n5+h3enM3zW0u9R/st/wDXBr0mvCPhLf8A2XxebYnC3ULJ+I5H8jXu9e5g581FeR+WcS4f2OYTa2lZ/fv+IUUUV1HghRRRQByHxNvPsnga8AODOyxD8Tz+gr57r2j4zXOzQ9Ptgf8AWXBYj6L/APXrxevFx0r1bdj9M4UpcmX838zb/T9AooorjPpQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKANjwpefYPFel3OcBbhQfoTg/wA6+m6+T4nMUySDqrBh+FfVNnMLixt5hyJI1b8xmvUy6WkonwfGVK06VXumvut/mT0UUV6R8UFFFFAHkHxpmzeaVBngRu/5kD+leV16R8ZXz4isU/u2382Neb14OLd60j9Y4fjy5bSXk/zYUUUVznshRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFfTfhWb7R4T0qUnJNqn8sV8yV9IeAn3+BtJPpDj8ia9DL377XkfIcYxvhqcv736HR0UUV6x+ehRRRQB4h8Yv8AkaLX/r1H/oRrzuvSPjKmPEVi/wDetv5Ma83rwMV/GkfreRO+XUvT9QooorA9YKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr6M+Hn/IiaX/ANcz/wChGvnOvpDwEmzwNpI9Yc/mTXfl/wDEfofJcYP/AGSC/vfozo6KKK9c/OwooooA8g+NMOLzSp8cGN0/Ig/1ryuvaPjNbb9D0+5A/wBXcFSfqv8A9avF68PGK1Zn6nw1U58tp+V1+LCiiiuU94KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr6b8Kw/Z/CelREYItU/lmvmeJDLMkY6swUfjX1TZwi3sbeEDAjjVfyGK9HLlrJnxfGVS1OlDu2/ut/mT0UUV6p8EFFFFAHIfE2z+1+BrwgZMDLKPwPP6GvnuvqbWLMajo17ZkZ86F0/EjivluRGjkZGGGUkEe4rycwjaakf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dVDG4nD/AMGbj6M8kvfgu3JsdXB9Fnj/AKj/AArAuvhN4lgJ8pLa4H+xLg/riveqK55YGi9lY9ilxRmNPeSl6r/Kx83z+AvFFuTu0e4bHdMN/I1Rk8M67EcPpF6P+2Df4V9PUVk8vh0bO6HGOJXxU4v71/mfLZ0PVh10y8/78N/hSroOrv8Ad0u8P/bBv8K+o6KX9nR/mNP9cqv/AD6X3/8AAPmaLwj4hn/1ejXp+sRH860bf4b+KrjH/EsMY9ZJFX+tfRFFUsvp9WzGfGGKfwwivvf6niNp8HdbmINzd2luO+CXP6Cuhsfg1p0RDX2o3E57rGoQf1r02itY4OjHpc8+txJmNXTn5fRL/hzndN8C+G9Lw0GmRO4/jm+c/rXQIixqFRQqjoAMCnUV0RhGOkVY8etiKtZ81WTk/N3CiiiqMQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q=='
        }
    },
    watch: {
        chartList() {
            this.initChart()
        }
    },
    mounted() {
        this.initChart()
    },
    beforeDestroy() {},
    methods: {
        initChart() {
            this.chart = echarts.init(document.querySelector('.chart'))
            this.setOptions()
        },
        setOptions() {
            let maskImage = new Image()
            maskImage.src = this.maskImage

            this.chart.setOption({
                series: [
                    {
                        type: 'wordCloud',

                        // The shape of the "cloud" to draw. Can be any polar equation represented as a
                        // callback function, or a keyword present. Available presents are circle (default),
                        // cardioid (apple or heart shape curve, the most known polar equation), diamond (
                        // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.

                        shape: 'circle',

                        // A silhouette image which the white area will be excluded from drawing texts.
                        // The shape option will continue to apply as the shape of the cloud to grow.

                        maskImage: maskImage,
                        // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
                        // Default to be put in the center and has 75% x 80% size.

                        left: 'center',
                        top: 'center',
                        width: '70%',
                        height: '80%',
                        right: null,
                        bottom: null,

                        // Text size range which the value in data will be mapped to.
                        // Default to have minimum 12px and maximum 60px size.

                        sizeRange: [12, 60],

                        // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45

                        rotationRange: [-90, 90],
                        rotationStep: 45,

                        // size of the grid in pixels for marking the availability of the canvas
                        // the larger the grid size, the bigger the gap between words.

                        gridSize: 8,

                        // set to true to allow word being draw partly outside of the canvas.
                        // Allow word bigger than the size of the canvas to be drawn
                        drawOutOfBound: false,

                        // If perform layout animation.
                        // NOTE disable it will lead to UI blocking when there is lots of words.
                        layoutAnimation: true,

                        // Global text style
                        textStyle: {
                            fontFamily: 'sans-serif',
                            fontWeight: 'bold',
                            // Color can be a callback function or a color string
                            color: function () {
                                // Random color
                                return (
                                    'rgb(' +
                                    [Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',') +
                                    ')'
                                )
                            }
                        },
                        emphasis: {
                            focus: 'self',

                            textStyle: {
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },

                        // Data is an array. Each array item must have name and value property.
                        data: this.chartList
                    }
                ]
            })
        }
    }
}
</script>
