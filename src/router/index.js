import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import CommentDetails from "../components/CommentDetails.vue";



Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },

  {
    path: "/comment",
    name: "Comment",
    component: {
      render(c) {
        return c("router-view");
      }
    },
    redirect: "/comment/comment-details",
    children: [
      {
        path: "comment-details",
        name: "CommentDetails",
        component: CommentDetails
      },
    ]
  }
  

];

const router = new VueRouter({
  mode: "history",
  base: '/',
  routes
});

export default router;
