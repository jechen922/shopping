<template>
  <ul id="accordionSidebar" class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
    <!-- Sidebar - Brand -->
    <a class="sidebar-brand d-flex align-items-center justify-content-center"
      href="/admin/products" @click="savePath('/admin/products')">
      <div class="sidebar-brand-icon rotate-n-15">
          <i class="fal fa-ghost"></i>
      </div>
      <div class="sidebar-brand-text mx-3">陰森購物網</div>
    </a>

    <!-- Divider -->
    <hr class="sidebar-divider">

    <div>
      <h6 class="sidebar-heading">
        <span>管理員</span>
      </h6>
    </div>
    <li class="nav-item" :class="{active:activedPath === '/admin/products'}">
      <router-link class="nav-link" to="/admin/products" @click.native="savePath('/admin/products')">
        <i class="fas fa-box-open"></i>
        產品列表
      </router-link>
    </li>
    <li class="nav-item" :class="{active:activedPath === '/admin/orders'}">
      <router-link class="nav-link" to="/admin/orders" @click.native="savePath('/admin/orders')">
        <i class="far fa-list-alt"></i>
        訂單列表
      </router-link>
    </li>
    <li class="nav-item" :class="{active:activedPath === '/admin/coupons'}">
      <router-link class="nav-link" to="/admin/coupons" @click.native="savePath('/admin/coupons')">
        <i class="fas fa-ticket-alt"></i>
        優惠券
      </router-link>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider">

    <div>
      <h6 class="sidebar-heading">
        <span>模擬功能</span>
      </h6>
    </div>
    <li class="nav-item" :class="{active:activedPath === '/customer_order'}">
      <router-link class="nav-link" to="/customer_order" @click.native="savePath('/customer_order')">
        <i class="far fa-file-plus"></i>
        模擬訂單
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      activedPath: '/admin/products'
    }
  },
  methods: {
    savePath (path) {
      this.activedPath = path
    }
  },
  created () {
    this.savePath(this.$route.path)
  }
}
</script>
