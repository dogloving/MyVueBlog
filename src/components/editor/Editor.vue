<template>
    <div class="editor">
        <Input v-model="title" placeholder="输入标题" style="margin-bottom:20px;" size="large" />
        <div ref="toolbar" class="toolbar"></div>
        <div ref="editor" class="text"></div>
        <div class="bottom-pane">
            <div class="tags">
                <Tag v-for="(tag,idx) in allTags" :key="idx" :name="tag" checkable :checked="selectedTags.indexOf(tag)===-1?false:true"
                     color="primary" class="tag" style="margin-right:15px;" @on-change="toggleTag(tag)">{{tag}}</Tag>
                <input type="text" placeholder="+New Tag" class="tag ivu-tag ivu-tag-size-default ivu-tag-primary"
                       style="border:dot-dash lightblue 1px;width: 90px;"  v-model="newTag" @keyup.enter="addNewTag">
            </div>
            <Modal title="确认删除后不可恢复" :z-index="100000" v-model="deleteConfirm" @on-ok="deleteOk" @on-cancel="deleteCancel"></Modal>
            <div class="publish">
                <RadioGroup v-model="visible" vertical style="margin-right:20px;text-align:left;">
                    <Radio :label="1">
                        <span>可见</span>
                    </Radio>
                    <Radio :label="0">
                        <span>不可见</span>
                    </Radio>
                </RadioGroup>
                <Button type="primary" style="text-align:right;margin-right:20px;" @click="deleteArticle">删除</Button>
                <Button type="primary" style="text-align:right;" @click="publish">发布</Button>
            </div>
        </div>
    </div>
</template>

<script>
    // 参考 https://my.oschina.net/u/3992201/blog/2240237
  import E from 'wangeditor'
  import {setArticle, deleteArticle} from "network/admin"
  import {getAllTag, getArticleInfo} from "network/user"
  import {format} from "../../util"

    export default {
    name: 'Editor',
    data () {
      return {
        editor: null,
        info_: null,
        title: '', // 文章标题
        publish_time: '', // 文章发布时间
        last_modify_time: '', // 最后修改时间
        visible: 1, // 文章可见嘛

        allTags: [], // 所有tag
        selectedTags: [], // 已选中tag
        newTag: '',
        deleteConfirm: false, // 是否显示删除框
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      isClear: {
        type: Boolean,
        default: false
      },
      aid: {
        type: String,
        default: ''
      }
    },
    watch: {
      isClear (val) {
        // 触发清除文本域内容
        if (val) {
          this.editor.txt.clear()
          this.info_ = null
        }
      },
      value (val) {
        // 使用 v-model 时，设置初始值
        this.editor.txt.html(val)
      }
    },
    mounted () {
      // 初始化wangEditor
      this.seteditor()
      // 获取所有tag
      getAllTag().then(res=> {
        for (let tag of res) this.allTags.push(tag.tag_name)
      })
      // 根据文章ID获取内容
      getArticleInfo({aid: this.aid}).then(res=> {
        const data = res.data
        if (data.length > 0) {
          console.log(res.data)
          this.title = data[0].article_title
          this.publish_time = data[0].publish_time
          this.last_modify_time = data[0].last_modify_time
          this.visible = data[0].type
          for (let item of data) this.selectedTags.push(item.tag_name)
          this.$emit('getContent', data[0].article_content)
        }
      })
    },
    methods: {
      seteditor () {
        this.editor = new E(this.$refs.toolbar, this.$refs.editor)

        this.editor.customConfig.uploadImgShowBase64 = true // base 64 存储图片
        this.editor.customConfig.uploadImgServer = ''// 配置服务器端地址
        this.editor.customConfig.uploadImgHeaders = {      }// 自定义 header
        this.editor.customConfig.uploadFileName = '' // 后端接受上传文件的参数名
        this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
        this.editor.customConfig.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
        this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

        // 配置菜单
        this.editor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'link', // 插入链接
          'list', // 列表
          'justify', // 对齐方式
          'quote', // 引用
          'emoticon', // 表情
          'image', // 插入图片
          'table', // 表格
          'video', // 插入视频
          'code', // 插入代码
          'undo', // 撤销
          'redo' // 重复
        ]


        this.editor.customConfig.onchange = (html) => {
          this.info_ = html // 绑定当前逐渐地值
          this.$emit('change', this.info_) // 将内容同步到父组件中
        }

        // 创建富文本编辑器
        this.editor.create()
      },
      toggleTag (tag) {
        // 如果没有选择tag，选他；选了，取消选中
        const idx = this.selectedTags.indexOf(tag)
        if (idx === -1) {
          this.selectedTags.push(tag)
        } else {
          this.selectedTags.splice(idx, 1)
        }
      },
      addNewTag () {
        // 添加新tag
        this.newTag = this.newTag.trim()
        if (this.newTag === '') return
        if (this.allTags.indexOf(this.newTag) !== -1) {
          // 标签已存在就选中该标签
          this.$Message.warning('该标签已存在')
          if (this.selectedTags.indexOf(this.newTag) === -1) {
            this.selectedTags.push(this.newTag)
          }
        } else {
          // 标签是新的
          this.allTags.push(this.newTag)
          this.selectedTags.push(this.newTag)
        }
        this.newTag = ''
      },
      deleteArticle () {
        this.deleteConfirm = true
      },
      deleteOk () {
        deleteArticle({aid: this.aid}).then(res=> {
          this.$Message.success(res.msg)
          this.$router.replace('/home')
        })
      },
      deleteCancel () {
        this.deleteConfirm = false
      },
      publish () {
        // 发布文章
        this.title = this.title.trim()
        this.$parent.editor.info = this.$parent.editor.info.trim()
        if (this.title === '' || this.$parent.editor.info === '') {
          this.$Message.warning('标题或内容不能为空')
          return
        }
        // 获取当前时间
        const date = new Date()
        const time = date.getFullYear() + '-' + format(String(date.getMonth() + 1),2,'0') + '-' + format(String(date.getDate()),2,'0')
            + ' ' + format(String(date.getHours()),2,'0') + ':' + format(String(date.getMinutes()),2,'0') + ':' + format(String(date.getSeconds()),2,'0')
        setArticle({
          aid: this.aid,
          title: this.title,
          content: this.$parent.editor.info,
          last_modify_time: time,
          tags: this.selectedTags,
          visible: this.visible
        }).then(res => {
          if (res.code === -2) {
            this.$Message.warning(res.msg)
            this.$router.replace('/login')
          } else {
            this.$Message.success('发布成功')
            this.$parent.editor.info = ''
            this.title = ''
            this.selectedTags = []
          }
        })
      }
    }
  }
</script>

<style lang="css">
    .editor {
        width: 80%;
        margin: 0 auto;
        margin-top: 50px;
    }
    .toolbar {
        border: 1px solid #ccc;
    }
    .text {
        border: 1px solid #ccc;
        height: 70vh;
    }
    .bottom-pane {
        display: flex;
        margin-top: 10px;
    }
    .tags {
        flex: 9;
        word-wrap: break-word;
        word-break:break-all;
        overflow: hidden;
    }
    .tag:hover {
        cursor: pointer;
    }
    .publish {
        flex: 3;
        text-align: right;
    }
</style>