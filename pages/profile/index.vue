<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <nuxt-link              
              class="btn btn-sm btn-outline-secondary action-btn"
              to="/settings"
              v-if="isUser"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
            <button
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="setFollowUser"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ profile.following ? `Unfollow` : "Follow" }}
              {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'my_articles',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'my_articles',
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'favorited_articles',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorites',
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div class="article-preview" v-if="articles.length == 0">
            No articles are here... yet.
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
                @click="onFavorite(article)"
                class="btn btn-outline-primary btn-sm pull-xs-right"
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
            :name="'profile'"
          />
          <!-- /分页列表 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/user";
import {
  getArticles,
  setFollow,
  deleteFollow,
  addFavorite,
  deleteFavorite,
} from "@/api/article";
import Pagination from "@/components/Pagination";

export default {
  middleware: "authenticated",
  name: "UserProfile",
  components: {
    Pagination,
  },
  async asyncData({ query, params, store }) {
    const username = params.username;
    // 判断是否是当前用户的文章
    const isUser = username === store.state.user.username;

    const page = Number.parseInt(query.page || 1);
    const limit = 20;
    const tab = query.tab || "my_articles";
    const publicParams = {
      limit,
      offset: (page - 1) * limit,
    };
    tab === "my_articles"
      ? (publicParams.author = username)
      : (publicParams.favorited = username);
    const [userRes, articleRes] = await Promise.all([
      getUserInfo(username),
      getArticles(publicParams),
    ]);

    const { profile } = userRes.data;
    const { articles, articlesCount } = articleRes.data;

    // 防止重复点击
    articles.forEach((article) => (article.favoriteDisabled = false));

    return {
      isUser,
      profile,
      articles,
      articlesCount,
      limit,
      page,
      tab,
    };
  },
  watchQuery: ["page", "tab"],
  methods: {
    async setFollowUser() {
      const { username } = this.$route.params;
      const { data } = this.profile.following
        ? await deleteFollow(username)
        : await setFollow(username);
      this.profile = data.profile;
    },
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