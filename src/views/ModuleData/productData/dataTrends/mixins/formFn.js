import doPost from '@/utils/request.js'
import { request } from '@/utils/request.js'
import service from '@/utils/request.js'

const toStringValue = (obj) => {
    if (obj instanceof Array) {
        var arr = []
        for (var i = 0; i < obj.length; i++) {
            arr[i] = toStringValue(obj[i])
        }
        return arr
    } else if (typeof obj === 'object') {
        for (var p in obj) {
            obj[p] = toStringValue(obj[p])
        }
    } else if (typeof obj === 'number') {
        obj = obj + ''
    }
    return obj
}
// toStringValue():给对象/对象数组的属性值为数值型的转为字符串型



export function getDataFn(url, params = {}) {
    this.tableListLoading = true
    request
        .get(url, params,{isShowLoading:this.isShowLoading})
        .then((res) => {
            this.tableListLoading = false
            // this.tableTotal = res.data.count
            this.tableTotal = res.data.total
            this.tableList = res.data
        })
        .catch((e) => {
            // code=0,成功返回；反之，失败提示
            if (e.code && e.code !== 0) {
                // this.$message.error(e.message)
            }
            catchUrl(e, url)
            this.tableListLoading = false
        })
}

export function getLineFn(url, params = {}) {
    this.tableListLoading = true
    request
        .get(url, params,{isShowLoading:this.isShowLoading})
        .then((res) => {
            this.lineChartData.totalDealAmount = []
            this.lineChartData.dealAmount = []
			this.lineChartData.dealGoodNum = []
			this.lineChartData.totalDealGoodNum = []
            this.lineChartData.date = []
            this.tableListLoading = false
            // this.tableTotal = res.data.count
            this.tableTotal = res.data.total
            res.data.map(item=>{
                this.lineChartData.totalDealAmount.push(item.totalDealAmount)
                this.lineChartData.dealAmount.push(item.dealAmount)
				this.lineChartData.dealGoodNum.push(item.dealGoodNum)
				this.lineChartData.totalDealGoodNum.push(item.totalDealGoodNum)
                this.lineChartData.date.push(item.time)
            })
            console.log(this.lineChartData.date,'this.lineChartData.date');
            console.log(res);
        })
        .catch((e) => {
            // code=0,成功返回；反之，失败提示
            if (e.code && e.code !== 0) {
                // this.$message.error(e.message)
            }
            catchUrl(e, url)
            this.tableListLoading = false
        })
}

export function getDataFn2(fn, param = {}) {
    this.tableListLoading = true
    fn(param)
        .then((res) => {
            this.tableListLoading = false
            this.tableTotal = res.count
            this.tableList = res.list
        })
        .catch((e) => {
            catchFn(e, fn)
            this.tableListLoading = false
        })
}




function catchUrl(e, url, detail) {
    console.group(`Error found in doPost(${url})`)
    if (detail) console.info(`--${detail}--报错！`)
    console.error(e)
    console.groupEnd()
}

function catchFn(e, fn) {
    console.group(`Error found in method (${fn.name})`)
    console.error(e)
    console.groupEnd()
}
