<template>
  <div>
    <nav class="menu navbar navbar-expand navbar-light bg-white topbar static-top shadow">
      <div class="container">
        <a class="sidebar-brand d-flex align-items-center justify-content-center"
          href="/products"  style="font-size:1.3rem">
          <div class="sidebar-brand-icon rotate-n-15">
              <i class="fal fa-ghost"></i>
          </div>
          <div class="sidebar-brand-text mx-3">陰森購物網</div>
        </a>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown no-arrow mx-1">
              <a class="nav-link dropdown-toggle" href="#" id="cartDropdown" role="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-shopping-cart" style="font-size:1.3rem"></i>
                <span class="badge badge-danger badge-counter" style="font-size:1rem"
                  v-if="cart.hasOwnProperty('carts') && cart.carts.length">
                  {{cart.hasOwnProperty('carts') && cart.carts.length}}
                </span>
              </a>
              <!-- Dropdown - Messages -->
              <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                  aria-labelledby="cartDropdown"
                  v-if="cart.hasOwnProperty('carts') && cart.carts.length">
                <h1 class="dropdown-header" style="font-size:1rem">
                    購物車
                </h1>
                <table class="table mb-0 border border-light">
                  <tr v-for="item in cart.carts" :key="item.id">
                    <td class="text-center">
                      <button type="button" class="btn btn-outline-danger btn-sm"
                        @click="removeCartItem(item)">
                        <i class="far fa-trash-alt"></i>
                      </button>
                    </td>
                    <td class="text-center">{{item.product.title}}</td>
                    <td class="text-right">{{item.qty}} / {{item.product.unit}}</td>
                    <td class="text-right">{{item.product.price * item.qty | currency}}</td>
                  </tr>
                </table>
                <div class="modal-footer">
                  <a :href="'/orders'" class="btn btn-primary">
                    <i class="fas fa-cart-arrow-down"></i> 結帳去
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'Navbar',
  data () {
    return {
      isShowCart: false,
      cart: {}
    }
  },
  methods: {
    toggleShowShopingCart () {
      const vm = this
      if (!vm.isShowCart) {
        vm.isShowCart = true
        $('#shoppingCartModal').modal('show')
      } else {
        vm.isShowCart = false
        $('#shoppingCartModal').modal('hide')
      }
    },
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
    removeCartItem (item) {
      const vm = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart/${item.id}`
      vm.isLoading = true
      this.$http.delete(api).then(response => {
        if (response.data.success) {
          vm.getCart()
          this.$bus.$emit('message:push', `${item.product.title} 已從購物車移除`, 'success')
        } else {
          this.$bus.$emit('message:push', `移除購物車產品失敗: ${response.data.message}`, 'danger')
        }
        vm.isLoading = false
      })
    }
  },
  created () {
    const vm = this
    vm.getCart()
    vm.$bus.$on('cart:reload', () => {
      vm.getCart()
    })
  }
}
</script>
