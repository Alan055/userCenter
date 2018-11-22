<template>
 <div class="warpper-con">
        <div class="warpper-form">
            <div class="form-main">
                <div class="selBtns">
                    <div class="selBtns-left fl">
                        <label class="selectAll" for="selAll" >
                            <input type="checkbox" id="selAll" @click="selectAll" v-model='isok'>全选</label>
                        <label for="antiAll" class="antiAll"><input type="checkbox" id="antiAll" @click="antiAll" v-model='antiok'/>取消全选</label>
                    </div>
                    <div class="selBtns-rgiht fr" @click="delSelect()">
                        <span>删除所选</span>
                    </div>
                </div>
                <div class="clear msgMain">
                    <table>
                        <thead>
                            <tr>
                              <td width="12%" class="sender">发件人</td>
                              <td width="35%" class="theme">主题</td>
                              <td width="18%" class="sendTime">发件时间</td>
                              <td width="10%" class="status">发件状态</td>
                              <td width="15%" class="operating">操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,idx) in list" :key="idx" v-if="list.length">
                                <td>
                                    <span class="check fl"><input type="checkbox" :value='item'  @change="checkItem" v-model='itemsd'></span>
                                    <span>{{item.createUser}}</span>
                                </td>
                                <td>{{item.title}}</td>
                                <td>{{item.createDateString}}</td>
                                <td>{{item.readStateStr}}</td>
                                <td>
                                    <span class="detail" @click="showDetail({'readStateStr':item.readStateStr,'content':item.content,'createUser': item.createUser,'title':item.title,'id':item.userMessageId})">详情</span>
                                    <span class="del" @click="del(item.userMessageId)">删除</span>
                                </td>
                            </tr>
                            <!-- <tr v-if="!list.length"><td colspan="5">暂无消息</td></tr> -->
                        </tbody>
                    </table>
                    <div class="noNotice" v-if="!list.length">
                      <div>
                        <i class="icon_v3">&#xe6a5;</i>
                        <p>暂无数据</p>
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pagesList fr" >
            <div v-if="list.length">
                <!-- <Page :page-index="currentPage" :total="totalCount" show-total prev-text="上一页" next-text="下一页" show-elevator :page-size="pageSize"  @change="pageChange"></Page> -->
                <Page show-elevator  show-total class="switch_btn"  @on-change="handlePage"  prev-text="上一页" next-text="下一页"  :page-size="pageSize" :total="totalCount" ></Page>
                <!-- <pages :page-index="currentPage" :totla="totalCount" :page-size="pageSize"  @change="pageChange"></pages> -->
            </div>
        </div>
        <UtilPrompt v-if="isShowUtil">
            <div class="utilMain">
                <div class="utilTitle"><span>删除</span></div>
                <div class="utilTips">
                    <h3>您确定删除吗？</h3>
                </div>
                <div class="utilBtns">
                    <span class="cancel" @click="cancel">取消</span>
                    <span class="sure" @click="delMsg">确定</span>
                </div>
            </div>
        </UtilPrompt>
        <UtilPrompt v-if="isShowDetail">
            <div class="utilMainDetail">
                <div class="detailTitle"><span>消息详情</span></div>
                <div class="detailTips">
                    <div class="">
                        <span class="detailLeft">发件人：</span>
                        <span class="detailRight">{{msg.showList.createUser}}</span>
                    </div>
                    <div>
                        <span class="detailLeft">主题：</span>
                        <span class="detailRight">{{msg.showList.title}}</span>
                    </div>
                    <div>
                        <span class="detailLeft detailCon">消息内容：</span>
                        <div class="detailRight detailContent" v-html="msg.showList.content"></div>
                    </div>
                </div>
                <div class="detailBtns">
                    <span class="cancel" @click="del(msg.showList.id)">删除</span>
                    <span class="sure" @click="isShowDetail = false">关闭</span>
                </div>
            </div>
        </UtilPrompt>
    </div>
</template>

<script>
import breadNav from "./breadNav";
import UtilPrompt from "@/components/utilPrompt";
import pages from "@/components/pages";
import { mapMutations } from "vuex";
import {stationNotice} from '@/js/index.js'

