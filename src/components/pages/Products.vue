<template>
  <div>
    <div class="text-right mt-4">
      <button class="btn btn-primary">建立新的產品</button>
    </div>
    <table class="table mt-4 table-striped">
      <thead>
        <th width="20%">分類</th>
        <th width="40%">產品名稱</th>
        <th width="10%">原價</th>
        <th width="10%">售價</th>
        <th width="10%">是否啟用</th>
        <th width="10%">功能</th>
      </thead>
      <tbody>
        <tr v-for="(item) in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">
            {{ item.origin_price }}
          </td>
          <td class="text-right">
            {{ item.price }}
          </td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-danger">停用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm">編輯</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      products: []
    }
  },
  methods: {
    getProducts () {
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/products`
      const vm = this
      this.$http.get(api).then(response => {
        if (response.data.success) {
          vm.products = response.data.products
        } else {
          // todo: 等待加入錯誤判斷
        }
      })
    }
  },
  created () {
    const sessionToken = document.cookie.replace(/(?:(?:^|.*;\s*)sessionToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    this.$http.defaults.headers.common.Authorization = sessionToken

    this.getProducts()
  }
}
</script>
