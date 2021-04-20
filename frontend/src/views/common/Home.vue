<template>
    <div style="padding-top:50px;">
        <article-card v-for="aid in showArticleList" :login="login" :aid="aid" :key="aid"></article-card>
        <Page v-if="showPage" :total="total" :page-size="cntPerPage" :current="page" @on-change="changePage" class-name="page"/>
    </div>
</template>

<script>
  import {getArticleList, getTagArticleList} from "network/user"

  export default {
    name: "Home",
    data () {
      return {
        total: 0, // 所有文章数
        showArticleList: [], // 显示的文章
        cntPerPage: 8, // 每页文章数
        page: 1, // 当前所在页
        login: false, // 是否已登录
      }
    },
    computed: {
      showPage () {
        return this.total > this.cntPerPage
      }
    },
    methods: {
      changePage (newPage) {
        this.$router.replace('/home?page='+newPage)
      }
    },
    components: {
      ArticleCard: ()=> import("components/articlecard/ArticleCard")
    },
    mounted () {
      this.page = parseInt(this.$route.query.page) || 1
      if (typeof this.$route.query.tag === 'undefined') {
        // 查找全部文章
        getArticleList({page: this.page-1, count: this.cntPerPage}).then(res=> {
          this.total = res.data.total
          this.showArticleList = res.data.current
          this.login = res.data.login
          this.$emit('changeLogin', this.login)
        })
      } else {
        // 按tag查找文章
        getTagArticleList({tag: this.$route.query.tag, page: this.page-1, count: this.cntPerPage}).then(res=> {
          this.total = res.data.total
          this.showArticleList = res.data.current
          this.login = res.data.login
          this.$emit('changeLogin', this.login)
        })
      }
    }
  }
</script>

<style scoped>
  .page {
      text-align: center;
      margin-top: -20px;
      margin-bottom: 50px;
  }
</style>