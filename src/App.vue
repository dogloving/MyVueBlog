<template>
  <div class="layout">
    <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
      <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']">
        <MenuItem name="home" @click.native="go2Home">首页</MenuItem>
        <MenuItem name="projects" @click.native="go2Project">项目</MenuItem>
        <MenuItem name="add-project" v-if="isLogin" @click.native="go2EditProject">添加新项目</MenuItem>
        <MenuItem name="add-article" v-if="isLogin" @click.native="go2EditArticle">添加新文章</MenuItem>
      </Menu>
    </Sider>
    <Layout style="marginLeft:200px;min-height:100vh;">
      <Content :style="{padding: '0 16px 16px'}">
          <router-view :key="$route.fullPath" @changeLogin="changeLogin"></router-view>
          <Icon type="md-arrow-round-up" @click="backTop" v-show="showBackTop" :size="50" class="back-top" />
      </Content>
    </Layout>
  </div>
</template>
<script>
  import {checkLogin} from "network/admin"

  export default {
    data () {
      return {
        showBackTop: false,
        isLogin: false
      }
    },
    methods: {
      backTop () {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      },
      handleScroll () {
        if (document.documentElement.scrollTop > 800) {
          this.showBackTop = true
        } else {
          this.showBackTop = false
        }
      },
      go2Home () {
        this.$router.push('/home')
      },
      go2Project () {
        this.$router.push('/project')
      },
      go2EditArticle () {
        this.$router.replace('/addnewarticle')
      },
      go2EditProject () {
        this.$router.replace('/editproject')
      },
      changeLogin (login) {
        this.isLogin = login
      }
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll)
      checkLogin().then(res=> {
        if (res.code === 2) {
          this.isLogin = true
        }
      })
    }
  }
</script>
<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-header-bar{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
  .back-top {
    position: fixed;
    bottom: 30px;
    right: 10px;
  }
  .back-top:hover {
    cursor: pointer;
  }
</style>