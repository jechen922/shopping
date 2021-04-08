<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="d-flex flex-column container">
      <div class="d-flex bd-highlight">
          <div class="location-header">
            <a :href="'/products'">首頁</a>
            <h5 class="px-1"> / </h5>
            <a>{{product.title}}</a>
          </div>
      </div>

      <div class="d-flex bd-highlight">
        <div class="flex-fill bd-highlight text-center" style="width:35%;">
          <div class="modal-header">
            <h5 class="modal-title">{{ product.title }}</h5>
          </div>
          <div class="modal-body">
            <blockquote class="blockquote mt-3">
              <h5 class="mb-3">產品說明</h5>
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4 text-danger" v-if="product.price">現在只要{{ product.price }}元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">
                  選購 {{num}} {{product.unit}}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
            小計 <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary"
              @click="addToCart(product, product.num)">
            加到購物車
            </button>
          </div>
        </div>
        <div class="d-flex justify-content-center p-2 flex-fill bd-highlight" style="width:50%;">
          <div class="img-fluid px-3 px-sm-4 mt-3 mb-4">
            <img :src="product.imageUrl" class="img-fluid" alt="">
          </div>
        </div>
      </div>
      </div>
    </div>
  <!-- </div> -->
</template>

<script>
export default {
  data: function () {
    return {
      product: {},
      isLoading: false
    }
  },
  methods: {
    getProduct () {
      const vm = this
      const productId = vm.$route.params.productId
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/product/${productId}`
      vm.isLoading = true
      this.$http.get(api).then(response => {
        if (response.data.success) {
          response.data.product.num = 1
          vm.product = response.data.product
        } else {
          this.$bus.$emit('message:push', `取得商品資訊失敗: ${response.data.message}`, 'danger')
        }
        vm.isLoading = false
      })
    },
    addToCart (product, qty = 1) {
      const vm = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`
      vm.isLoading = true
      const cart = {
        product_id: product.id,
        qty: qty
      }
      this.$http.post(api, { data: cart }).then(response => {
        if (response.data.success) {
          vm.$router.push({ name: 'ShoppingProducts' })
          this.$bus.$emit('cart:reload')
          this.$bus.$emit('message:push', `${product.title} 已加入購物車`, 'success')
        } else {
          this.$bus.$emit('message:push', `加入購物車失敗: ${response.data.message}`, 'danger')
        }
        vm.isLoading = false
      })
    }
  },
  created () {
    this.getProduct()
  }
}
</script>
