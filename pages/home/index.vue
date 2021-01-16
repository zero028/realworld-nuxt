<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <!-- <a class="nav-link disabled" href="">Your Feed</a> -->
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'your_feed',
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed',
                    },
                  }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'global_feed',
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed',
                    },
                  }"
                  >Global Feed</nuxt-link
                >
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'tag',
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag,
                    },
                  }"
                  >#{{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  class="author"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{
                  article.createdAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited,
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <!-- 分页列表 -->
          <pagination
            :articlesCount="articlesCount"
            :page="page"
            :tab="tab"
            :name="'home'"
          />
          <!-- /分页列表 -->
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag: item,
                  },
                }"
                class="tag-pill tag-default"
                v-for="item in tags"
                :key="item"
                >{{ item }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  getArticles,
  getFeedArticles,
  addFavorite,
  deleteFavorite,
} from "@/api/article";
import { getTags } from "@/api/tag";

import Pagination from "@/components/Pagination";

// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  name: "HomePage",
  components: {
    Pagination,
  },
  // 需要 SEO
  async asyncData({ query, store }) {
    // query 存储所有的查询条件
    const page = Number.parseInt(query.page || 1);
    const limit = 20;
    const { tag } = query;
    const tab = query.tab || "global_feed";
    const loadArticles =
      store.state.user && tab === "your_feed" ? getFeedArticles : getArticles;

    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit, // 每页显示的文章数量
        // 数据偏移量
        offset: (page - 1) * limit,
        tag,
      }),
      getTags(),
    ]);

    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagRes.data;

    // 防止重复点击
    articles.forEach((article) => (article.favoriteDisabled = false));
    
    return {
      articles,
      articlesCount,
      tags,
      limit,
      page,
      tag,
      tab,
    };
  },
  // 查询参数改变时，不会调用 asyncData 等
  // 通过 watchQuery 解决，类似于热更新
  // 注意，需要刷新整个页面，否则不起作用
  watchQuery: ["page", "tag", "tab"],
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true;
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount -= 1;
      } else {
        // 添加点赞
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    },
  },
};
</script>

<style>
</style>