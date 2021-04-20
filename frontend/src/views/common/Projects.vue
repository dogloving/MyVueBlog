<template>
    <div>
        <project-card v-for="(item,idx) in projects" :pid="item.project_id" :login="login" :key="idx" :title="item.title"
                      :description="item.description" :site="item.site"></project-card>
    </div>
</template>

<script>
  import {getAllProject} from "network/user"

  export default {
    name: "Projects",
    components: {
      ProjectCard: ()=> import("components/projectcard/ProjectCard")
    },
    data () {
      return {
        projects: [],
        login: false
      }
    },
    mounted () {
      getAllProject().then(res=> {
        this.projects = res.data.projects
        this.login = res.data.login
      })
    }
  }
</script>

<style scoped>

</style>