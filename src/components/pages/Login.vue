<template>
  <div class="text-center" @submit.prevent="signin">
    <form  class="form-signin">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input type="email" class="form-control" id="floatingInput"
          placeholder="Email address" v-model="user.username">
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword"
          placeholder="Password" v-model="user.password">
      </div>

      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> Remember me
        </label>
      </div>
      <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
      <p class="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    signin: function () {
      const api = `${process.env.API_PATH}/admin/signin`
      const vm = this
      this.$http.post(api, vm.user).then(response => {
        if (response.data.success) {
          const token = response.data.token
          const expired = response.data.expired
          document.cookie = `sessionToken=${token}; expires=${new Date(expired)};`

          vm.$router.push('/')
        }
      })
    }
  }

}
</script>

<style scoped>
html,
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
