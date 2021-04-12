<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <div class="text-right mt-4">
      <button type="button" class="btn btn-primary" @click="openCouponModal(true)">建立新的優惠券</button>
    </div>
    <table class="table mt-4 table-striped">
      <thead>
        <th width="20%">標題</th>
        <th width="20%">代碼</th>
        <th width="10%">折扣</th>
        <th width="10%">是否啟用</th>
        <th width="20%">有效時間</th>
        <th width="20%">功能</th>
      </thead>
      <tbody>
        <tr v-for="(item) in coupons" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.code }}</td>
          <td>{{ item.percent }} %</td>
          <td class="text-center">
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-danger">停用</span>
          </td>
          <td>{{ item.due_date | datetime}}</td>
          <td>
            <button class="btn btn-outline-primary btn-sm"  @click="openCouponModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm"  @click="openDelCouponModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <pagination emitMethod='emitGetCoupons' :page="pagination" v-on:emitGetCoupons="getCoupons"></pagination>

    <!-- couponModal -->
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="code">標題</label>
                  <input type="text" class="form-control" id="title"
                    v-model="tempCoupon.title"
                    placeholder="請輸入標題">
                </div>
                <div class="form-group">
                  <label for="code">代碼</label>
                  <input type="text" class="form-control" id="code"
                    v-model="tempCoupon.code"
                    placeholder="請輸入代碼">
                </div>
                <div class="form-group">
                  <label for="discount">折扣</label>
                  <input type="text" class="form-control" id="discount"
                    v-model="tempCoupon.percent"
                    placeholder="請輸入折扣">
                </div>
                <div class="form-group">
                  <label>有效時間</label>
                  <datetime type="datetime"
                    v-model="tempDatetime"
                    :seconds-picker=true
                    placeholder="請輸入有效時間"
                    format="yyyy-MM-dd HH:mm"></datetime>
                </div>
                <div class="form-group">
                  <div class="custom-control custom-switch">
                    <input class="custom-control-input" type="checkbox"
                      v-model="tempCoupon.is_enabled"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled">
                    <label class="custom-control-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveCoupon">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- delCouponModal -->
    <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import pagination from './Pagination'

export default {
  data: function () {
    return {
      coupons: [],
      pagination: {},
      tempCoupon: {},
      tempDatetime: '',
      isCreated: false,
      isLoading: false
    }
  },
  components: {
    pagination
  },
  methods: {
    getCoupons (page = 1) {
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupons?page=${page}`
      const vm = this
      vm.isLoading = true
      this.$http.get(api).then(response => {
        vm.isLoading = false
        if (response.data.success) {
          vm.coupons = response.data.coupons
          vm.pagination = response.data.pagination
        } else {
          this.$bus.$emit('message:push', `取得優惠券列表失敗: ${response.data.message}`, 'danger')
        }
      })
    },
    openCouponModal (isCreated, item) {
      if (isCreated) {
        this.tempCoupon = {
          is_enabled: 1
        }
        this.tempDatetime = ''
        this.isCreated = true
      } else {
        this.tempCoupon = Object.assign({}, item)
        this.isCreated = false

        const t = Number(item.due_date) * 1000
        const date = new Date(t)
        this.tempDatetime = date.toISOString()
      }
      $('#couponModal').modal('show')
    },
    saveCoupon () {
      const vm = this
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon`
      let requestMethod = 'post'
      if (!vm.isCreated) {
        api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon/${vm.tempCoupon.id}`
        requestMethod = 'put'
      }

      const timestamp = Date.parse(vm.tempDatetime)
      vm.tempCoupon.due_date = (timestamp / 1000).toString()

      this.$http[requestMethod](api, { data: vm.tempCoupon }).then(response => {
        if (response.data.success) {
          vm.tempCoupon = {}
          vm.getCoupons()
          $('#couponModal').modal('hide')
        } else {
          if (vm.isCreated) {
            this.$bus.$emit('message:push', `新增優惠券失敗: ${response.data.message}`, 'danger')
          } else {
            this.$bus.$emit('message:push', `編輯優惠券失敗: ${response.data.message}`, 'danger')
          }
        }
      })
    },
    openDelCouponModal (item) {
      this.tempCoupon = Object.assign({}, item)
      $('#delCouponModal').modal('show')
    },
    deleteCoupon () {
      const vm = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon/${vm.tempCoupon.id}`
      this.$http.delete(api).then(response => {
        if (response.data.success) {
          vm.tempCoupon = {}
          vm.getCoupons()
        } else {
          this.$bus.$emit('message:push', `刪除優惠券失敗: ${response.data.message}`, 'danger')
        }
      })
      $('#delCouponModal').modal('hide')
    }
  },
  created () {
    const sessionToken = document.cookie.replace(/(?:(?:^|.*;\s*)sessionToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    this.$http.defaults.headers.common.Authorization = sessionToken

    this.getCoupons()
  }
}
</script>
