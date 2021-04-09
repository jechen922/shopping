<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <div id="wrapper">
      <Alert></Alert>
      <div id="content-wrapper" class="d-flex flex-column">
        <!-- Main Content -->
        <div id="content">
          <!-- Navigation -->
          <Navbar></Navbar>
          <div class="mb-3 p-0" style="height: 400px; background-size: cover; background-position: 20% 50%; position:relative;"
            :style="{backgroundImage: `url(https://images.unsplash.com/photo-1603616678867-1fa182a9b02b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)`}">
            <div class="bg-dark p-2" style="position:absolute;
              top: 40%; left: 5%;
              opacity:0.8; border-radius:.35rem;">
              <h2 class="my-2 text-center" style="color: white; font-size: 2rem;">沒有最便宜，只有更便宜！</h2>
              <p class="my-2 text-center" style="color: white; font-size: 1.3rem;">天天打折，打到骨折</p>
            </div>
          </div>
          <div class="container-fluid">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
    <!-- /.container -->

    <!-- Footer -->
    <footer class="py-5 bg-dark">
      <div class="container">
        <p class="m-0 text-center text-white">Copyright &copy; 陰森購物網 2021</p>
      </div>
      <!-- /.container -->
    </footer>
  </div>
</template>

<script>
import Navbar from './Navbar'
import Alert from '../../AlertMessage'

export default {
  data: function () {
    return {
      products: [],
      categories: ['全部'],
      filterCategory: '全部',
      isLoading: false,
      slideKey: 0
    }
  },
  components: {
    Navbar,
    Alert
  },
  methods: {
  }
}
</script>
