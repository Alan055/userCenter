<template>
  <div class="task-warpper">
    <div id='Loading' style="    
        position: absolute;
        z-index: 400;
        top: -62px;
        left: -3%;
        width: 105.1%;
        height: 125.6%;
        background: rgba(221, 221, 219, 0.7);
        text-align: center;
        align-items: center;">
      <h1 style="margin-top: 28%;"><font color="@themeColor">敬请期待。。。。</font></h1></div>   <!-- 遮罩层 -->
    <div class="warpper-con">
      <div class="task-main">
        <div class="daily">
          <h2 class="titles">日常任务：</h2>
          <div class="singIn">
            <div class="tasgBox">
              <div class="singInLeft">
                <div class="singImg"> <i class="icon_v3">&#xe61a;</i> </div>
                <div class="singTitle">
                  <h2>每日签到</h2>
                  <p>任务描述：每天登录彩天堂娱乐网站进行签到。</p>
                  <p>任务奖励：每天签到可以兑换积分，积分可以兑换游戏币。</p>
                </div>
              </div>
              <div class="singInRight">
                <span>领取奖励</span>
                <!-- <span class="undone">已领取</span> -->
              </div>
            </div>
          </div>
        </div>
        <div class="newPersonTask">
          <h2 class="titles">新手任务：</h2>
          <div class="singIn newTask">
            <div class="tasgBox">
              <div class="singInLeft">
                <div class="singImg"> <i class="icon_v3">&#xe61d;</i></div>
                <div class="singTitle">
                  <h2 @click="()=>(this.$router.push('/userCenters/userDetail'))">绑定取款人</h2>
                  <p>任务描述：每天登录彩天堂娱乐网站进行签到。</p>
                  <p>任务奖励：每天签到可以兑换积分，积分可以兑换游戏币。</p>
                </div>
              </div>
              <div class="singInRight">
                <span class="undone" v-if="!accountStatus.isBindCard">未完成</span>
                <span @click="handel" v-else>领取奖励</span>
              </div>
            </div>
            <div class="tasgBox boxTwo">
              <div class="singInLeft">
                <div class="singImg"> <i class="icon_v3">&#xe61c;</i> </div>
                <div class="singTitle">
                  <h2 @click="()=>(this.$router.push('/userCenters/userDetail'))">绑定银行卡</h2>
                  <p>任务描述：每天登录彩天堂娱乐网站进行签到。</p>
                  <p>任务奖励：每天签到可以兑换积分，积分可以兑换游戏币。</p>
                </div>
              </div>
              <div class="singInRight">
                <span class="undone" v-if="!accountStatus.isBindCard">未完成</span>
                <span v-else>领取奖励</span>
              </div>
            </div>
            <div class="tasgBox">
              <div class="singInLeft">
                <div class="singImg"> <i class="icon_v3">&#xe61b;</i></div>
                <div class="singTitle">
                  <h2 @click="()=>(this.$router.push('/userCenters/userDetail'))">绑定手机号</h2>
                  <p>任务描述：每天登录彩天堂娱乐网站进行签到。</p>
                  <p>任务奖励：每天签到可以兑换积分，积分可以兑换游戏币。</p>
                </div>
              </div>
              <div class="singInRight">
                <span class="undone" v-if="!accountStatus.isBindPhone">未完成</span>
                <span v-else>领取奖励</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadNav from "./breadNav.vue";
// import base from "@/js/pubilc.js";
import { mapMutations, mapState } from "vuex";

// const ITEM = base.storage();
export default {
  data() {
    return {
      accountStatus: {} // 用户绑定的信息
    };
  },
  components: {
    breadNav
  },
  computed: {},

  methods: {
    ...mapMutations(["setData"]),
    handel() {
      console.log(this.accountStatus);
    },
    // 获取用户账户状态
    getAccoutStatus() {
      let _this = this;

      this.$http.post("/yx/u/api/account/get-bind-status").then(response => {
        let mainBody = response.body;
        if (mainBody.code === 0) {
          _this.accountStatus = mainBody.data;
          _this.$store.commit("setAccountStatus", mainBody.data);
        }
      });
    }
  },
  created() {
    this.getAccoutStatus();
  },
  destroyed() {
  }
};
</script>
<style lang="less" scoped>
  @import "../less/global.less";
.task-warpper {
  width: 100%;
  max-width: 972px;
  margin-top: 0px;
  position: relative;
  .warpper-con {
    width: 1005;
    padding-left: 20px;
    // border: 1px solid #e3e3e3;
    .form-nav {
      margin-bottom: 10px;
    }
    .task-main {
      width: 98%;
      max-width: 936px;
      height: 570px;
      position: relative;
      .daily,
      .newPersonTask {
        width: 100%;
        overflow: hidden;
        .titles {
          // width: 73px;
          height: 40px;
          text-align: left;
          color: #333333;
        }
        div.singIn {
          width: 100%;
          height: 120px;
          border: 1px solid #e3e3e3;
          .tasgBox {
            width: 100%;
            height: 120px;
            overflow: hidden;
            .singInLeft {
              float: left;
              width: 80%;
              height: 100%;
              .singImg {
                float: left;
                width: 54px;
                height: 54px;
                line-height: 54px;
                margin: 30px 30px 0 30px;
                overflow: hidden;
                i{
                  color: #e3e3e3;
                  font-size: 52px;
                }
                .success{
                  color: @themeColor;
                }
              }
              .singTitle {
                float: left;
                text-align: left;
                margin-top: 25px;
                h2 {
                  // cursor: pointer;
                  color: #333333;
                }
                p {
                  color: #999999;
                }
              }
            }
            .singInRight {
              float: right;
              width: 20%;
              height: 100%;
              span {
                display: inline-block;
                width: 98px;
                height: 32px;
                line-height: 32px;
                font-size: 14px;
                text-align: center;
                background: @themeColor;
                color: #fff;
                border-radius: 25px;
                margin-top: 42px;
                cursor: pointer;
              }
              .undone {
                background-color: #ffffff;
                border: solid 1px #dddddd;
                color: #666;
                cursor: not-allowed;
              }
            }
          }
          .boxTwo {
            border-top: 1px solid #e3e3e3;
            border-bottom: 1px solid #e3e3e3;
          }
        }
        div.newTask {
          height: 360px;
        }
      }
      .newPersonTask {
        margin-top: 24px;
        .singTitle {
          h2 {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
