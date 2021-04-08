<template>
  <div id="wrapper">
    <Sidebar></Sidebar>
    <Alert></Alert>
    <div id="content-wrapper" class="d-flex flex-column">
      <!-- Main Content -->
      <div id="content">
        <Navbar></Navbar>
        <!-- Begin Page Content -->
          <div class="container-fluid">
            <router-view></router-view>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Alert from './AlertMessage'

export default {
  components: {
    Sidebar,
    Navbar,
    Alert
  }
}
</script>
