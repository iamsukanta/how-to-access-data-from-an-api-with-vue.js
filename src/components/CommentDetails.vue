<template>
  <div class="container">
    <h4>{{ $route.query.commentLength }} comments</h4>
    <hr/>
    <div class="row mb-5" v-for="(baseComment) in commentsList" :key="baseComment.baseComment.id">
      <div class="col">
        <p class="mb-0"><small style="text-decoration:underline">{{baseComment.baseComment.by}}</small></p>
        <h4>{{ baseComment.baseComment.text }}</h4>
        <div v-for="(child) in childComment" :key="child.childrensData.id"> 
          <div class="ml-5" v-if="baseComment.baseComment.id == child.parent">
            {{child.childrensData.text}}
            <hr/>
             <div v-for="(childinner) in childInnerComment" :key="childinner.nestedchildrensData.id"> 
                <div class="ml-5" v-if="child.childrensData.id == childinner.parent">
                  {{childinner.nestedchildrensData.text}}
                  <hr/>
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
import _ from 'lodash'
export default {
  data() {
    return {
      commentsList: [],
      childComment: [],
      childInnerComment: [],
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
                  console.log(childrens.data, "inner child11");
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
      })
      .catch(err => {
        console.log(err);
      });
    }
  },

  created() {
    this.getAllComments();
  }
}
</script>