export default {
  data() {
    return {
      // totalCount:null, // 记录总数
      promptList: [], // 消息列表
      isShowUtil: false, // 是否显示提示框
      isShowDetail: false,
      isDelete: false, //是否删除
      delId: [],
      itemsd: [],
      isok: false, //判断CheckBox是否选中
      antiok: true,
      pageSize: 10, //每页显示20条数据
      currentPage: 1, //当前页码
      currentNum:1,
      totalCount: 0, //总记录数
      // items : []
      checkedArr: [],
      msg: {
        show: false,
        list: [],
        showList: {
          content: "",
          title: "",
          createUser: "",
          readStateStr: "",
          id: null
        }
      },
      data: {
        ids: []
      }
    };
  },
  components: {
    breadNav,
    UtilPrompt,
    pages
  },
  computed:{
      list () {
          return this.promptList.slice((this.currentNum - 1) * this.pageSize, this.currentNum * this.pageSize)
      },
  },
  methods: {
    ...mapMutations(["setData"]),
    pageChange(index) {
      this.currentPage = index;
    },
    handlePage(index) {
      this.currentNum = index;
    },
    // 查看详情
    showDetail(data) {
      let _this = this
      let options = {
        ids:data.id
      }
      if (data.readStateStr !== "已读") {
        _this.$http.post('/yx/u/api/account/read-message',options,{emulateJSON: true}).then(response=>{
          if(response.body.code == 0){
            _this.getMessage()
            _this.noReadMsg()
          }
        })
      }
      _this.msg.showList = data;
      _this.isShowDetail = true;
    },
    // 反选
    antiAll() {
      this.itemsd = [];
    },
    checkItem: function() {
      if (this.promptList.length == this.itemsd.length) {
        //判断每一个CheckBox是否选中   全选中让全选反选按钮选中
        this.isok = true;
      } else {
        // 不选中 让全选反选按钮不选中
        this.isok = false;
      }
    },
    // 全选
    selectAll() {
      this.promptList.forEach(function(fruit) {
        this.itemsd.push(fruit);
      }, this);
    },
    // 删除单个消息
    del(id) {
      this.isShowDetail = false;
      this.isShowUtil = true;
      this.delId.push(id);
      this.delId = this.delId.join(',')
      console.log(this.delId);
      
    },
    // 确定删除
    delMsg() {
      this.isShowUtil = false;
      this.isShowDetail = false;
      this.delMessage(this.delId);
    },
    // 取消
    cancel() {
      this.isShowUtil = false;
      this.delId = []
    },
    // 删除所选
    delSelect() {
      if (this.itemsd.length < 1) {
        this.$Modal.al_openLottery({
          status: "warning",
          content: "请选择要删除的消息！",
          time:3000
        });
      } else {
        for(let i = 0;i<this.itemsd.length;i++){
          this.delId.push(this.itemsd[i].userMessageId);
        }
        this.delId = this.delId.join(',')
        this.isShowUtil = true;
      }
    },
    // 请求删除消息
    delMessage(id) {
      let t = this;
      let options = {
        ids:id
      }
      this.$http
        .post("/yx/u/api/account/delete-message",options,{emulateJSON: true})
        .then(response => {
          t.isShowUtil = false;
          if (response.body.code == 0) {
            t.$Modal.al_openLottery({ status: "success", content: "消息删除成功！", time:3000 });
            t.getMessage();
            t.noReadMsg();
            t.delId = []
            t.itemsd=[]
          }else{
            t.$Modal.al_openLottery({status: "warning", content: response.body.message, time:3000 });
            t.getMessage();
          }
        });
    },
    // 请求所有的消息
    getMessage() {
      console.log('2111111');
      
      let t = this;
      this.$http
        .get("/yx/u/api/account/list-message?page=" + 0 + "&size=" + 50+'&_t='+new Date()).then(response => {
          let data = response.body;
          if(data.code ===0 ){
            t.totalCount = response.body.data.totalCount;
            let list = response.body.data.list;
            // t.promptList = response.body.data.list;
            
            for(let i =0;i<list.length;i++){
              list[i].title = list[i].title.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&nbsp;/g, ` `).replace(/&amp;/g,'').replace(/amp;/g,'').replace(/nbsp;/g,' ');
              list[i].content = list[i].content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, "'").replace(/&nbsp;/g, ` `).replace(/&amp;/g,'').replace(/amp;/g,'').replace(/nbsp;/g,' ');
            }
            t.promptList = list
            console.log(t.promptList);
            
          }
        });
    },
    //未读消息
    noReadMsg(){
      let _this = this;
      this.$http.get('/yx/u/api/account/list-system-message').then(res=>{
        let data = res.body;
        if(data.code === 0){
          console.log(data.data.length);
          _this.setData({key:'stationNoticeLen',value:data.data.length})
        }
      })
    }
  },
  created() {
    this.getMessage();
    // this.noReadMsg()
  },
  destroyed() {
  }
};
</script>
<style lang="less" scoped>
  @import "../less/global.less";
