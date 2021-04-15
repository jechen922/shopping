<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <div class="text-right mt-4">
      <button type="button" class="btn btn-primary" @click="openProductModal(true)">建立新的產品</button>
    </div>
    <table class="table mt-4 table-striped">
      <thead>
        <th width="20%">分類</th>
        <th width="35%">產品名稱</th>
        <th width="10%">原價</th>
        <th width="10%">售價</th>
        <th width="10%">是否啟用</th>
        <th width="15%">功能</th>
      </thead>
      <tbody>
        <tr v-for="(item) in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">
            {{ item.origin_price | currency }}
          </td>
          <td class="text-right">
            {{ item.price | currency }}
          </td>
          <td class="text-center">
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-danger">停用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm"  @click="openProductModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm"  @click="openDelProductModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <pagination emitMethod='emitGetProducts' :page="pagination" v-on:emitGetProducts="getProducts"></pagination>
    <!-- productModal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image"
                    v-model="tempProduct.imageUrl"
                    placeholder="請輸入圖片連結">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control"
                    ref="files" @change="uploadFile">
                </div>
                <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                  class="img-fluid" :src="tempProduct.imageUrl" alt="">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title"
                    v-model="tempProduct.title"
                    placeholder="請輸入標題">
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category"
                      v-model="tempProduct.category"
                      placeholder="請輸入分類">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit"
                      v-model="tempProduct.unit"
                      placeholder="請輸入單位">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price"
                      v-model="tempProduct.origin_price"
                      placeholder="請輸入原價">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price"
                      v-model="tempProduct.price"
                      placeholder="請輸入售價">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description"
                    v-model="tempProduct.description"
                    placeholder="請輸入產品描述"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content"
                    v-model="tempProduct.content"
                    placeholder="請輸入產品說明內容"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox"
                      v-model="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- delProductModal -->
    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
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
            是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteProduct">確認刪除</button>
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
      products: [],
      pagination: {},
      tempProduct: {},
      isCreated: false,
      isLoading: false,
      status: {
        fileUploading: false
      }
    }
  },
  components: {
    pagination
  },
  methods: {
    getProducts (page = 1) {
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/products?page=${page}`
      const vm = this
      vm.isLoading = true
      this.$http.get(api).then(response => {
        vm.isLoading = false
        if (response.data.success) {
          vm.products = response.data.products
          vm.pagination = response.data.pagination
        } else {
          this.$bus.$emit('message:push', `取得產品列表失敗: ${response.data.message}`, 'danger')
        }
      })
    },
    openDelProductModal (item) {
      this.tempProduct = Object.assign({}, item)
      $('#delProductModal').modal('show')
    },
    deleteProduct () {
      const vm = this

      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product/${vm.tempProduct.id}`
      this.$http.delete(api).then(response => {
        if (response.data.success) {
          vm.tempProduct = {}
          vm.getProducts()
        } else {
          // todo: 等待加入錯誤判斷
        }
      })
      $('#delProductModal').modal('hide')
    },
    openProductModal (isCreated, item) {
      // 清空上傳檔案的 input 元件內容
      document.getElementById('customFile').value = ''
      if (isCreated) {
        this.tempProduct = {}
        this.isCreated = true
      } else {
        this.tempProduct = Object.assign({}, item)
        this.isCreated = false
      }
      $('#productModal').modal('show')
    },
    saveProduct () {
      // todo: 等待加入判斷圖片是否正在上傳

      const vm = this

      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product`
      let requestMethod = 'post'
      if (!vm.isCreated) {
        api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product/${vm.tempProduct.id}`
        requestMethod = 'put'
      }

      this.$http[requestMethod](api, { data: vm.tempProduct }).then(response => {
        if (response.data.success) {
          vm.tempProduct = {}
          vm.getProducts()
          $('#productModal').modal('hide')
        } else {
          // todo: 等待加入錯誤判斷
        }
      })
    },
    uploadFile () {
      const uploadedFile = this.$refs.files.files[0]
      if (typeof (uploadedFile) === 'undefined') {
        return
      }

      const vm = this
      const formData = new FormData()
      formData.append('file-to-upload', uploadedFile)
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/upload`

      vm.status.fileUploading = true
      this.$http.post(api, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        vm.status.fileUploading = false
        if (response.data.success) {
          vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl)
        } else {
          this.$bus.$emit('message:push', `上傳檔案失敗: ${response.data.message}`, 'danger')
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
