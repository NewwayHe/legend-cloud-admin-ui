<template>
    <!-- /*
     * @Descripttion:右边编辑栏(基本配置)
    */ -->
    <!-- 右边编辑栏(基本配置) -->
    <div>
        <div class="font-16 text-center pb-30">基本配置</div>
        <!-- 商城主题色： -->
        <div class="mb-30">
            <div class="pb-15">{{ value.category == 'POSTER' || value.category == 'POSTER-T' ? '海报' : '商城' }}主题色：</div>
            <div class="pb-15 mall-set-theme" :style="{ '--settingBackground': value.themeColor }">
                <el-radio v-model="themeColorCustom" :label="false">推荐配色</el-radio>
                <el-radio v-model="themeColorCustom" :label="true">自定义配色</el-radio>
            </div>
            <div class="bg-f9 rounded-3 px-20 pt-20 d-flex flex-wrap mb-20">
                <div
                    v-for="(item, index) in themeColorDefault"
                    v-show="!themeColorCustom"
                    :key="index + 1"
                    class="mr-20 mb-20 d-flex hover-scale1-2 rounded-2 overflow-h zoom-out0002"
                    :class="[item == value.themeColor ? 'shadow-lg scale11' : '']"
                    @click="changeThemeColor(item)"
                >
                    <div style="width: 18px; height: 18px" :style="{ backgroundColor: item }"></div>
                    <div style="width: 18px; height: 18px; opacity: 0.2" :style="{ backgroundColor: item }"></div>
                    <div class="border" style="width: 18px; height: 18px; background-color: white"></div>
                </div>
                <div v-show="themeColorCustom" class="mb-15 zoom-out0002"><el-color-picker v-model="value.themeColor"></el-color-picker></div>
            </div>
        </div>
        <!-- 首页背景色/背景图： -->
        <div class="mb-30">
            <div class="pb-15">
                <span>背景色/背景图：</span>
                <el-tooltip effect="dark" content="若同时上传了背景图和设置了背景色，则填充背景色，上面覆盖背景图" placement="top-start">
                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                </el-tooltip>
            </div>
            <div class="bg-f9 rounded-3 px-20 pt-20 d-flex flex-wrap mb-20">
                <div class="mb-15 w-100 flex-start">
                    <div class="flex-1 flex-start">
                        <span class="pr-15">背景颜色：</span>
                        <el-color-picker v-model="value.backgroundColor" show-alpha></el-color-picker>
                    </div>
                    <div class="flex-1 flex-start">
                        <span class="pr-15">背景图片：</span>
                        <imgCenter v-model="value.backgroundImg" class="pr-15" :upload-style="{ width: '80px', height: '80px' }"></imgCenter>
                        <el-tooltip effect="dark" content="建议尺寸：宽750px，默认置顶显示" placement="top-start">
                            <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="value.category == 'INDEX' || value.category == 'INDEX-T'" class="mb-20">
            <div class="pb-15">{{ floorHead.title }}：</div>
            <div class="mb-15 floor-head">
                <el-radio-group v-model="value.head.type" size="mini" @change="change">
                    <el-radio v-for="(item, index) in floorHead.botton" :key="index" border :label="item.flag" :disabled="item.disabled">
                        {{ item.name }}
                    </el-radio>
                </el-radio-group>
            </div>

            <!-- 搜索+轮播图 -->
            <div v-if="value.head.type == 'searchAndBanner' || value.head.type == 'searchAndTab'" class="bg-f9 rounded-3 p-20 mb-20">
                <div class="font-14 text-center pb-10 border-bottom">搜索框设置：</div>
                <div class="flex-start text-nowrap mt-15 mb-15">
                    <span class="pr-15">&emsp;商城名字：</span>
                    <el-input
                        v-model="value.head.title.name"
                        class="flex-1"
                        placeholder="请输入内容"
                        size="mini"
                        clearable
                        maxlength="10"
                        show-word-limit
                    ></el-input>
                </div>
                <div v-if="value.head.title.name" class="flex-start text-nowrap mb-15">
                    <span class="pr-15">&emsp;字体大小：</span>
                    <el-slider v-model="value.head.title.size" class="flex-1" input-size="mini" :min="15" :max="30"></el-slider>
                    <el-switch v-model="value.head.title.fontWeight" class="pl-15" active-text="加粗"></el-switch>
                </div>
                <div class="flex-start mb-15 text-nowrap">
                    <span class="mr-15 w-75p text-right">背景颜色：</span>
                    <el-radio v-model="value.head.themeColor" :label="true">主题色</el-radio>
                    <el-radio v-model="value.head.themeColor" :label="false">
                        <span class="mr-10">自定义</span>
                        <el-color-picker v-model="value.head.backgroundColor" class="v-middle"></el-color-picker>
                    </el-radio>
                </div>
                <div v-if="!showBanner" class="flex-start mb-15">
                    <span class="mr-15">背景图片：</span>
                    <imgCenter v-model="value.head.backgroundImg" class="mr-15" :upload-style="{ width: '80px', height: '80px' }"></imgCenter>
                    <el-tooltip effect="dark" placement="top-start">
                        <div slot="content" class="line-h-lg">
                            建议尺寸：宽750px。注意：
                            <br />
                            一、如果开启了[轮播图]，则背景图片将会失效并不可设置。
                            <br />
                            二、如果设置了背景颜色，则由于背景颜色排在背景图之前而覆盖背景图，如果想显示背景图片，
                            <br />
                            则请先清空[背景颜色]或者开启[背景色渐变]
                        </div>
                        <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                    </el-tooltip>
                </div>
                <div class="flex-start mb-15 text-nowrap">
                    <span class="pr-15">搜索框颜色：</span>
                    <el-color-picker v-model="value.head.seachColor" class="v-middle"></el-color-picker>
                </div>
                <div class="flex-start mb-15 text-nowrap">
                    <span class="pr-15">背景色渐变：</span>
                    <el-switch v-model="value.head.bgGradualChange" class="pr-10" :disabled="showBanner"></el-switch>
                    <el-tooltip
                        effect="dark"
                        content="备注：开启背景色渐变后，当手机屏幕滚动时，搜索栏的背景色由浅到深逐渐显示"
                        placement="top-start"
                    >
                        <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                    </el-tooltip>
                </div>
                <!-- 作用不大，先屏蔽 -->
                <div class="flex-start mb-15 text-nowrap">
                    <span class="pr-15">&emsp;文字颜色：</span>
                    <el-color-picker v-model="value.head.color" class="v-middle"></el-color-picker>
                </div>

                <div class="flex-col-start mb-15 text-nowrap">
                    <div class="flex-start mb-15">
                        <span class="pr-15">定位和logo：</span>
                        <div class="text-wrap">
                            <el-radio v-model="value.head.locationAndLogo && value.head.locationAndLogo.flag" :label="1">定位</el-radio>
                            <el-radio v-model="value.head.locationAndLogo && value.head.locationAndLogo.flag" :label="2">Logo</el-radio>
                            <el-radio v-model="value.head.locationAndLogo && value.head.locationAndLogo.flag" :label="0">无</el-radio>
                        </div>
                    </div>
                    <template v-if="value.head.locationAndLogo && value.head.locationAndLogo.flag == 2">
                        <div class="flex-start w-100">
                            <span class="pr-15">&nbsp;&nbsp;Logo图片：</span>
                            <imgCenter
                                v-model="value.head.locationAndLogo.logo"
                                class="pr-15"
                                :upload-style="{ width: '50px', height: '50px' }"
                                :is-preview="false"
                                @input="checkForm"
                            ></imgCenter>
                            <el-tooltip
                                effect="dark"
                                :content="`图片尺寸：${28 * 2}px * ${value.head.locationAndLogo.logoWidth * 2}px`"
                                placement="top-start"
                            >
                                <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                            </el-tooltip>
                        </div>
                        <div class="flex-start w-100">
                            <span class="pr-15">&nbsp;&nbsp;Logo宽度：</span>
                            <el-slider
                                v-model="value.head.locationAndLogo.logoWidth"
                                class="w-100"
                                input-size="mini"
                                :min="28"
                                :max="150"
                                show-input
                            ></el-slider>
                        </div>
                        <div class="flex-start w-100">
                            <span class="pr-15">&nbsp;&nbsp;Logo圆角：</span>
                            <el-slider
                                v-model="value.head.locationAndLogo.logoBorderRadius"
                                class="w-100"
                                input-size="mini"
                                :min="0"
                                :max="30"
                                show-input
                            ></el-slider>
                        </div>
                    </template>
                </div>
                <div class="flex-start mb-15 text-nowrap">
                    <span class="pr-15">&emsp;&emsp;&emsp;消息：</span>
                    <el-switch v-model="value.head.showMessage"></el-switch>
                </div>

                <template v-if="value.head.type == 'searchAndBanner'">
                    <div class="flex-start mb-15 text-nowrap">
                        <span class="pr-15">&emsp;&emsp;轮播图：</span>
                        <el-switch v-model="value.head.data.searchAndBannerData.showBanner" class="mr-10" @change="switchShowBanner"></el-switch>
                        <el-popover
                            placement="top-start"
                            title="备注"
                            width="600"
                            trigger="hover"
                            content="建议开启，并且上传的轮播图建议宽度固定在750px，由于该轮播图是以盒子的底部定位的(图片以宽度为准且不变形，高度可以超出屏幕外)，所以上传的图片建议要超出盒子高度最少40px"
                        >
                            <i slot="reference" class="el-icon-question font-16 text-ccc main-hover v-text-bottom"></i>
                        </el-popover>
                    </div>
                    <template v-if="value.head.data.searchAndBannerData.showBanner">
                        <div class="font-14 text-center pb-10 mt-20 border-bottom">
                            轮播图设置
                            <el-popover
                                placement="top-start"
                                title="备注"
                                width="600"
                                trigger="hover"
                                content="轮播图宽度占屏幕的100%，高度自动变化，保持原图宽高比不变。轮播图可以超出所设定的盒子高度"
                            >
                                <i slot="reference" class="el-icon-question font-16 text-ccc main-hover v-text-bottom"></i>
                            </el-popover>
                            ：
                        </div>
                        <div class="flex-start text-nowrap mb-15">
                            <span class="pr-15">轮播图高度：</span>
                            <el-slider
                                v-model="value.head.data.searchAndBannerData.banner.height"
                                class="w-100"
                                input-size="mini"
                                :max="1920"
                                show-input
                            ></el-slider>
                        </div>
                        <div class="flex-start mb-15 text-nowrap">
                            <span class="pr-15">&emsp;自动播放：</span>
                            <el-switch v-model="value.head.data.searchAndBannerData.banner.autoplay"></el-switch>
                        </div>
                        <!-- 该功能能用的，只是作用不大，先关闭 -->
                        <div
                            class="flex-start mb-15 text-nowrap"
                            :class="[value.head.data.searchAndBannerData.banner.autoplay ? 'animation-15px-show' : 'animation-15px-close']"
                        >
                            <span class="pr-15">&emsp;播放时间：</span>
                            <el-radio v-model="value.head.data.searchAndBannerData.banner.interval" :label="2000">2秒</el-radio>
                            <el-radio v-model="value.head.data.searchAndBannerData.banner.interval" :label="5000">5秒</el-radio>
                            <el-radio v-model="value.head.data.searchAndBannerData.banner.interval" :label="8000">
                                8秒
                                <el-tooltip effect="dark" content="备注：将自动播放关闭再打开，才会刷新播放时间" placement="top-start">
                                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                                </el-tooltip>
                            </el-radio>
                        </div>
                        <div class="d-flex a-start text-nowrap">
                            <span class="pr-15">&emsp;&emsp;指示器：</span>
                            <div class="text-wrap">
                                <el-radio v-model="value.head.data.searchAndBannerData.banner.indicatorDots" class="mb-20" :label="'default'">
                                    默认
                                </el-radio>
                                <el-radio v-model="value.head.data.searchAndBannerData.banner.indicatorDots" class="mb-20" :label="'dot'">
                                    圆点
                                </el-radio>
                                <el-radio v-model="value.head.data.searchAndBannerData.banner.indicatorDots" class="mb-20" :label="'round'">
                                    柱状
                                </el-radio>
                                <el-radio v-model="value.head.data.searchAndBannerData.banner.indicatorDots" class="mb-20" :label="'nav'">
                                    导航
                                </el-radio>
                                <el-radio v-model="value.head.data.searchAndBannerData.banner.indicatorDots" class="mb-20" :label="'indexes'">
                                    数字
                                </el-radio>
                                <el-radio v-model="value.head.data.searchAndBannerData.banner.indicatorDots" class="mb-20" :label="'none'">
                                    关闭
                                </el-radio>
                            </div>
                        </div>
                        <div
                            class="overflow-h transition-all05"
                            :style="{
                                height:
                                    value.head.data.searchAndBannerData.banner.indicatorDots == 'none'
                                        ? '0px'
                                        : value.head.data.searchAndBannerData.banner.indicatorDots == 'nav'
                                        ? '40px'
                                        : '95px'
                            }"
                        >
                            <div class="flex-start text-nowrap">
                                <span class="pr-15">指示器颜色：</span>
                                <el-radio v-model="value.head.data.searchAndBannerData.banner.indicatorThemeColor" :label="true">主题色</el-radio>
                                <el-radio v-model="value.head.data.searchAndBannerData.banner.indicatorThemeColor" :label="false">
                                    <span class="mr-10">自定义</span>
                                    <el-color-picker
                                        v-model="value.head.data.searchAndBannerData.banner.indicatorColor"
                                        class="v-middle"
                                    ></el-color-picker>
                                </el-radio>
                                <el-tooltip effect="dark" content="注意：当轮播图只有一张图片时，前端将会自动隐藏指示器" placement="top-start">
                                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                                </el-tooltip>
                            </div>

                            <div class="flex-start mt-15 text-nowrap">
                                <span class="pr-15">指示器位置：</span>
                                <el-radio-group v-model="value.head.data.searchAndBannerData.banner.indicatorPosition" size="mini">
                                    <el-radio-button label="left">左</el-radio-button>
                                    <el-radio-button label="mid">中</el-radio-button>
                                    <el-radio-button label="right">左</el-radio-button>
                                </el-radio-group>
                            </div>
                        </div>
                    </template>
                </template>
            </div>

            <!-- 轮播图： -->
            <div v-if="value.head.type == 'searchAndBanner' && value.head.data.searchAndBannerData.showBanner">
                <div class="mb-20">轮播图（可拖动改变顺序）</div>
                <el-form ref="ruleForm" :model="value.head.data.searchAndBannerData.banner">
                    <vuedraggable
                        v-model="value.head.data.searchAndBannerData.banner.imgList"
                        :options="{ group: 'data1', animation: 150, chosenClass: 'shadow-lg', scroll: true, scrollSensitivity: 200 }"
                    >
                        <transition-group>
                            <div
                                v-for="(item, index) in value.head.data.searchAndBannerData.banner.imgList"
                                :key="index + 1"
                                class="border-dashed-ccc hover-border rounded-3 px-20 pt-20 d-flex flex-wrap mb-20 position-relative"
                            >
                                <div class="w-100">
                                    <div
                                        class="flex-start text-nowrap"
                                        :class="[value.head.data.searchAndBannerData.banner.indicatorDots == 'nav' ? 'mb-15' : '']"
                                    >
                                        <el-form-item
                                            class="flex-start"
                                            label="图片："
                                            :prop="'imgList.' + index + '.img'"
                                            :rules="{ required: true, message: '图片不能为空', trigger: ['blur', 'change'] }"
                                        >
                                            <imgCenter
                                                v-model="item.img"
                                                class="pr-15"
                                                :upload-style="{ width: '80px', height: '80px' }"
                                                @input="checkForm"
                                            ></imgCenter>
                                        </el-form-item>
                                        <el-popover
                                            placement="top-start"
                                            title="备注"
                                            width="600"
                                            trigger="hover"
                                            :content="`建议图片尺寸：宽=750px，高>=${
                                                value.head.data.searchAndBannerData.banner.height * 2 + 20 * 2
                                            }px`"
                                        >
                                            <i slot="reference" class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                                        </el-popover>
                                        <span class="pl-15" @click="showDialog(item)">链接：</span>
                                        <div class="flex-1 overflow-h">
                                            <dialogUrl
                                                ref="dialog"
                                                :key="index"
                                                v-model="value.head.data.searchAndBannerData.banner.imgList[index]"
                                                :parmas="value"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        v-if="value.head.data.searchAndBannerData.banner.indicatorDots == 'nav'"
                                        class="flex-start text-nowrap mb-15"
                                    >
                                        <span class="pr-15">导航文字：</span>
                                        <div class="pl-10 flex-1">
                                            <el-input
                                                v-model="item.content"
                                                placeholder="请输入内容"
                                                size="small "
                                                clearable
                                                maxlength="100"
                                            ></el-input>
                                        </div>
                                    </div>
                                </div>
                                <i
                                    class="d-none el-icon-error font-24 text-999 position-absolute cursor-pointer"
                                    style="top: -12px; right: -12px"
                                    @click.stop="del(index, 'imgList')"
                                ></i>
                            </div>
                        </transition-group>
                    </vuedraggable>
                </el-form>
                <el-button class="w-100 mb-20" type="primary" icon="el-icon-plus" size="small" plain @click.stop="add('imgList')">添加</el-button>
            </div>
            <!-- 搜索+标签栏 -->
            <div v-if="value.head.type == 'searchAndTab'" class="bg-f9 rounded-3 p-20 mb-20">
                <div class="font-14 text-center pb-10 border-bottom">标签栏设置：</div>
                <div class="bg-f9 rounded-3 pt-20 d-flex flex-wrap">
                    <div class="w-100">
                        <div class="flex-start w-100 mb-15 text-nowrap">
                            <span class="pr-15">&emsp;&emsp;启用菜单：</span>
                            <el-switch v-model="value.head.data.searchAndTabData.tabsShow" class="pr-10" @change="switchTabsShow"></el-switch>
                        </div>
                        <div v-if="value.head.data.searchAndTabData.tabsShow" class="overflow-h transition-all05">
                            <div class="flex-start text-nowrap mb-15">
                                <span class="pr-15">&emsp;&emsp;背景颜色：</span>
                                <el-radio v-model="value.head.data.searchAndTabData.tabBgThemeColor" :label="false">
                                    <span class="mr-10">自定义</span>
                                    <el-color-picker
                                        v-model="value.head.data.searchAndTabData.tabBgColor"
                                        class="v-middle"
                                        show-alpha
                                    ></el-color-picker>
                                    <el-tooltip
                                        class="ml-10"
                                        effect="dark"
                                        content="tips：如果该tab背景颜色不设置或[清空]颜色，则该背景颜色就用上面整个组件的[背景颜色]为背景颜色(建议该颜色取跟[搜索框背景]一样的颜色)"
                                        placement="top-start"
                                    >
                                        <i class="el-icon-question font-16 text-ccc main-hover v-middle"></i>
                                    </el-tooltip>
                                </el-radio>
                                <el-radio v-model="value.head.data.searchAndTabData.tabBgThemeColor" :label="true">主题色</el-radio>
                            </div>
                            <div class="flex-start mb-15 text-nowrap">
                                <span class="pr-15">&emsp;背景色渐变：</span>
                                <el-switch v-model="value.head.data.searchAndTabData.bgGradualChange" class="pr-10"></el-switch>
                                <el-tooltip
                                    effect="dark"
                                    content="备注：开启背景色渐变后，当手机屏幕滚动时，搜索栏的背景色由浅到深逐渐显示。如果开启了背景色渐变，建议标签栏背景色跟搜索框背景色保持一致"
                                    placement="top-start"
                                >
                                    <i class="el-icon-question font-16 text-ccc main-hover v-bottom"></i>
                                </el-tooltip>
                            </div>
                            <div class="flex-start text-nowrap mb-15">
                                <span class="pr-15">&emsp;&emsp;下标模式：</span>
                                <el-radio v-model="value.head.data.searchAndTabData.tabsType" :label="'pills'">胶囊模式</el-radio>
                                <el-radio v-model="value.head.data.searchAndTabData.tabsType" :label="'line'">下划线模式</el-radio>
                                <el-radio v-model="value.head.data.searchAndTabData.tabsType" :label="'none'">无</el-radio>
                            </div>
                            <div class="flex-start text-nowrap mb-15">
                                <span class="pr-15">&emsp;&emsp;选中颜色：</span>
                                <el-radio v-model="value.head.data.searchAndTabData.tabCurThemeColor" :label="false">
                                    <span class="mr-10">自定义</span>
                                    <el-color-picker v-model="value.head.data.searchAndTabData.tabCurColor" class="v-middle"></el-color-picker>
                                </el-radio>
                                <el-radio v-model="value.head.data.searchAndTabData.tabCurThemeColor" :label="true">主题色</el-radio>
                            </div>
                            <div class="flex-start text-nowrap mb-15">
                                <span class="pr-15">&emsp;未选中颜色：</span>
                                <el-color-picker v-model="value.head.data.searchAndTabData.tabNoCurColor" class="v-middle"></el-color-picker>
                            </div>
                            <div class="flex-start mb-15 text-nowrap">
                                <span class="pr-15">显示分类图标：</span>
                                <el-switch v-model="value.head.data.searchAndTabData.showCategoryIcon" class="pr-10"></el-switch>
                                <span class="pr-15">显示分类文字：</span>
                                <el-switch v-model="value.head.data.searchAndTabData.showCategoryText" class="pr-10"></el-switch>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="value.head.type == 'searchAndTab' && value.head.data.searchAndTabData.tabsShow">
                <!-- 标签栏： -->
                <el-form ref="ruleForm1" :model="value.head.data.searchAndTabData" label-width="80px">
                    <div class="mb-20">
                        <div class="d-inline-block">标签栏配置</div>
                        <el-tooltip
                            class="ml-10"
                            effect="dark"
                            content="tips：PC端选中的tab标签栏在用户端也会对应选中,默认第一个tab标签为首页,其他tab标签使用海报页"
                            placement="top-start"
                        >
                            <i class="el-icon-question font-16 text-ccc main-hover v-middle"></i>
                        </el-tooltip>
                    </div>
                    <el-tabs v-model="currentUUid" class="cusTabs" type="card" editable @edit="handleTabsEdit" @tab-click="tabClick">
                        <el-tab-pane
                            v-for="(item, index) in value.head.data.searchAndTabData.tabList"
                            :key="item.uuid"
                            class="p-10"
                            :label="item.title"
                            :name="item.uuid"
                        >
                            <div>
                                <div class="mb-20 w-100">
                                    <div class="flex-start text-nowrap mb-15">
                                        <!-- <span class="pr-15">&emsp;&emsp;标题：</span> -->
                                        <div class="flex-1">
                                            <el-form-item
                                                :prop="'tabList.' + index + '.title'"
                                                :rules="{ required: true, message: '标题不能为空', trigger: ['blur'] }"
                                                label="标题："
                                            >
                                                <el-input
                                                    v-model="item.title"
                                                    placeholder="请输入内容"
                                                    size="mini"
                                                    clearable
                                                    maxlength="10"
                                                    show-word-limit
                                                ></el-input>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <!-- <div class="flex-start text-nowrap mb-15">
										<span class="pr-15">标题颜色：</span>
										<el-radio v-model="item.themeColor" :label="false">
											<span class="mr-10">自定义</span>
											<el-color-picker v-model="item.color" class="v-middle"></el-color-picker>
										</el-radio>
										<el-radio v-model="item.themeColor" :label="true">主题色</el-radio>
									</div> -->
                                    <div v-if="item.type != 'homePage'" class="flex-start text-nowrap mb-15">
                                        <!-- <span class="pl-15">海报：</span> -->
                                        <el-form-item
                                            :prop="'tabList.' + index + '.url.id'"
                                            :rules="{ required: true, message: '海报不能为空', trigger: 'blur' }"
                                            label="海报："
                                        >
                                            <!-- , validator: (rule, value, callback)=>{checkKey(rule, value, callback, scope.$index)}, trigger: 'blur' -->
                                            <dialogUrl
                                                ref="dialog"
                                                :key="index"
                                                v-model="value.head.data.searchAndTabData.tabList[index]"
                                                :parmas="value"
                                                :tab="['海报页']"
                                                @input="changeData(index)"
                                            />
                                        </el-form-item>
                                    </div>
                                    <!-- 首页装修 -->
                                    <div v-if="item.type == 'homePage'" class="flex-start text-nowrap mb-15">
                                        <!-- <span class="pl-15">海报：</span> -->
                                        <el-form-item label="首页装修：">
                                            <!-- , validator: (rule, value, callback)=>{checkKey(rule, value, callback, scope.$index)}, trigger: 'blur' -->
                                            默认首页
                                            <el-tooltip effect="dark" content="备注:标签栏第一个tab默认为搜索+轮播图编辑的页面" placement="top-start">
                                                <i class="el-icon-question font-16 text-ccc main-hover"></i>
                                            </el-tooltip>
                                        </el-form-item>
                                    </div>
                                </div>
                            </div>
                            <div class="flex-center">
                                <el-button class="flex-1" type="primary" icon="el-icon-setting" size="small" plain @click.stop="setName(index)">
                                    修改菜单名字
                                </el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
                <!-- 链接弹框组件 -->
                <dialogName ref="dialogName" v-model="dialogNameTitle" field="标签页名称" @input="input" />
            </div>
        </div>
    </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
import dialogUrl from '../../components/dialogUrl/dialogUrl'
import dialogName from '../../components/dialogName'
import { defFloorVal } from './defFloorVal.js'
export default {
    components: { dialogUrl, vuedraggable, dialogName },
    filters: {},
    props: {
        value: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            themeColorCustom: false, //是否自定义商城主题色，默认false
            themeColorDefault: ['#e1251b', '#fd8cb0', '#FFD700', '#ff9000', '#bc9f5f', '#409EFF', '#29d7ce', '#11A983', '#5fc221', '#333333'], //预设的默认主题颜色
            floorHead: {
                title: '头部组件',
                botton: [
                    { name: '搜索+轮播图', flag: 'searchAndBanner' },
                    // { name: '搜索+标题栏', flag: 'searchAndTitle', disabled: true },
                    { name: '搜索+标签页', flag: 'searchAndTab' },
                    { name: '无', flag: 'none' }
                ]
            },
            currentUUid: '',
            dialogNameTitle: ''
        }
    },
    computed: {
        // 如果是后台选择了[搜索+轮播图]且开了轮播图开关且已经上传了轮播图
        showBanner() {
            let bool =
                this.value.head &&
                this.value.head.type == 'searchAndBanner' &&
                this.value.head.data.searchAndBannerData.showBanner &&
                this.value.head.data.searchAndBannerData.banner.imgList.length
            return bool ? true : false
        }
    },
    watch: {
        'value.head.data.searchAndTabData.tabList': {
            handler(newVal) {
                if (newVal.length) {
                    let currentItem = ''
                    currentItem = this.value.head.data.searchAndTabData.tabList.filter((item) => {
                        return item.isSelect
                    })
                    this.currentUUid = currentItem.length ? currentItem[0].uuid : this.value.head.data.searchAndTabData.tabList[0].uuid
                }
            },
            deep: true,
            immediate: true
        },
        currentUUid: {
            handler(newValue, oldValue) {
                if (newValue) {
                    for (var i = 0; i < this.value.head.data.searchAndTabData.tabList.length; i++) {
                        this.value.head.data.searchAndTabData.tabList[i].isSelect = false
                    }
                    let index = this.value.head.data.searchAndTabData.tabList.findIndex((item) => {
                        return item.uuid === newValue
                    }) //找出是要正在选中的那一个元素的index
                    this.value.head.data.searchAndTabData.tabList[index].isSelect = true
                }
            },
            deep: true,
            immediate: true
        },
        showBanner: {
            handler(newValue, oldValue) {
                if (newValue) {
                    this.value.head.bgGradualChange = true
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {},
    destroyed() {},
    methods: {
        checkForm() {
            let resultList = []
            if (
                (this.value.category == 'INDEX' || this.value.category == 'INDEX-T') &&
                ((this.value.head.type == 'searchAndBanner' && this.value.head.data.searchAndBannerData.showBanner) ||
                    this.value.head.type == 'searchAndTab')
            ) {
                this.$refs.ruleForm &&
                    this.$refs.ruleForm.validate((valid, valobj) => {
                        for (var key in valobj) {
                            let mes = valobj[key][0] //{field: "advertImg.0.img",message: "图片不能为空"}
                            if (mes.field.indexOf('imgList') != -1) {
                                mes['fieldName'] = '轮播图'
                            }
                            resultList.push(mes) //将错误信息输出到一个数组里,如果数组有length就是校验不通过，如果result的length为0则校验通过
                        }
                    })
                this.$refs.ruleForm1 &&
                    this.$refs.ruleForm1.validate((valid, valobj) => {
                        for (var key in valobj) {
                            let mes = valobj[key][0] //{"message": "标题不能为空","field": "tabList.1.title"}
                            if (mes.field.indexOf('tabList') != -1) {
                                mes['fieldName'] = '标签栏配置'
                            }
                            resultList.push(mes) //将错误信息输出到一个数组里,如果数组有length就是校验不通过，如果result的length为0则校验通过
                        }
                    })
            }
            return resultList
        },
        changeThemeColor(color) {
            this.value.themeColor = color
        },
        del(index, flag) {
            this.value.head.data.searchAndBannerData.banner[flag].splice(index, 1)
        },
        add(flag) {
            let addData = {
                img: '', //图片
                url: {}, //把对应的type的选中的元素对象赋值到该对象中
                content: '' //当indicatorDots==nav时，可以输入文本内容
            }
            this.value.head.data.searchAndBannerData.banner[flag].push(addData)
            this.$emit('add', flag)
        },
        switchShowBanner(e) {
            // 如果关闭头部轮播图,则关闭颜色渐变，如果开启头部轮播图,则开启颜色渐变
            this.value.head.bgGradualChange = e
            // 如果开启了头部轮播图并且没有一张轮播图
            if (
                e &&
                this.value.head.data.searchAndBannerData.banner &&
                this.value.head.data.searchAndBannerData.banner.imgList &&
                !this.value.head.data.searchAndBannerData.banner.imgList.length
            ) {
                this.add('imgList')
            }
        },
        switchTabsShow(e) {
            if (!e) {
                for (var i = 0; i < this.value.head.data.searchAndTabData.tabList.length; i++) {
                    this.value.head.data.searchAndTabData.tabList[i].isSelect = false
                }
                this.value.head.data.searchAndTabData.tabList[0].isSelect = true
            }
        },
        change(e) {
            if (e != 'none') {
                // if(e == 'searchAndTab') this.value.head.bgGradualChange = false
                this.$emit('change', e)
            }
        },
        handleTabsEdit(targetName, action) {
            if (action === 'add') {
                this.dialogNameTitle = ''
                this.$nextTick(() => {
                    this.$refs.dialogName.showDialog()
                })
            }
            if (action === 'remove') {
                let index = this.value.head.data.searchAndTabData.tabList.findIndex((item) => {
                    return item.uuid === targetName
                }) //找出是要删除那一个元素的index
                this.value.head.data.searchAndTabData.tabList = this.value.head.data.searchAndTabData.tabList.filter((item) => {
                    return item.uuid !== targetName
                }) //删除元素
                if (this.value.head.data.searchAndTabData.tabList.length > 0 && this.currentUUid == targetName) {
                    //只有点击当前选中的tab选项并且当前数组大于1时才执行以下方法
                    this.currentUUid = this.value.head.data.searchAndTabData.tabList[index > 0 ? index - 1 : 0].uuid //删除元素后，默认选中删除的前一个元素
                }
            }
        },
        setName(index) {
            this.dialogNameTitle = this.value.head.data.searchAndTabData.tabList[index].title
            this.$refs.dialogName.showDialog(this.value.head.data.searchAndTabData.tabList[index].uuid)
        },
        input(e, flag) {
            if (e) {
                if (flag) {
                    //如果是修改
                    let index = this.value.head.data.searchAndTabData.tabList.findIndex((item) => {
                        return item.uuid === flag
                    }) //找出是要修改名字的那一个元素的index
                    this.value.head.data.searchAndTabData.tabList[index].title = this.dialogNameTitle
                } else {
                    //如果是新增
                    let index = 0
                    if (this.currentUUid) {
                        index = this.value.head.data.searchAndTabData.tabList.findIndex((item) => {
                            return item.uuid === this.currentUUid
                        }) //找出当前被选中的元素的index
                    }
                    let addData = this.$utils.object.deepClone(defFloorVal.searchAndTab.data.tabList[0])
                    addData.title = e
                    this.currentUUid = addData.uuid = this.$utils.createUUID()
                    this.value.head.data.searchAndTabData.tabList.splice(index + 1, 0, addData)
                }
            }
        },
        tabClick(e) {},
        changeData(index) {
            if (this.value.head.data.searchAndTabData.tabList[index].url?.id) {
                this.$refs.ruleForm1.clearValidate('tabList.' + index + '.url.id')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .mall-set-theme .el-radio__input.is-checked .el-radio__inner {
    border-color: var(--settingBackground);
    background: var(--settingBackground);
}
::v-deep .mall-set-theme .el-radio__input.is-checked + .el-radio__label {
    color: var(--settingBackground);
}
.floor-head {
    ::v-deep .el-radio {
        margin-right: 0;
        margin-left: 5px !important;
        padding-right: 10px;
    }
}
.cusTabs {
    ::v-deep .el-tabs__item:nth-child(1) {
        span {
            display: none;
        }
    }
}
</style>
