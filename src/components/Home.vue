<template>
  <div class="hello">
    <h1 class="text-center text-underline">Access Data From API (Firebase api) </h1>
    <br/>
    <div class="container">
      <div class="row mt-3" v-for='(post) in postData' :key='post.id'>
        <div class="col-3 text-right">
          <h5>{{ post.id }}</h5>
        </div>
        <div class="col-9">
          <h6 class="pb-0 mb-0" v-html="post.postDetails.title"> <span class="text-sm">( {{ post.postDetails.url }})</span></h6>
          <small>by {{ post.postDetails.by }} </small> <small class="pl-3">by {{ moment(post.postDetails.time) }} </small> <small @click="gotoCommentSection(post.id, post.postDetails.kids?post.postDetails.kids.length:0, post.postDetails.title, post.postDetails.time)" class="pl-3" :class="{'custom-class': post.postDetails.kids}"> {{ post.postDetails.kids?post.postDetails.kids.length: 0 }} comments </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'FireBaseAPI',
  data() {
    return {
      postData: []
    }
  },
  methods:{
    moment(value) {
      return moment.unix(value).format('lll');
    },

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

    // getAllPost() {
    //   axios
    //   .get(
    //     `https://hacker-news.firebaseio.com/v0/topstories.json`,
    //   )
    //   .then(res => {
    //     let requests = res.data.map(data => {
    //       return new Promise((resolve) => {
    //         axios
    //         .get(
    //           `https://hacker-news.firebaseio.com/v0/item/${data}.json`,
    //         )
    //         .then(res => {
    //           resolve(res.data);
    //         })
    //         .catch(err => {
    //           console.log(err);
    //         });
    //       })
    //     })

    //     Promise.all(requests).then((body) => { 
    //       body.forEach(res => {
    //       if (res)
    //         this.postData.push({ id: res.id, postDetails: res })
    //       })
    //     }).catch(err => console.log(err))
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    // },

    gotoCommentSection(id, commentLength, title, time) {
      if(commentLength > 0) {
        this.$router.replace({
          name: 'CommentDetails',
          query: {id: id, commentLength: commentLength, title: title, time: time }
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
  .custom-class {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
