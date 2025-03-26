<template>
  <div class="registration-container">
    <div class="registration-form">
      <h1>Создайте аккаунт</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group" :class="{ 'error-from-group': fieldErrors.fullname }">
          <input
              type="text"
              id="fullname"
              placeholder="Имя и фамилия"
              v-model="form.fullname"
              class="input-field"
          />
          <p v-if="fieldErrors.fullname" class="input-error">{{ fieldErrors.fullname }}</p>
        </div>
        <div class="form-group" :class="{ 'error-from-group': fieldErrors.email }">
          <input
              id="email"
              v-model="form.email"
              placeholder="Почта"
              class="input-field"
          />
          <p v-if="fieldErrors.email" class="input-error">{{ fieldErrors.email }}</p>
        </div>

        <!-- Поле для ввода телефона -->
        <div class="form-group phone-group" :class="{ 'error-from-group': fieldErrors.phone }">
          <div class="phone-input">
<!--            <span class="phone-code">+{{ selectedCountry.code }}</span>-->

            <div class="country-select">
              <div class="selected-option" @click="toggleDropdown">
                <img :src="selectedCountry.flag" alt="" class="flag" />
                <span class="code">  &nbsp;  &nbsp;  ({{ selectedCountry.code }})</span>
              </div>
              <ul v-if="dropdownOpen" class="dropdown">
                <li
                    v-for="country in countries"
                    :key="country.code"
                    @click="selectCountry(country)"
                    class="dropdown-item"
                >
                  <img :src="country.flag" alt="" class="flag" />
                  <span class="name">{{ country.name }}</span>
                  <span class="code">({{ country.code }})</span>
                </li>
              </ul>
            </div>
            <input
                type="tel"
                id="phone"
                v-model="form.phone"
                :placeholder="phonePlaceholder"
                @input="formatPhoneNumber"
                class="input-field phone-number"
            />
          </div>
          <p v-if="fieldErrors.phone" class="input-error">{{ fieldErrors.phone }}</p>
        </div>
        <div class="form-group" :class="{ 'error-from-group': fieldErrors.username }">
          <input
              type="text"
              id="username"
              v-model="form.username"
              placeholder="Логин"
              class="input-field"
          />
          <p v-if="fieldErrors.username" class="input-error">{{ fieldErrors.username }}</p>
        </div>
        <div class="form-group" :class="{ 'error-from-group': fieldErrors.password }">
          <input
              type="password"
              id="password"
              v-model="form.password"
              placeholder="Пароль"
              class="input-field"
          />
          <p v-if="fieldErrors.password" class="input-error">{{ fieldErrors.password }}</p>
        </div>
        <div class="form-group" :class="{ 'error-from-group': fieldErrors.repeat_password }">
          <input
              type="password"
              id="repeat_password"
              v-model="form.repeat_password"
              placeholder="Повторите пароль"
              class="input-field"
          />
          <p v-if="fieldErrors.repeat_password" class="input-error">{{ fieldErrors.repeat_password }}</p>
        </div>
        <div class="form-group checkbox-group" :class="{ 'error-from-group': fieldErrors.agreement }">
          <label>
            <input type="checkbox" v-model="form.agreement" class="checkbox" required/>
            <span>Соглашаюсь с публичной офертой, политикой конфиденциальности и обработкой персональных данных.</span>
          </label>
          <p v-if="fieldErrors.agreement" class="input-error">{{ fieldErrors.agreement }}</p>
        </div>
        <button type="submit" class="submit-button">Создать</button>
      </form>
      <div class="registration-info">
        <p>
          Уже зарегистрировались в сервисе? <br />
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
import russiaIcon from '@/assets/images/auth/flags/icon-russia.png';
import kyrgyzstanIcon from '@/assets/images/auth/flags/icon-kyrgyzstan.png';
import thailandIcon from '@/assets/images/auth/flags/icon-thailand.png';
import ukraineIcon from '@/assets/images/auth/flags/icon-ukraine.png';
import belarusIcon from '@/assets/images/auth/flags/icon-belarus.png';

