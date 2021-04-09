<template>
  <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item text-nowrap">
        <a class="nav-link text-danger" href="#" @click.prevent="signout">Sign out</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    signout () {
      const vm = this
      const api = `${process.env.API_PATH}/logout`
      this.$http.post(api).then(response => {
        if (response.data.success) {
          const expired = Date.now()
          document.cookie = `sessionToken=; expires=${new Date(expired)};`
          localStorage.removeItem('user')
          vm.$router.push('/signin')
        } else {
          this.$bus.$emit('message:push', `登出失敗: ${response.data.message}`, 'danger')
        }
      })
    }
  }
}
</script>
