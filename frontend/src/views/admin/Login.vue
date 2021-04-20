<template>
    <Form ref="formInline" :model="form" class="form">
        <FormItem>
            <Input type="text" v-model="form.username" placeholder="Username">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input type="password" v-model="form.password" placeholder="Password">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit">Signin</Button>
        </FormItem>
    </Form>
</template>
<script>
  import {login} from 'network/admin';
  export default {
    data () {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      handleSubmit() {
        login(this.form).then(res=> {
          if (res.code === 1) {
            this.$Message.success(res.msg)
            this.$router.push('/home')
          } else {
            this.$Message.error(res.msg)
          }
        })
      }
    }
  }
</script>
<style scoped>
    .form {
        width: 300px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 50px;
    }
</style>
