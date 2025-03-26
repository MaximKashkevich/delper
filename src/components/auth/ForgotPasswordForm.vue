<template>
  <div class="forgot-password-container">
    <div class="forgot-password-form">
      <h1>Сбросить пароль</h1>
      <p class="forgot-password-description">Укажите свою электронную почту, с которой вы регестрировались в Delper и на ее мы отправим информацию о восстановлении пароля.</p>
      <form @submit.prevent="handleForgotPassword">
        <div class="form-group">
          <input
              id="email"
              v-model="form.email"
              placeholder="Электронная почта"
              class="input-field"
          />
          <p v-if="fieldErrors.email" class="input-error">{{ fieldErrors.email }}</p>
        </div>
        <button type="submit" class="submit-button">Войти</button>
      </form>
      <div class="forgot-password-info">
        <p>
          <span>
            <router-link to="/login">Войти в аккаунт</router-link>
          </span>
        </p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import store from "@/store";

export default {
  data() {
    return {
      form: {
        email: "",
      },
      fieldErrors: {}, // Ошибки по каждому полю
      errorMessage: "",
      successMessage: "",
      showPassword: false
    };
  },
  computed: {
    ...mapState("auth", ["forgotPasswordSuccess"]),
  },
  methods: {
    ...mapActions("auth", ["forgotPassword"]),

    async handleForgotPassword() {
      this.fieldErrors = {};
      this.errorMessage = "";
      this.successMessage = "";

      const response = await this.forgotPassword(this.form);
      if (store.getters['auth/forgotPasswordSuccess']) {
        //this.$router.push({ path: '/dashboard' });
      } else {
        this.errorMessage = response.result.message;
        if (response.result.errors) {
          Object.keys(response.result.errors).forEach((field) => {
            this.fieldErrors[field] = response.result.errors[field][0];
          });
        }
      }
    }
  },
};
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
.forgot-password-info p{
  font-family: 'BerlinType';
  font-weight: 100;
}
.forgot-password-info p span{
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

.forgot-password-form {
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.input-field {
  height: 50px;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
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

span {
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
  background-color: #BBCAD8;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
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

.icon-eye, .icon-eye-off {
  font-size: 20px;
  color: #888;
}
p.forgot-password-description {
  text-align: center;
  font-family: 'BerlinType';
  font-weight: 100;
  margin-bottom: 40px;
}
h1 {
  margin-bottom: 15px !important;
}
a {
  text-decoration: none !important;
  font-weight: 100;
  color: #496782;
}
.submit-button:hover {
  background-color: #496782;
}
</style>
