<template>
    <Card class="card" style="width:80%;margin-top:50px" @click.native="visit">
        <div class="header">
            <h1>{{title}}</h1>
            <div class="edit" v-if="login" @click.stop="go2Edit"><span>编辑</span></div>
        </div>
        <p>{{description}}</p>
    </Card>
</template>

<script>
  export default {
    name: "ProjectCard",
    props: {
      pid: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      site: {
        type: String,
        default: ''
      },
      login: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      visit () {
        console.log(this.site)
        location.href = this.site
      },
      go2Edit () {
        this.$router.push({
          path: '/editproject/'+this.pid,
          params: {
            pid: this.pid,
            title: this.title,
            description: this.description,
            site: this.site
          }
        })
      }
    }
  }
</script>

<style scoped>
  .card {
      margin: auto;
  }
  .card:hover {
      cursor: pointer;
  }
  .edit {
      width: 100%;
      color: blue;
      text-align: right;
      padding-right: 5px;
      font-weight: bold;
  }
</style>