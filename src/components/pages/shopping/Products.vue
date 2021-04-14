<template>
  <!-- Page Content -->
  <div class="container">
    <div class="row">
      <div class="col-lg-3">
        <div class="" v-for="category in categories" :key="category">
          <a href="#" class="list-group-item" :class="{active:filterCategory === category}"
            @click.prevent="chooseCategory(category)">
            <i class="far fa-hand-point-right"></i> {{category}}
          </a>
        </div>
      </div>
      <div class="col-lg-9">
        <div class="row">
          <div class="col-lg-4 col-md-6 mb-4" v-for="item in filterProducts" :key=item.id>
            <div class="card h-100">
              <div style="height: 150px; background-size: cover; background-position: center"
                :style="{backgroundImage: `url(${item.imageUrl})`}">
              </div>
              <div class="card-body">
                <h4 class="card-title">{{item.title}}</h4>
                <p class="card-text text-right">{{item.description}}</p>
              </div>
              <div class="card-footer d-flex">
                <a :href="'/products/' + item.id" class="btn btn-primary btn-user btn-block"
                  @click.prevent="goToProduct(item.id)" v-if="item.is_enabled">
                  搶購去 <i class="fal fa-shopping-bag"></i>
                  </a>
                <a href="" class="btn btn-primary btn-user btn-block disabled" v-else>
                  即將到貨 <i class="far fa-truck-moving"></i>
                  </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      products: [],
      categories: ['全部'],
      filterCategory: '全部',
      isLoading: false
    }
  },
  methods: {
    getProducts () {
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products/all`
      const vm = this
      vm.isLoading = true
      this.$http.get(api).then(response => {
        if (response.data.success) {
          vm.products = response.data.products
          vm.products.forEach(function (item) {
            if (!vm.categories.includes(item.category)) {
              vm.categories.push(item.category)
            }
          })
        } else {
          this.$bus.$emit('message:push', `取得產品失敗: ${response.data.message}`, 'danger')
        }
        vm.isLoading = false
      })
    },
    chooseCategory (category) {
      this.filterCategory = category
    },
    goToProduct (id) {
      this.$router.push(`/products/${id}`)
    }
  },
  computed: {
    filterProducts: function () {
      const vm = this
      if (vm.filterCategory === '' || vm.filterCategory === '全部') {
        return vm.products
      }
      return vm.products.filter(function (item) {
        return item.category === vm.filterCategory
      })
    },
    filterProductsWithDiscount: function () {
      const vm = this
      const products = vm.filterProducts
      const a = products.filter(function (product) {
        return product.price !== ''
      })
      console.log('products', products)
      console.log('a', a)
      return a
    }
  },
  created () {
    this.getProducts()
  }
}
</script>
