<template>
  <div class="forgot-password-container">
    <div class="login-form">
      <img class="logo-img" :src="logo" />
      <h1>Войдите в аккаунт</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input id="username" v-model="form.username" placeholder="Почта или логин" class="input-field" />
          <p v-if="fieldErrors.username" class="input-error">{{ fieldErrors.username }}</p>
        </div>
        <div class="form-group">
          <div class="password-field">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" placeholder="Пароль"
              class="input-field" />
            <span class="password-toggle span-text" @click="togglePasswordVisibility">
              <img :src="showPassword ? eyeIcon : eyeIconOff" alt="Toggle password visibility" class="eye-icon" />
            </span>
          </div>
          <p v-if="fieldErrors.password" class="input-error">{{ fieldErrors.password }}</p>
        </div>
        <div class="form-group checkbox-group" :class="{ 'error-from-group': fieldErrors.agreement }">
          <label>
            <input type="checkbox" v-model="form.rememberMe" class="checkbox" />
            <span class="span-text">Запомнить данные для входа</span>
          </label>
        </div>
        <button type="submit" class="submit-button">Войти</button>
      </form>
      <div class="forgot-password-info">
        <p>
          Еще нет аккаунта? <br />
          <span class="span-text">
            <router-link to="/register">Создать аккаунт</router-link>
          </span>
        </p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import eyeIcon from '@/assets/images/auth/eye_icon.svg'
import eyeIconOff from '@/assets/images/auth/eye_icon_off.svg'
import logo from '@/assets/images/auth/logo.svg'
import store from "@/store"
import { mapActions, mapState } from "vuex"


export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        rememberMe: "",
      },
      fieldErrors: {}, // Ошибки по каждому полю
      errorMessage: "",
      successMessage: "",
      showPassword: false,
      eyeIcon,
      eyeIconOff,
      logo
    }
  },
  computed: {
    ...mapState("auth", ["loginSuccess"]),
  },
  methods: {
    ...mapActions("auth", ["login"]),

    async handleLogin() {
      this.fieldErrors = {}
      this.errorMessage = ""
      this.successMessage = ""

      const response = await this.login(this.form)
      if (store.getters['auth/loginSuccess']) {
        this.$router.push({ path: '/slides' })
      } else {
        this.errorMessage = response.errors.title
        if (response.errors.details) {
          Object.keys(response.errors.details).forEach((field) => {
            this.fieldErrors[field] = response.errors.details[field][0]
          })
        }
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    }
  },
}
</script>


<style scoped>
.input-error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
  position: absolute;
}

.forgot-password-container {
  background: linear-gradient(to bottom, #FAF9F7, #BBCAD8);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.forgot-password-info {
  text-align: center;
  margin-top: 30px;
}

.forgot-password-info p {
  font-family: 'BerlinType';
  font-weight: 100;
}

.forgot-password-info p span {
  font-family: 'BerlinType';
  font-weight: 900;
  font-size: 16px;
}

h1 {
  margin-bottom: 45px;
  font-family: 'BerlinType';
  font-weight: 100;
  text-align: center;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.input-field {
  height: 50px;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 13px;
  box-sizing: border-box;
  margin-top: 8px;
  box-shadow: 1px 1px 4px 0px #12223733 inset;
  font-family: 'BerlinType';
  font-weight: 100;
}

::placeholder {
  color: #BBCAD8;
  opacity: 1;
}

::-ms-input-placeholder {
  color: #BBCAD8;
}

.span-text {
  color: #496782;
  font-family: 'BerlinType';
  font-weight: 100;
  display: inline-block;
  width: 94%;
  margin-left: 4px;
  font-size: 12px;
}

input.checkbox {
  display: inline-block;
  margin: 0;
  height: 25px;
  width: 12%;
}

button.submit-button {
  margin-top: 40px;
}

.form-group.checkbox-group {
  display: flex;
  flex-direction: row;
}

.checkbox-group {
  margin-top: 10px;
}

.form-group.phone-group {
  margin-bottom: 15px;
}

.checkbox {
  margin-right: 10px;
}

.submit-button {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  background-color: #496782;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: -5px -3px 8px 0px #FFFFFF;
}

.submit-button:hover {
  background-color: #45a049;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}

.form-group.error-from-group::after {
  content: '!';
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 16px;
  height: 16px;
  background-color: #B60000;
  color: #FFFFFF;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  left: 94%;
  top: -33px;
}

p.input-error {
  color: #000 !important;
  background-color: #fff;
  box-shadow: 0px 0px 10px 0px #B2B0AD66;
  padding: 10px;
  border-radius: 10px;
  position: absolute;
  right: 0;
  z-index: 1;
  top: 40px;
}

.form-group {
  height: 50px;
  margin-top: 5px;
  position: relative;
}

.form-group.checkbox-group {
  margin-top: 25px;
}

label {
  width: 100%;
}

.form-group.checkbox-group span {
  width: 200px;
  font-size: 15px;
  vertical-align: super;
}

.password-field {
  position: relative;
}

.password-toggle {
  position: absolute;
  top: 60%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 10px;
  right: 25px;
}

.icon-eye,
.icon-eye-off {
  font-size: 20px;
  color: #888;
}

a {
  text-decoration: none !important;
  font-weight: 100;
  color: #496782;
}

.submit-button:hover {
  background-color: #496782;
}

.logo-img {
  margin: 0 auto;
  display: block;
  margin-bottom: 30px;
  width: 90%;
}

.form-group.checkbox-group {
  margin-left: -7px;
}
</style>
