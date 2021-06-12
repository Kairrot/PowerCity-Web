<template>
  <div class="navigation">
    <div class="left">
      <h2 class="brand">PowerCity</h2>
    </div>
    <div class="right">
      <a v-if="!user" @click="connect()" href="#" class="connect_btn">Connection<span class="mdi mdi-key"></span> </a>
      <router-link to="/account" v-else class="">Gérer votre compte</router-link>
    </div>

    <div v-if="isConnect" class="connect">
      <div class="email input-label">
        <input v-model="input.email" name="" required="" type="text">
        <label class="label">Email</label>
      </div>
      <div class="password input-label">
        <input v-model="input.password" name="" required="" type="password">
        <label class="label">Mot de passe</label>
      </div>
      <a href="#" @click="connectUser" class="connectUser">Se Connecter</a>
      <router-link @click="connect" to="/register" class="register_button">Inscription</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      isConnect: false,
      input: {
        email: "",
        password: "",
      },
      user: null,
    }
  },
  methods: {
    connect() {
      this.isConnect = !this.isConnect;
    },
    connectUser() {
      if(this.input.email !== "" && this.input.password !== "") {
        fetch('/api/user', {
          headers: {
            email: this.input.email,
            password: this.input.password
          }
        }).then(response => response.json()).then(data => {
          if(data.message) {
            if(data.message === 'NOT_EXIST') {
              alert('nexiste pas');
            } else if(data.message === 'NOT_VALID_EMAIL') {
              alert('valider email');
            }
          } else if(data.token) {
            this.$cookies.set('token', data.token);
            this.connect();
            window.location.reload();
          }
        })
      }
    }
  },
  mounted () {
    if(this.$cookies.get('token')) {
      fetch('/api/user', {
        headers: { token: this.$cookies.get('token') }
      }).then(response => response.json()).then(data => {
        if(data.status) return;

        this.user = data;
      })
    }
  }
}
</script>