export default {
  data() {
    return {
      form: {
        fullname: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        repeat_password: "",
        agreement: false,
      },
      phoneNumber: "",
      selectedCountry: { name: "Россия", code: "7", flag: russiaIcon },
      countries: [
        { name: "Россия", code: "7", flag: russiaIcon },
        { name: "Украина", code: "380", flag: ukraineIcon },
        { name: "Кыргызстан", code: "996", flag: kyrgyzstanIcon },
        { name: "Беларусь", code: "375", flag: belarusIcon },
        { name: "Тайланд", code: "66", flag: thailandIcon },
      ],
      fieldErrors: {}, // Ошибки по каждому полю
      errorMessage: "",
      successMessage: "",
      dropdownOpen: false,
    };
  },
  computed: {
    ...mapState("auth", ["registrationSuccess"]),
    phonePlaceholder() {
      switch (this.selectedCountry.code) {
        case "7":
          return "(495) 231-36-60";
        case "380":
          return "(044) 278-13-57";
        case "996":
          return "312 97-61-61";
        case "375":
          return "(17) 327-45-62";
        case "66":
          return "214 6630-8";
        default:
          return "";
      }
    },
  },
  methods: {
    ...mapActions("auth", ["register"]),
    formatPhoneNumber() {
      let phone = this.form.phone.replace(/\D/g, ""); // Убираем все нецифровые символы
      switch (this.selectedCountry.code) {
        case "7":
          phone = phone.replace(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/, "($2) $3-$4-$5");
          break;
        case "380":
          phone = phone.replace(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/, "($2) $3-$4-$5");
          break;
        case "996":
          phone = phone.replace(/^(\d{3})(\d{2})(\d{2})(\d{2})$/, "$1 $2 $3 $4");
          break;
        case "375":
          phone = phone.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, "($1) $2-$3-$4");
          break;
        case "66":
          phone = phone.replace(/^(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3");
          break;
        default:
          break;
      }
      this.form.phone = phone;
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    selectCountry(country) {
      this.selectedCountry = country;
      this.dropdownOpen = false;
      // Сброс номера телефона при смене страны
      this.phoneNumber = "";
    },
    async handleRegister() {
      this.fieldErrors = {};
      this.errorMessage = "";
      this.successMessage = "";
      this.form.phone = `+${this.selectedCountry.code}${this.form.phone}`;
      const response = await this.register(this.form);
      if (store.getters['auth/registrationSuccess']) {
        this.successMessage = "Регистрация прошла успешно!";
      } else {
        this.errorMessage = response.result.message;
        if (response.result.errors) {
          Object.keys(response.result.errors).forEach((field) => {
            this.fieldErrors[field] = response.result.errors[field][0];
          });
        }
      }
    },
  },
};
</script>


<style scoped>
img.flag {
  width: 28px;
}
.country-select {
  display: flex;
  height: 50px;
  font-size: 16px;
  border: none !important;
  border-radius: 8px 0 0 8px;
  padding:  10px 0 10px 18px;
  border-right: none;
  width: 100px;
  box-shadow: 3px 1px 4px 0px #12223733 inset !important;
  background-color: #fff;
  color: #496782;
  font-family: 'BerlinType';
  font-weight: 100;
  margin-top: 8px;
}

.country-select .name{
  width: 100px;
  margin-left: 10px;
  font-family: 'BerlinType';
  font-weight: 100;
}

.country-select .code{
  float: right;
  font-family: 'BerlinType';
  font-weight: 100;
}

.country-select ul.dropdown li.dropdown-item {
  display: flex;
  align-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}

.country-select ul.dropdown {
  margin-top: 10px;
  padding: 20px 20px 10px 20px;
  position: absolute;
  z-index: 99999;
  background-color: #fff;
  width: 100%;
  list-style-type: none;
  left: 0;
  border-radius: 10px;
  top: 50px;
}

.selected-option {
  display: flex;
  text-align: center;
  line-height: 2em;
  align-items: center;
}

.phone-input {
  display: flex;
  align-items: center;

}

.phone-input .input-field {
  border-radius: 0 8px 8px 0;
  border-left: none;
  border: none !important;
  box-shadow: none;
  box-shadow: -3px 1px 4px 0px #12223733 inset;
}

.phone-number {
  flex: 1;
  border-radius: 0 8px 8px 0;
  border: 1px solid #ddd;
  padding: 10px;
  font-size: 16px;
}

.flag-icon {
  width: 20px;
  height: 15px;
  margin-right: 5px;
}
select.country-select {
  margin-top: 8px;
  box-shadow: 1px 1px 4px 0px #12223733 inset;
  border: 1px solid #ddd;
  font-family: 'BerlinType';
  font-weight: 100;
  font-size: 16px;
  border: 1px solid #ddd;
}
.input-error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
  position: absolute;
}
.registration-container {
  background: linear-gradient(to bottom, #FAF9F7, #BBCAD8);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.registration-info {
  text-align: center;
  margin-top: 30px;
}
.registration-info p{
  font-family: 'BerlinType';
  font-weight: 100;
}
.registration-info p span{
  font-family: 'BerlinType';
  font-weight: 900;
  font-size: 16px;
}
h1 {
  margin-bottom: 45px;
  font-family: 'BerlinType';
  font-weight: 900;
}

.registration-form {
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

.checkbox-group span {
  color: #496782;
  font-family: 'BerlinType';
  font-weight: 100;
  display: inline-block;
  width: 93%;
  margin-left: 4px;
  font-size: 12px;
}

input.checkbox {
  width: 5%;
  display: inline-block;
  margin: 0;
  height: 25px;
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
a {
  text-decoration: none !important;
  font-weight: 100;
  color: #496782;
}
.submit-button:hover {
  background-color: #496782;
}
h1 {
  text-align: center;
}
</style>
