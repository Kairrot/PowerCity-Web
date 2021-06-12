<template>
  <div class="register">
    <div class="content" v-if="show">
      <div class="input-label">
        <input v-model="input.email" name="" required type="text">
        <label class="label">Email</label>
        <p id="email"></p>
      </div>
      <div class="input-label">
        <input v-model="input.username" name="" required type="text">
        <label class="label">Pseudo</label>
        <p id="username"></p>
      </div>
      <div class="input-label">
        <input v-model="input.password" name="" required type="password">
        <label class="label">Mot de passe</label>
        <p id="password"></p>
      </div>
      <div class="input-label">
        <input v-model="input.passwordBis" name="" required type="password">
        <label class="label">Mot de passe (Confirmation)</label>
        <p id="passwordBis"></p>
      </div>
      <a href="#" @click="register">S'inscrire</a>
    </div>
    <div class="content" v-else>
      <h2 align="center">Vous devez confirmer votre email<br>en allant sur votre boite mail</h2>

    </div>
  </div>
</template>

<script>
export default {
  name: "Connect",
  data() {
    return {
      input: {
        email: "",
        username: "",
        password: "",
        passwordBis: "",
      },
      show: true,
    }
  },
  methods: {
    register() {
      if(this.input.email.indexOf("@") === -1) {
        this.error("email", "Email Invalide")
        return;
      }

      if(this.input.password.length < 8) {
        this.error("password", "Trop court")
        return;
      }

      if(this.input.password !== this.input.passwordBis) {
        this.error("password", "Pas de correspondance")
        this.error("passwordBis", "Pas de correspondance")
        return;
      }

      fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username: this.input.username,
          email: this.input.email,
          password: this.input.password
        })
      }).then(response => response.json()).then(data => {
        console.log(data)

        if(data.status === 400) {
          if(data.message === 'USER_ALREADY_EXIST') {
            this.error("username", "Existe déjà")
          }
        } else if(data.status === 200) {
          this.show = false;
        }
      })
    },

    error(elStr ,err) {
      const el = document.getElementById(elStr);

      el.style.color = "red";
      el.style.animationName = "shakeX";
      el.style.animationDuration = "1s"
      el.innerText = err;
      el.style.display = "";

      setTimeout(() => {
        el.style.color = "white";
        el.style.animation = "";
        el.innerText = "";
        el.style.display = "none";
      }, 5000)
    },
  }
}
</script>