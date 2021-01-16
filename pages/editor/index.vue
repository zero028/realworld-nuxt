<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <!-- 错误处理 -->
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>
          <form>
            <fieldset :disabled="disabled">
              <fieldset class="form-group">
                <input
                  v-model="article.title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="article.body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="tag"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  @keyup.enter="addTag()"
                />
                <div class="tag-list">
                  <span
                    v-for="(tag, index) in article.tagList"
                    class="tag-default tag-pill"
                    :key="index"
                  >
                    <i
                      class="ion-close-round"
                      @click.prevent="removeTag(index)"
                    ></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click.prevent="pubArticle"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { publishArticle, getArticle } from "@/api/article";

export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  // 单个中间件，使用字符串；多个中间件，使用数组
  middleware: "authenticated",
  name: "EditorIndex",
  data() {
    return {
      article: {
        title: "",
        description: "",
        body: "",
        tagList: [],
      },
      tag: "",
      errors: {},
      disabled: false
    };
  },
  async created () {
    const { data } = await getArticle(this.$route.params.slug)
    this.article = data.article
  },
  methods: {
    // 添加标签
    addTag() {
      if (this.article.tagList.indexOf(this.tag) == -1) {
        this.article.tagList.push(this.tag);
        this.tag = "";
      }
    },
    // 删除标签
    removeTag(index) {
      this.article.tagList.splice(index, 1);
    },
    // 发表文章
    async pubArticle() {
      this.disabled = true
      try {
        const { data } = await publishArticle({
          article: this.article,
        });
        this.$router.push({
          name: 'article'
        })
      } catch (error) {
        // console.log("请求失败", err);
        this.errors = error.response.data.errors;
      }
      this.disabled = false
    },
  },
};
</script>

<style>
</style>