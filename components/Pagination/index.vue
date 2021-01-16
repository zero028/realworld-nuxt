<template>
  <!-- 分页列表 -->
  <nav>
    <ul class="pagination">
      <li
        class="page-item"
        v-for="item in totalPage"
        :key="item"
        :class="{
          active: item === page,
        }"
      >
        <nuxt-link
          class="page-link"
          :to="{
            name: name,
            query: {
              tab: tab,
              tag: $route.query.tag,
              page: item,
            },
          }"
          >{{ item }}</nuxt-link
        >
      </li>
    </ul>
  </nav>
  <!-- /分页列表 -->
</template>

<script>
export default {
  name: "Pagination",
  props: {
    articlesCount: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      default: 20,
    },
    tab: {
      type: String,
      default: "",
    },
    name: {
        type: String,
        required: true
    }
  },
  computed: {
    // 总页码
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
};
</script>

<style>
</style>