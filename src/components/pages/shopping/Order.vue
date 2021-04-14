<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="my-5 row-cols-2 row justify-content-center">
      <div class="d-flex justify-content-start">
        <a class="px-1" :href="'/products'">首頁</a>
        <h5 class="px-1"> / </h5>
        <a>購物車</a>
      </div>
    </div>
    <!-- 購物車 -->
    <div v-if="cart.hasOwnProperty('carts') && cart.carts.length > 0">
      <div class="my-5 row-cols-2 row justify-content-center">
        <table class="table">
          <thead>
            <th></th>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
          <tbody>
            <tr v-for="item in cart.carts" :key="item.id">
              <td class="align-middle">
                <button type="button" class="btn btn-outline-danger btn-sm"
                  @click="removeCartItem(item.id)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
              <td class="align-middle">
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">
                  已套用優惠券
                </div>
              </td>
              <td class="align-middle">{{ item.qty }} / {{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.final_total | currency }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">總計</td>
              <td class="text-right">{{ cart.total | currency }}</td>
            </tr>
            <tr v-if="cart.total != cart.final_total">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ cart.final_total }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="my-5 row-cols-2 row justify-content-center">
        <div class="input-group mb-3 input-group-sm">
          <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="couponCode">
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" :disabled="couponCode==''" @click="useCoupon">
              套用優惠碼
            </button>
          </div>
        </div>
      </div>
      <div class="my-5 row justify-content-center">
        <validation-observer class="col-md-6" v-slot="{ invalid }">
          <form @submit.prevent="createOrder">
            <validation-provider rules="required|email" v-slot="{ errors, classes }">
              <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" name="email" v-model="form.user.email"
                  placeholder="請輸入 Email"
                  class="form-control" :class="classes">
                <span class="invalid-feedback">{{ errors[0] }}</span>
              </div>
            </validation-provider>

            <validation-provider rules="required|name" v-slot="{ errors, classes }">
              <div class="form-group">
                <label for="username">收件人姓名</label>
                <input id="username" type="text" name="姓名" v-model="form.user.name"
                  placeholder="請輸入收件人姓名"
                  class="form-control" :class="classes">
                <span class="invalid-feedback">{{ errors[0] }}</span>
              </div>
            </validation-provider>

            <validation-provider rules="required|digits:10" v-slot="{ errors, classes }">
              <div class="form-group">
                <label for="usertel">收件人電話</label>
                <input id="usertel" type="text" name="電話" v-model="form.user.tel"
                  placeholder="請輸入電話"
                  class="form-control" :class="classes">
                <span class="invalid-feedback">{{ errors[0] }}</span>
              </div>
            </validation-provider>

            <validation-provider rules="required|address" v-slot="{ errors, classes }">
              <div class="form-group">
                <label for="useraddress">收件人地址</label>
                <input id="useraddress" type="text" name="地址" v-model="form.user.address"
                  placeholder="請輸入地址"
                  class="form-control" :class="classes">
                <span class="invalid-feedback">{{ errors[0] }}</span>
              </div>
            </validation-provider>

            <div class="form-group">
              <label for="message">留言</label>
              <textarea id="message" class="form-control" cols="30" rows="10"
              v-model="form.message"></textarea>
            </div>

            <div class="text-right">
              <a :href="'/products/'" class="btn btn-primary">
                  繼續選購</a>
              <button class="btn btn-danger" :disabled="invalid">送出訂單</button>
            </div>
          </form>
        </validation-observer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      products: [],
      pagination: {},
      product: {},
      cart: {},
      couponCode: '',
      isLoading: false,
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    }
  },
  methods: {
    getCart () {
      const vm = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`
      vm.isLoading = true
      this.$http.get(api).then(response => {
        if (response.data.success) {
          vm.cart = response.data.data
        } else {
          this.$bus.$emit('message:push', `取得購物車資訊失敗: ${response.data.message}`, 'danger')
        }
        vm.isLoading = false
      })
    },
    useCoupon () {
      const vm = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/coupon`
      const coupon = {
        code: vm.couponCode
      }
      vm.isLoading = true
      this.$http.post(api, { data: coupon }).then(response => {
        if (response.data.success) {
          vm.getCart()
        } else {
          this.$bus.$emit('message:push', `套用優惠券失敗: ${response.data.message}`, 'danger')
        }
        vm.isLoading = false
      })
    },
    createOrder () {
      const vm = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/order`
      const order = vm.form

      vm.isLoading = true
      this.$http.post(api, { data: order }).then(response => {
        if (response.data.success) {
          this.$bus.$emit('cart:reload')
          vm.$router.push(`/orders/${response.data.orderId}`)
        } else {
          this.$bus.$emit('message:push', `建立訂單失敗: ${response.data.message}`, 'danger')
        }
        vm.isLoading = false
      })
    }
  },
  created () {
    const sessionToken = document.cookie.replace(/(?:(?:^|.*;\s*)sessionToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    this.$http.defaults.headers.common.Authorization = sessionToken

    this.getCart()
  }
}
</script>
