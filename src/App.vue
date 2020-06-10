<template>
  <div class="layout">
    <Layout>
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed"
        style="min-height:100vh;overflow:auto;left:0;">
        <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']" :class="menuitemClasses">
          <MenuItem name="collapse" @click.native="collapsedSider">
            <Icon :class="rotateIcon" type="md-menu" size="24"></Icon>
          </MenuItem>
          <MenuItem name="home" @click.native="go2Home">首页</MenuItem>
          <MenuItem name="projects" @click.native="go2Project">项目</MenuItem>
          <MenuItem name="add-project" v-if="isLogin" @click.native="go2EditProject">添加新项目</MenuItem>
          <MenuItem name="add-article" v-if="isLogin" @click.native="go2EditArticle">添加新文章</MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Content :style="{padding: '0 16px 16px'}">
          <router-view :key="$route.fullPath" @changeLogin="changeLogin"></router-view>
          <Icon type="md-arrow-round-up" @click="backTop" v-show="showBackTop" :size="50" class="back-top" />
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  import {checkLogin} from "network/admin"

  export default {
    data () {
      return {
        isCollapsed: false,
        showBackTop: false,
        isLogin: false
      }
    },
    computed: {
      rotateIcon () {
        return [
          'menu-icon',
          this.isCollapsed ? 'rotate-icon' : ''
        ];
      },
      menuitemClasses () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    },
    methods: {
      collapsedSider () {
        this.$refs.side1.toggleCollapse();
      },
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
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }
  .menu-icon{
    transition: all .3s;
  }
  .rotate-icon{
    transform: rotate(-90deg);
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }
  .collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
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