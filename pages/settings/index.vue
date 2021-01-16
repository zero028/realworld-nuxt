<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <!-- 错误处理 -->
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="user.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>

          <hr />

          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUser, updateUser } from "@/api/user";

// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  middleware: "authenticated",
  name: "SettingsIndex",
  data() {
    return {
      user: {},
      errors: {}, // 错误信息
    };
  },
  async created () {
    const { data } = await getCurrentUser();
    this.user = data.user;
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = await updateUser({
          user: this.user,
        });
        console.log(data);

        // TODO：保存用户的登录状态
        this.$store.commit("setUser", data.user);

        // 为了防止刷新页面数据丢失，我们需要把数据持久化
        Cookie.set("user", data.user);

        this.$router.push(`/profile/${this.user.username}`);
      } catch (err) {
        this.errors = err.response.data.errors;
      }
    },
    logout() {
      this.$store.commit("setUser", null);
      Cookie.remove("user");
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>