<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          v-model="comment.body"
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="article.author.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" @click.prevent="postComment">
          Post Comment
        </button>
      </div>
    </form>

    <div class="card" v-for="(comment, index) in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
          class="comment-author"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
          class="comment-author"
        >
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{
          comment.createdAt | date("MMM DD, YYYY")
        }}</span>
        <span class="mod-options">
          <i class="ion-trash-a" @click="deleteCb(comment.id, index)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComments, deleteComments } from "@/api/article";
export default {
  name: "ArticleComments",
  props: {
    article: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      comment: {
        body: "",
      },
      comments: [], // 文章列表
    };
  },
  async mounted() {
    const { data } = await getComments(this.article.slug);
    this.comments = data.comments;
  },
  methods: {
    // 发表评论
    async postComment() {
      if (!this.comment.body) return
      const { data } = await addComments(
        {
          comment: this.comment,
        },
        this.article.slug
      );
      this.comments.push(data.comment);
      this.comment.body = ""
    },
    // 删除评论
    async deleteCb(id, index) {
      try {
        await deleteComments(this.article.slug, id);
        this.comments.splice(index, 1);
      } catch (err) {
        throw new Error(err)
      }
    },
  },
};
</script>

<style>
</style>