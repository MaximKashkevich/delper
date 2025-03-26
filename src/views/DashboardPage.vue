<template>
  <div id="app">
    <Category />
  </div>
</template>

<script>
import Category from "@/components/category/CategoryList";

export default {
  name: "App",
  components: {
    Category, // Регистрация компонента
  },
};
</script>
