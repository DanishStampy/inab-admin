import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import BookList from "@/pages/book/BookList"
import BookDetails from "@/pages/book/BookDetails"
import BookLog from "@/pages/book/BookLog.vue"
import RequestList from "@/pages/request/RequestList"
import HomePage from "@/pages/HomePage.vue"
import Profile from "@/pages/profile/Profile.vue"
import firebase from "firebase";

Vue.use(VueRouter);

const routers = [
  {
    path: "/",
    name: "dashboard",
    component: HomeView,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "/home",
        name: "homepage",
        component: HomePage,
      },
      {
        path: "/book",
        name: "listbook",
        component: BookList,
      },
      {
        path: "/book/:book_id",
        name: "detailbook",
        component: BookDetails,
      },
      {
        path: "/request",
        name: "requestbooklist",
        component: RequestList
      },
      {
        path: "/log",
        name: "auditbooklog",
        component: BookLog,
      },
      {
        path: "/profile",
        name: "profile",
        component: Profile,
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
];

const router = new VueRouter({
  mode: "history",
  routes: routers,
});

router.beforeEach( async(to, from, next) => {
  const authenticatedUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        unsubscribe();
        resolve(user)
      }, reject)
    })
  }

  console.log(`${authenticatedUser} and ${requiresAuth}`)
  console.log(to)

  if( !(await getCurrentUser()) && requiresAuth)
    next('/login')
  else
    next()
})

export default router;
