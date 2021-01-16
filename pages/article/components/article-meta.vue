<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
    >
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
        class="author"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>
    <span v-if="isUser">
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'editor',
          params: {
            slug: article.slug,
          },
        }"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>

      <button class="btn btn-outline-danger btn-sm" @click="delArticle" :disabled="disabled">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </span>
    <span v-else>
      <button
        class="btn btn-sm action-btn btn-outline-secondary"
        @click="setFollowUser"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{ article.author.following ? "Unfollow" : "Follow" }}
        {{ article.author.username }}
      </button>

      <button class="btn btn-sm btn-outline-primary" @click="setFavorited">
        <i class="ion-heart"></i>
        &nbsp;
        {{ article.favorited ? "Unfavorite" : "Favorite" }} Article
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </span>
  </div>
</template>

<script>
import {
  deleteArticle,
  setFollow,
  deleteFollow,
  addFavorite,
  deleteFavorite,
} from "@/api/article";

export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isUser() {
      return this.article.author.username === this.$store.state.user.username;
    },
  },
  data () {
    return {
      disabled: false
    }
  },
  methods: {
    async setFollowUser() {
      const { username } = this.article.author;
      const { data } = this.article.author.following
        ? await deleteFollow(username)
        : await setFollow(username);
      this.article.author = data.profile;
    },
    async setFavorited() {
      const { slug } = this.$route.params;
      const { data } = this.article.favorited
        ? await deleteFavorite(slug)
        : await addFavorite(slug);
      this.article.favorited = data.article.favorited;
    },
    // 删除文章
    async delArticle() {
      this.disabled = true
      try {
        await deleteArticle(this.article.slug);
        this.$router.push("/");
      } catch (err) {
        // error
      }
      this.disabled = false
    },
  },
};
</script>

<style>
</style>