<template>
  <div class="hello">
    <h1 class="text-center">Firebase APIaaa project</h1>
    <div class="container">
      <div class="row" v-for='(post) in postData' :key='post.id'>
        <div class="col-3 text-right">
          <h5>{{ post.id }}</h5>
        </div>
        <div class="col-9">
          <h6 class="pb-0 mb-0">{{ post.postDetails.title }} <span class="text-sm">( {{ post.postDetails.url }})</span></h6>
          <small>by {{ post.postDetails.by }} </small> <small @click="gotoCommentSection(post.id, post.postDetails.kids.length)"> {{ post.postDetails.kids?post.postDetails.kids.length: 0 }} comments </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
export default {
  name: 'FireBaseAPI',
  data() {
    return {
      postData: []
    }
  },
  methods:{
    getAllPost() {
      axios
      .get(
        `https://hacker-news.firebaseio.com/v0/topstories.json`,
      )
      .then(res => {
        console.log(res.data);
        _.forEach(res.data, (data) =>{
          axios
          .get(
            `https://hacker-news.firebaseio.com/v0/item/${data}.json`,
          )
          .then(res => {
            this.postData.push({ id: data, postDetails: res.data })
          })
          .catch(err => {
            console.log(err);
          });
        })

        console.log(this.postData);
      })
      .catch(err => {
        console.log(err);
      });
    },

    gotoCommentSection(id, commentLength) {
      if(commentLength > 0) {
        this.$router.replace({
          name: 'CommentDetails',
          query: {id: id, commentLength: commentLength }
        })
      }
    }
  },

  created() {
    this.getAllPost();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
