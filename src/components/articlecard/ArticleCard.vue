<template>
  <div :class="collapse?'card':'article'" @click="unfold" style="margin-bottom:60px;padding-top:10px;">
      <div class="container">
          <h1 class="title">{{title}}</h1>
          <Tag v-for="(tag,idx) in tags" :key="idx" :name="tag" color="primary" class="tag" style="margin-right:15px;"
               @click.native="go2TagPage(tag)">{{tag}}</Tag>
          <h4 class="time">
              <span v-if="login" class="edit" @click="go2Edit">编辑</span>
              {{last_modify_time}}
          </h4>
          <div v-html="compiledMarkdown" v-highlight :class="[collapse?'collapse-content':'','always-content']"></div>
          <div :class="collapse?'collapse':''"></div>
          <div v-show="!collapse" class="fold" @click.stop="fold">收起</div>
      </div>
  </div>
</template>
<script>
  import {getArticleInfo} from "network/user"
  import marked from 'marked'
  export default {
    computed: {
      compiledMarkdown () {
        return marked(this.content, { sanitize: true })
      }
    },
    data() {
      return {
        title: '',
        last_modify_time: '',
        content: '',
        tags: [],
        collapse: true
      };
    },
    props: {
      aid: {
        type: String,
        default: ''
      },
      login: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      unfold () {
        // 展开文章
        this.collapse = false
      },
      fold () {
        // 收起
        this.collapse = true
      },
      go2TagPage (tag) {
        this.$router.replace('/home?tag='+tag+'&&page='+1)
      },
      go2Edit () {
        this.$router.push({path: '/editarticle/'+this.aid, params:{aid: this.aid}})
      }
    },
    mounted() {
      // 根据文章ID获取文章内容
      getArticleInfo({aid: this.aid}).then(res=> {
        const data = res.data
        if (res.data.length > 0) {
          this.title = data[0].article_title
          this.publish_time = data[0].publish_time
          this.last_modify_time = data[0].last_modify_time
          for (let item of data) this.tags.push(item.tag_name)
          this.content = data[0].article_content
        }
      })
    }
  };
</script>
<style scoped>
    .card {
        width: 90%;
        margin: auto;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
    }
    .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        cursor: pointer;
    }
    .article {
        width: 90%;
        margin: auto;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
    }
    .container {
        padding: 2px 16px;
    }
  .title {
      text-align: center;
  }
  .edit {
      color: blue;
      margin-right: 40px;
  }
  .edit:hover {
      cursor: pointer;
  }
  .time {
      text-align: right;
  }
  .collapse-content {
      max-height: 400px;
      overflow: hidden;
  }
  .always-content>>>img {
      max-width: 100%;
  }
  .collapse {
      height: 200px;
      margin-top: -200px;
      line-height: 200px;
      text-align: center;
      font-size: 2.2em;
      width: 100%;
      background-image: linear-gradient(rgba(255,255,255,0),rgba(255,255,255,1));
      mix-blend-mode: overlay;
  }
  .fold {
      color: blue;
      font-size: 1.5em;
      text-align: right;
      margin-top: -20px;
  }
  .fold:hover {
      cursor: pointer;
  }
  .tag:hover {
      cursor: pointer;
  }
</style>
