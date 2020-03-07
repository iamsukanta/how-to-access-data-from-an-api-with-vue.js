<template>
  <div class="container pt-3">
    <span><router-link to="/">Back to home</router-link></span>
    <h4 v-html="$route.query.title"></h4>
    <span>{{ moment($route.query.time) }}</span>
    <h5>{{ $route.query.commentLength }} comments </h5>
    <hr/>
    <br/>
    <div class="row mb-5" v-for="(baseComment) in commentsList" :key="baseComment.baseComment.id">
      <div class="col">
        <p class="mb-0"><small style="text-decoration:underline">{{baseComment.baseComment.by}}</small> <small>{{ moment(baseComment.baseComment.time) }}</small></p>
        <h6 v-html="baseComment.baseComment.text"></h6>
        <div v-for="(child) in childComment" :key="child.childrensData.id"> 
          <div class="ml-5" v-if="baseComment.baseComment.id == child.parent">
            <p class="mb-0"><small style="text-decoration:underline">{{child.childrensData.by}}</small> <small>{{ moment(child.childrensData.time) }}</small></p>
            <p v-html="child.childrensData.text"></p>
            <hr/>
            <div v-for="(childinner) in childInnerComment" :key="childinner.nestedchildrensData.id"> 
              <div class="ml-5" v-if="child.childrensData.id == childinner.parent">
                <p class="mb-0"><small style="text-decoration:underline">{{childinner.nestedchildrensData.by}} <small>{{ moment(childinner.nestedchildrensData.time) }}</small></small></p>
                <p v-html="childinner.nestedchildrensData.text"></p>
                <hr/>
                <div v-for="(childinnerinner) in childInnerInnerComment" :key="childinnerinner.nestedInnerChildrensData.id"> 
                  <div class="ml-5" v-if="childinner.nestedchildrensData.id == childinnerinner.parent">
                    <p class="mb-0"><small style="text-decoration:underline">{{childinnerinner.nestedInnerChildrensData.by}}</small> <small>{{ moment(childinnerinner.nestedInnerChildrensData.time) }}</small></p>
                    <p v-html="childinnerinner.nestedInnerChildrensData.text"></p>
                    <hr/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr/>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
export default {
  data() {
    return {
      commentsList: [],
      childComment: [],
      childInnerComment: [],
      childInnerInnerComment: [],
    }
  },

  methods: {
    getAllComments() {
      axios
      .get(
        `https://hacker-news.firebaseio.com/v0/item/${this.$route.query.id}.json`,
      )
      .then(res => {
        // console.log(res.data);
        _.forEach(res.data.kids, (data) =>{
          axios
          .get(
            `https://hacker-news.firebaseio.com/v0/item/${data}.json`,
          )
          .then(innerres => {
            // console.log(innerres.data);
            this.commentsList.push({baseComment: innerres.data });

            if(innerres.data.kids.length) {
              _.forEach(innerres.data.kids, (child) =>{
                axios
                .get(
                  `https://hacker-news.firebaseio.com/v0/item/${child}.json`,
                )
                .then(childrens => {
                  this.childComment.push({ parent:childrens.data.parent,  childrensData: childrens.data});

                  if(childrens.data.kids.length) {
                    _.forEach(childrens.data.kids, (childdata) =>{
                      axios
                      .get(
                        `https://hacker-news.firebaseio.com/v0/item/${childdata}.json`,
                      )
                      .then(nestedchildrens => {
                        console.log(nestedchildrens.data, "nested inner child11");
                        this.childInnerComment.push({ parent:nestedchildrens.data.parent,  nestedchildrensData: nestedchildrens.data});

                        if(nestedchildrens.data.length) {
                          _.forEach(nestedchildrens.data, (childinnerdata) =>{
                            axios
                            .get(
                              `https://hacker-news.firebaseio.com/v0/item/${childinnerdata}.json`,
                            )
                            .then(nestedInnerChildrens => {
                              console.log(nestedInnerChildrens.data, "nested inner inner child11");
                              this.childInnerInnerComment.push({ parent:nestedInnerChildrens.data.parent,  nestedInnerChildrensData: nestedInnerChildrens.data});
                            })
                            .catch(err => {
                              console.log(err);
                            });
                          })
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                    })
                  }
                })
                .catch(err => {
                  console.log(err);
                });
              })
            }
          })
          .catch(err => {
            console.log(err);
          });
        })
        console.log(this.commentsList, "ddd");
        console.log(this.childComment, "childdata");
        console.log(this.childInnerComment, "childdataInner comment");
        console.log(this.childInnerInnerComment, "childdataInnerInner comment");
      })
      .catch(err => {
        console.log(err);
      });
    },

    moment(value) {
      moment.unix(value).format('lll');
    }
  },

  created() {
    this.getAllComments();
  },

  computed: {
  }
}
</script>