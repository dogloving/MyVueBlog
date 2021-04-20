<template>
    <div class="edit">
        <Input placeholder="title" v-model="title" style="margin-bottom:20px" />
        <Input placeholder="description" v-model="description" type="textarea" :rows="6" style="margin-bottom:20px" />
        <Input placeholder="site" v-model="site" style="margin-bottom:20px" />
        <Button type="primary" style="float:right;text-align:right;" @click="publish">提交</Button>
        <Button type="primary" style="float:right;text-align:right;margin-right:20px;" @click="del">删除</Button>
    </div>
</template>

<script>
  import {getProjectInfo, setProject, deleteProject,checkLogin} from "network/admin"

  export default {
    name: "EditProject",
    data () {
      return {
        pid: '',
        title: '',
        description: '',
        site: ''
      }
    },
    methods: {
      publish () {
        setProject({
          pid: this.pid,
          title: this.title,
          description: this.description,
          site: this.site
        }).then(()=> {
          this.$Message.success('修改成功')
        })
      },
      del () {
        deleteProject({pid: this.pid}).then(res=> {
          this.$Message.success(res.msg)
          this.$router.push('/project')
        })
      }
    },
    mounted () {
      // 检查是否已登录，未登录则跳转到login页面
      checkLogin().then(res=> {
        if (res.code === -2) {
          this.$Message.error(res.msg)
          this.$router.replace('/login')
        }
        this.pid = this.$route.params.pid || ''
        getProjectInfo({pid: this.pid}).then(res=> {
          this.title = res.data[0].title
          this.description = res.data[0].description
          this.site = res.data[0].site
        })
      }).catch(err=> {
        console.error(err)
        this.$Message.error('未登录')
        this.$router.replace('/login')
      })
    }
  }
</script>

<style scoped>
  .edit {
      width: 60%;
      margin: auto;
      margin-top: 50px;
  }
</style>