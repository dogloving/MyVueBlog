<template>
    <div>
<!--        <editor v-model="editor.info" :isClear="isClear" :aid="aid" @getContent="getContent"></editor>-->
        <editor :aid="aid"></editor>
    </div>
</template>

<script>
  import {checkLogin} from "network/admin"
  import Editor from "components/editor/Editor";

  export default {
    name: "Admin",
    components: {Editor},
    props: {
      aid: {
        type: String,
        default: ''
      }
    },
    created () {
      // 检查是否已登录，未登录则跳转到login页面
      checkLogin().then(res=> {
        if (res.code === -2) {
          this.$Message.error(res.msg)
          this.$router.replace('/login')
        }
      }).catch(err=> {
        console.error(err)
        this.$Message.error('未登录')
        this.$router.replace('/login')
      })
    }
  }
</script>

<style scoped>

</style>