.warpper-con {
  width: 100%;
  height: 100%;
  margin-top: 0px;
  .warpper-form {
    width: 100%;
    height: 90%;
    .form-main {
      width: 100%;
      height: 100%;
      position: relative;
      .selBtns {
        overflow: hidden;
        padding: 15px;
        border-top: 1px solid @userColor_bor;
        label {
          display: inline-block;
          width: 70px;
          height: 24px;
          line-height: 22px;
          text-align: center;
          border: 1px solid @userColor_bor;
          border-radius: 25px;
          color: @themeColor;
          cursor: pointer;
          &:hover {
            background: @themeColor;
            color: #fff;
          }
          input {
            // visibility:hidden;
            display: none;
          }
        }
        .antiAll{
          border: 1px solid @userColor_bor;
          color: #333;
          &:hover {
            background: @themeColor;
            color: #fff;
          }
        }
        .selectAll {
          margin-right: 10px;
        }
        .selBtns-rgiht {
          span {
            display: inline-block;
            width: 70px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background: @themeColor;
            border-radius: 25px;
            color: #fff;
            cursor: pointer;
          }
        }
      }
      .msgMain {
        table {
          border: 1px solid @userColor_bor;
          width: 100%;
          tr {
            height: 40px;
            td {
              overflow: hidden;
              border: 1px solid @userColor_bor;
              input {
                vertical-align: middle;
                cursor: pointer;
              }
              span.check {
                cursor: pointer;
                position: absolute;
                left: 2%;
              }
              span.detail {
                cursor: pointer;
                margin-right: 40px;
                color: #2396f7;
                &:hover{
                  border-bottom: 1px solid @userColor_bor;
                }
              }
              span.del {
                color: @themeColor;
                cursor: pointer;
                &:hover{
                  border-bottom: 1px solid @userColor_bor;
                }
              }
            }
          }
          thead {
            tr {
              background: #f6f6f6;
              td {
                color: #333;
                font-size: 14px;
                height: 40px;
              }
            }
          }
        }
        .noNotice{
          display: flex;
          justify-content: center;
          align-items: center;
          height: 410px;
          div{
            i{
              color: #888;
              opacity: 0.4;
              font-size: 52px;
            }
            p{
              color: #888;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
  .pagesList {
    padding-right: 40px;
  }
  .utilMain {
    width: 300px;
    height: 150px;
    background: #fff;
    border-radius: 8px;
    .utilTitle {
      width: 100%;
      height: 40px;
      background: @themeColor;
      border-radius: 8px 8px 0 0;
      span {
        color: #fff;
        font-size: 16px;
        line-height: 40px;
        font-weight: bold;
      }
    }
    .utilTips {
      margin: 20px;
    }
    .utilBtns {
      width: 100%;
      span {
        display: inline-block;
        width: 70px;
        height: 30px;
        border-radius: 25px;
        line-height: 30px;
        text-align: center;
        background: #e3e3e3;
        cursor: pointer;
      }
      .sure {
        background: @themeColor;
        color: #fff;
        margin-left: 5px;
      }
    }
  }
  .utilMainDetail {
    width: 600px;
    height: 400px;
    background: #fff;
    border-radius: 8px;
    .detailTitle {
      width: 100%;
      height: 40px;
      background: @themeColor;
      border-radius: 8px 8px 0 0;
      span {
        color: #fff;
        font-size: 16px;
        line-height: 40px;
        font-weight: bold;
      }
    }
    .detailTips {
      padding: 20px 0 0 20px;
      div {
        text-align: left;
        span {
          display: inline-block;
          height: 30px;
          line-height: 30px;
          color: #333;
          font-size: 14px;
        }
        .detailLeft {
          width: 100px;
          text-align: right;
        }
        .detailCon {
          height: 200px;
          vertical-align: text-bottom;
        }
        .detailRight {
          display: inline-block;
          height: 30px;
          line-height: 30px;
          color: #333;
          font-size: 14px;
          width: 446px;
          text-align: left;
        }
        .detailContent {
          height: 200px;
          border: 1px solid @userColor_bor;
          overflow: hidden;
          overflow-y: auto;
        }
      }
    }
    .detailBtns {
      width: 100%;
      margin-top: 20px;
      span {
        display: inline-block;
        width: 100px;
        height: 30px;
        border-radius: 25px;
        line-height: 30px;
        text-align: center;
        background: #e3e3e3;
        cursor: pointer;
      }
      .sure {
        background: @themeColor;
        color: #fff;
        margin-left: 5px;
      }
    }
  }
}
</style>
