<script setup>
import { ref } from "vue";

const { isAdmin, user } = useSettings();

const { t } = useI18n();
const localePath = useLocalePath();

const username = ref("");
const password = ref("");

onMounted(() => {
  // username.value = sessionStorage.getItem("user");
});

const handleLogin = async () => {
  try {
    const url = "https://literarymaps.sakura.ne.jp/cms/user/Login?_format=json";

    const data = {
      name: username.value,
      pass: password.value,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (json.current_user) {
      sessionStorage.setItem("user", json.current_user.name);
      isAdmin.value = true;
      user.value = json.current_user.name;
    } else {
      sessionStorage.setItem("user", "");
      isAdmin.value = false;
      user.value = "";
    }
  } catch (error) {
    console.error("Authentication error:", error);
  }
};

const title = t("Login");

const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title,
    disabled: false,
  },
];

const logout = () => {
  sessionStorage.setItem("user", "");
  // user.value = "";
  isAdmin.value = false;
  user.value = "";
};
</script>

<template>
  <LayoutsCommon :title="title" :items="bh">
    <template v-if="isAdmin">
      <div class="my-4">user: {{ user }}</div>
      <v-btn color="primary" @click="logout">{{ $t("Logout") }}</v-btn>
    </template>
    <template v-else>
      <form @submit.prevent="handleLogin">
        <v-text-field
          variant="outlined"
          v-model="username"
          label="Username"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          v-model="password"
          label="Password"
          type="password"
        ></v-text-field>
        <v-btn color="primary" type="submit">{{ $t("Login") }}</v-btn>
      </form>
    </template>
  </LayoutsCommon>
</template>
