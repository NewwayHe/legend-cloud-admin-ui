// 所有种类楼层的默认值
import { createUUID } from '@/utils/utils.js'

export const defFloorVal = {
    banner: {
        uuid: createUUID(),
        type: 'banner',
        typeName: '楼层组件-轮播图',
        cardType: '0', //是否启用卡片模式,'0'：'默认'，'1'：'卡片式'，'2':'堆叠式'
        borderRadius: false, //是否加圆角
        autoplay: true, //是否自动播放
        interval: 5000, //自动播放的时间间隔，单位为毫秒
        loop: true, //是否循环显示
        vertical: false, //滑动方向是否为纵向
        indicatorDots: 'default', //指示器：default：默认(条形)，dot：圆点，round：柱状，nav：导航，indexes：数字，none：关闭
        indicatorThemeColor: true, //指示器采用主题颜色(此时indicatorColor将会失效)
        indicatorColor: '#333333', //指示器颜色
        indicatorPosition: 'down-mid', //指示器位置，up-left：上左、up-right：上右，down-left：下左、down-mid：下中、down-right：下右
        backgroundColor: '', //背景色
        height: 180, //轮播图的高度
        cardWidth: 90, //单位：%，cardType==2时才用到，卡片模式下图片占屏幕的宽度
        data: {
            imgList: [
                //轮播图
                {
                    img: '', //图片
                    url: {}, //把对应的type的选中的元素对象赋值到该对象中
                    content: '', //当indicatorDots==nav时，可以输入文本内容
                    time: [] //有效时间
                }
            ]
        }
    },

    menuTab: {
        uuid: createUUID(),
        type: 'menuTab',
        typeName: '楼层组件-菜单',
        themeColor: false, //是否应用主题颜色(此时backgroundColor将会失效)
        backgroundColor: '#ffffff',
        position: 'start', //对齐方式：start靠左，center居中，around等距留白，between左右对齐，end靠右,
        assistLine: false, //有没分割线
        color: '', //字体颜色
        fontThemeColor: false, //字体是否应用主题颜色(此时color将会失效)
        borderColor: '', //边框线(分割线)颜色
        bdThemeColor: false, //边框线是否应用主题颜色(此时borderColor将会失效)
        data: {
            titleList: [
                //菜单
                {
                    title: '标题',
                    themeColor: false,
                    color: '', //字体颜色
                    img: '', //小图标
                    url: {} //链接
                }
            ]
        }
    },

    searchAndTab: {
        uuid: createUUID(),
        data: {
            linkType: 'poster', //海报链接的类型
            tabList: [
                //标签列表
                {
                    isSelect: true,
                    title: '标题',
                    themeColor: false,
                    color: '', //字体颜色
                    url: {} //把对应的type的选中的元素对象赋值到该对象中
                }
            ]
        }
    },

    cube: {
        uuid: createUUID(),
        type: 'cube',
        typeName: '楼层组件-魔方',
        cubeType: '1-2', //魔方样式：1*2:1行2列,1*3:1行3列,1*4:1行4列,2*2:2行2列,1-2:1左2右，2*3:2行3列
        cardType: false, //是否启用卡片模式
        height: 375, //魔方高度
        backgroundColor: '', //背景颜色(卡片模式下有用)
        backgroundImg: '', //背景图片(卡片模式下有用)
        data: {
            imgList: [
                //广告图
                {
                    img: '', //图片
                    url: {} //链接
                },
                {
                    img: '', //图片
                    url: {} //链接
                },
                {
                    img: '', //图片
                    url: {} //链接
                }
            ]
        }
    },

    prodList: {
        uuid: createUUID(),
        type: 'prodList',
        typeName: '楼层组件-商品列表',
        themeColor: false, //是否应用主题颜色(此时backgroundColor将会失效)
        backgroundColor: '#fafafa',
        listType: 2, //列表样式，1：详细列表，2：小图两列，3：小图三列，4：小图四列
        wrap: true, //是否支持换行(listType==2，3，4时才有用)

        cardType: true, //是否启用卡片模式
        sourceType: 'goods', //列表显示的商品来源，goods：自定义选择的商品(当该值为goods时，下面data.goodsList才会生效)，category：关联分类，prodGroup：关联分组

        showSpuName: true, //显示商品名字
        showPrice: true, //显示价格
        // showShopCart: true, //显示购物车
        showIcon: 'none', //none：隐藏，new：新品，hot：热卖，diy：自定义
        iconImg: '', //当showIcon:'diy'时就用该值
        maxNum: 4, //当sourceType:'category'或sourceType:'prodGroup'时，显示的商品数量
        data: {
            goodsList: [
                //当sourceType:'goods'时保存选择的商品数据
                // 该数组下的元素默认有下面这些变量(前端只有id和type和diyPic有用)
                // {
                //     diyPic: true     //注意：当这个为true时，前端根据id更新数据时，不要更新pic，因为这个pic是用户自定义的，并不是商品原来的图片
                //     id: 5651
                //     name: "1231321"
                //     pic: "/dev6.0/2020/09/25/23a6ba476bee4c38ba5fd4018f1ab1e0.jpg"
                //     price: "1.00"
                //     shopId: 1102
                //     siteName: "店铺"
                //     type: "商品"
                // }
            ],
            categoryData: {
                //当sourceType:'category'时保存选择的分类id等数据
                // 该对象下的元素默认有下面这些变量(前端只有id和type有用)
                // id: [16616,16617,16618]
                // name: ["数码办公","手机通讯","手机"]
                // type: "商品分类"
            },
            prodGroupData: {
                //当sourceType:'prodGroup'时保存选择的分组id等数据
                // 该对象下的元素默认有下面这些变量(前端只有id和type有用)
                // conditional: "{"sortBy": "buys", "descending": "desc"}"
                // createTime: "2019-07-04 11:27:07"
                // description: "平台所有商品，销量最高的排在前面"
                // id: 401
                // name: "最热商品"
                // sort: null
                // type: "商品分组"
            }
        }
    },

    navigation: {
        uuid: createUUID(),
        type: 'navigation',
        typeName: '楼层组件-图文导航',
        cardType: false, //是否启用卡片模式
        autoplay: false, //是否自动播放
        interval: 5000, //自动播放的时间间隔，单位为毫秒
        loop: true, //是否循环显示
        vertical: false, //滑动方向是否为纵向
        indicatorDots: 'default', //指示器：rectangle：条形，circle：圆点，none：关闭

        backgroundColor: '#ffffff',
        themeColor: false, //是否应用主题颜色(此时backgroundColor将会失效)
        color: '', //字体颜色
        fontThemeColor: false, //字体是否应用主题颜色(此时color将会失效)
        indicatorThemeColor: true, //指示器采用主题颜色(此时indicatorColor将会失效)
        indicatorColor: '#333333', //指示器颜色
        col: 4, //每行N列，可选值：3，4，5
        row: 2, //N行，可选值：1，2，多行

        data: {
            imgList: [
                //轮播图
                {
                    title: '标题',
                    themeColor: false,
                    color: '', //字体颜色
                    img: '', //小图标
                    url: {} //把对应的type的选中的元素对象赋值到该对象中
                }
            ]
        }
    },

    navigationTab: {
        uuid: createUUID(),
        type: 'navigationTab',
        typeName: '楼层组件-TAB导航',
        cardType: false, //是否启用卡片模式
        autoplay: false, //是否自动播放
        interval: 5000, //自动播放的时间间隔，单位为毫秒
        loop: false, //是否循环显示
        vertical: false, //滑动方向是否为纵向
        indicatorDots: 'none', //指示器：rectangle：条形，circle：圆点，none：关闭

        tabsShow: true, //是否显示tab菜单栏。
        tabsType: 'pills', //下标样式，pills：胶囊模式，line：下划线模式，none：不显示下标
        // assistLine: false, //是否显示分割线
        // assistLineColor: '', //分割线颜色，如果不传值，则采用tabNoCurColor值且透明度设为0.4

        tabCurColor: '#333333', //tab栏选中的字体颜色
        tabCurThemeColor: true, //tab栏选中的字体颜色采用主题色(这时tabCurColor会失效)
        tabNoCurColor: '#999999', //tab栏未选中的字体颜色
        tabBgColor: '', //tab栏背景颜色
        tabBgThemeColor: false, //tab栏背景颜色采用主题色(这时tabBgColor会失效)

        backgroundColor: '#ffffff',
        themeColor: false, //是否应用主题颜色(此时backgroundColor将会失效)
        color: '', //字体颜色
        fontThemeColor: false, //字体是否应用主题颜色(此时color将会失效)
        indicatorThemeColor: true, //指示器采用主题颜色(此时indicatorColor将会失效)
        indicatorColor: '#333333', //指示器颜色
        col: 4, //每行N列，可选值：3，4，5

        data: {
            tabList: [
                {
                    title: '菜单',
                    uuid: createUUID(),
                    isSelect: false, //是否选择
                    imgList: [
                        //轮播图
                        {
                            title: '标题',
                            themeColor: false,
                            color: '', //字体颜色
                            img: '', //小图标
                            url: {}, //把对应的type的选中的元素对象赋值到该对象中
                            time: [] //有效时间
                        }
                    ]
                }
            ]
        }
    },

    noticeBar: {
        uuid: createUUID(),
        type: 'noticeBar',
        typeName: '楼层组件-动态广播',
        backgroundColor: '#F8F8F8', //背景色
        themeColor: false, //是否应用主题颜色(此时backgroundColor将会失效)
        title: '', //标题内容
        titleColor: '', //标题字体颜色
        titleThemeColor: true, //标题字体是否应用主题颜色(此时color将会失效)
        contentColor: '#666666', //内容字体颜色
        // 以下为新增
        paddingY: 10, //上下边距，单位：px
        paddingX: 10, //左右边距，单位：px
        borderRadius: true, //是否加圆角
        data: {
            contentList: [
                //菜单
                {
                    title: '标题',
                    show: true, //上线
                    color: '', //字体颜色
                    url: {} //链接
                }
            ]
        }
    },

    richText: {
        uuid: createUUID(),
        type: 'richText',
        typeName: '其它组件-富文本',
        themeColor: false, //是否应用主题颜色(此时backgroundColor将会失效)
        backgroundColor: '#ffffff',
        fullScreen: false, //是否全屏(最外层是否加上 padding: 10px;)
        data: {
            richTextData: '富文本' //富文本数据
        }
    },

    assistLine: {
        uuid: createUUID(),
        type: 'assistLine',
        typeName: '其它组件-辅助线',
        themeColor: false, //是否应用主题颜色(此时backgroundColor将会失效)
        backgroundColor: '#ffffff',
        assistType: 'none', //辅助线的类型， solid:实线,dotted:点状,dashed:虚线,none:不设辅助线
        size: 1, //辅助线的大小，1:小，2:中,3:大
        fontThemeColor: false, //辅助线是否应用主题颜色(此时color将会失效)
        color: '#333333', //辅助线的颜色
        position: 'middle', //对齐方式：left靠左，middle居中，right靠右,
        height: 44, //楼层高度
        width: 60 //辅助线的长度，单位：%
    },

    titleTab: {
        uuid: createUUID(),
        type: 'titleTab',
        typeName: '其它组件-标题',
        themeColor: false, //是否应用主题颜色(此时backgroundColor将会失效)
        backgroundColor: '#ffffff',
        showIcon: 'none', //none：隐藏，block：色块，diy：自定义
        iconImg: '', //当showIcon:'diy'时就用该值
        titleType: 1, //列表样式，1：靠左且有副标题和查看更多，2：居中，3：居中且有分隔线
        radius: 'none', //top 上圆角、bottom 下圆角、 topAndBottom 上下圆角
        borderRadius: 10,
        paddingX: 0,
        data: {
            title: {
                //标题
                title: '标题',
                themeColor: false,
                color: '#333333', //字体颜色
                fontSize: 16, //字体大小
                fontWeight: false, //加粗
                borderColor: 'rgba(238, 242, 246, 1)' //titleType==3时的分隔线颜色
            },
            seTitle: {
                //副标题
                title: '副标题',
                themeColor: false,
                color: '#999999', //字体颜色
                fontSize: 12, //字体大小
                fontWeight: false //加粗
            },
            more: {
                //查看更多
                title: '查看更多',
                themeColor: true,
                color: '#333333', //字体颜色
                fontSize: 14, //字体大小
                fontWeight: false, //加粗
                url: {} //链接
            }
        }
    },
    coupon: {
        uuid: createUUID(),
        type: 'coupon',
        typeName: '营销组件-优惠券', //该值在添加时，会在addFloors.vue里被重新定义
        themeColor: true, //是否应用主题颜色(此时backgroundColor将会失效)
        backgroundColor: '#f5f5f5',
        showIcon: 'none', //none：隐藏，block：色块，diy：自定义
        iconImg: '', //当showIcon:'diy'时就用该值
        titleType: 1, //列表样式，1：靠左且有副标题和查看更多，2：居中，3：居中且有分隔线
        listType: 2, //列表样式，1：简单，2：复杂
        borderRadius: false, //是否加圆角
        data: {
            title: {
                //标题
                title: '优惠券',
                themeColor: false,
                color: '#ffffff', //字体颜色
                fontSize: 16, //字体大小
                fontWeight: true, //加粗
                borderColor: 'rgba(238, 242, 246, 1)' //titleType==3时的分隔线颜色
            },
            seTitle: {
                //副标题
                title: '',
                themeColor: false,
                color: '#ffffff', //字体颜色
                fontSize: 12, //字体大小
                fontWeight: false //加粗
            },
            more: {
                //查看更多
                title: '查看更多',
                themeColor: false,
                color: '#ffffff', //字体颜色
                fontSize: 14, //字体大小
                fontWeight: false, //加粗
                url: {
                    //链接
                    id: 'couponCenter',
                    name: '领券中心',
                    type: '营销活动'
                }
            }
        }
    }
}
