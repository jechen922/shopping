<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <table class="table mt-4 table-striped">
      <thead>
        <th width="20%">使用者</th>
        <th width="20%">產品</th>
        <th width="10%">備註</th>
        <th width="10%">應付金額</th>
        <th width="20%">是否付款</th>
      </thead>
      <tbody>
        <tr v-for="(item) in orders" :key="item.id">
          <td>{{ item.user.email }}</td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td>{{ item.message }}</td>
          <td>{{ item.total | currency }}</td>
          <td class="text-center">
            <span v-if="item.is_paid" class="text-success">已付款</span>
            <span v-else class="text-danger">未付款</span>
          </td>
        </tr>
      </tbody>
    </table>
    <pagination :page="pagination" v-on:emitGetOrders="getOrders"></pagination>
  </div>
</template>

<script>
import pagination from './Pagination'

export default {
  data: function () {
    return {
      orders: [],
      pagination: {},
      isLoading: false
    }
  },
  components: {
    pagination
  },
  methods: {
    getOrders (page = 1) {
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/orders?page=${page}`
      const vm = this
      vm.isLoading = true
      this.$http.get(api).then(response => {
        vm.isLoading = false
        if (response.data.success) {
          vm.orders = response.data.orders
          vm.pagination = response.data.pagination
        } else {
          this.$bus.$emit('message:push', `取得訂單列表失敗: ${response.data.message}`, 'danger')
        }
      })
    }
  },
  created () {
    const sessionToken = document.cookie.replace(/(?:(?:^|.*;\s*)sessionToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    this.$http.defaults.headers.common.Authorization = sessionToken

    this.getOrders()
  }
}
</script>
