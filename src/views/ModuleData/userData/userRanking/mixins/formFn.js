import doPost from '@/utils/request.js'
import { request } from '@/utils/request.js'
import service from '@/utils/request.js'
import { object } from '@/utils/utils.js'

/** @param {Object} o为表单默认要显示的默认值，如果无，就不填写，可选 */
export function createFn(obj) {
    // console.log(this.dialogForm.formData)
    //    this.$refs.myForm && this.$refs.myForm.resetFields()
    // this.dialogForm.formData = {}
    if (obj && obj.type != 'click') {
        this.dialogForm.formData = Object.assign({}, object.deepClone(obj))
    }
    this.dialogForm.isEdit = false
    this.dialogForm.title = '新增'
    this.$nextTick(() => {
        this.dialogForm.isVisible = true
    })
}

export function editFn(row = {}) {
    this.dialogForm.isEdit = true
    this.dialogForm.title = '编辑'
    // this.dialogForm.formData = {}
    this.dialogForm.isVisible = true

    this.$nextTick(() => {
        this.dialogForm.formData = Object.assign({}, object.deepClone(row))
    })
}

export function delFn(row, url) {
    this.$confirm('确认删除该数据吗?', '提示', {
        type: 'warning'
    })
        .then(() => {
            service
                .request({
                    url: url + '/' + row.id,
                    method: 'delete'
                })
                .then((res) => {
                    if (res.code) {
                        this.$message.success('删除成功')
                        this.getData()
                    } else {
                        this.$message.warning(res.msg)
                    }
                })
                .catch((e) => {
                    catchUrl(e, url)
                })
        })
        .catch(() => {
            this.$message.info('取消删除')
        })
}

export function submitFn(formName, url, isEdit) {
    const title = isEdit ? '编辑' : '添加'
    this.$refs[formName].validate((valid) => {
        if (valid) {
            request[isEdit ? 'put' : 'post'](url, this.dialogForm.formData)
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.success(`${title}成功`)
                        this.getData()
                        this.dialogForm.isVisible = false
                    }
                })
                .catch((e) => {
                    catchUrl(e, url, `${title}`)
                })
        } else {
            console.error('Error submit ----- Form invalid !')
            return false
        }
    })
}

export function getDataFn(url, params = {}) {
    this.tableListLoading = true
    request
        .get(url, params, {
            isShowLoading: this.isShowLoading
        })
        .then((res) => {
            this.tableListLoading = false
            this.tableTotal = res?.data?.total || 0
            this.tableList = res?.data?.resultList || []
        })
        .catch((e) => {
            catchUrl(e, url)
            this.tableListLoading = false
        })
        .finally((res) => {
            this.tableListLoading = false
        })
}

export function getExcel(url, params = {}) {
    request.getFile(url, params)
}

export function getChart(url, params = {}) {
    request.get(url, params).then((res) => {
        let userId = []
        let totalAmount = []
        let totalQuantity = []
        let payAmount = []
        let payQuantity = []
        let dealAmount = []
        let dealQuantity = []
        let cumulationTotalAmount = []
        let cumulationTotalQuantity = []
        let cumulationPayAmount = []
        let cumulationPayQuantity = []
        let List = []
        res.data.map((item) => {
            // console.log(item)
            userId.push(item.userId)
            totalAmount.push(item.totalAmount)
            totalQuantity.push(item.totalQuantity)
            payAmount.push(item.payAmount)
            payQuantity.push(item.payQuantity)
            dealAmount.push(item.dealAmount)
            dealQuantity.push(item.dealQuantity)
            cumulationTotalAmount.push(item.cumulationTotalAmount)
            cumulationTotalQuantity.push(item.cumulationTotalQuantity)
            cumulationPayAmount.push(item.cumulationPayAmount)
            cumulationPayQuantity.push(item.cumulationPayQuantity)
        })
        this.allList = {
            totalAmount: totalAmount,
            totalQuantity: totalQuantity,
            payAmount: payAmount,
            payQuantity: payQuantity,
            dealAmount: dealAmount,
            dealQuantity: dealQuantity,
            cumulationTotalAmount: cumulationTotalAmount,
            cumulationTotalQuantity: cumulationTotalQuantity,
            cumulationPayAmount: cumulationPayAmount,
            cumulationPayQuantity: cumulationPayQuantity,
            userId: userId
        }
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
