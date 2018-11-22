<template>
  <div class="betOrder">
    <div class="search">
      <div class="left">
        <div class="item">
          <span>{{select[0].label}} :</span>
          <Select v-model="select[0].value" class="status" @on-change="findGameType"
                  v-if="select&&select.length>0&&select[0].arr&&select[0].arr.length>0">
            <Option v-for="item,idx in select[0].arr" :value="item.value" :key="idx">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="item">
          <span>{{select[1].label}} :</span>
          <Select v-model="select[1].value" class="status" @on-change="findOneData" v-if="select[1].arr.length">
            <Option v-for="item,idx in select[1].arr" :value="item.value" :key="idx">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="item">
          <span>{{select[2].label}} :</span>
          <Select v-model="select[2].value" class="status" :disabled="statusDisable">
            <Option v-for="item,idx in select[2].arr" :value="item.value" :key="idx">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="item">
          <Input v-model="issue" placeholder="投注期数" class="issue" :disabled="issueDisable"/>
        </div>
      </div>
      <div class="right">
        <div class="date">
          <!--<span>{{text}}时间 : </span>-->
          <DatePicker type="daterange" :clearable="false" v-model="date" :options="dateLimit"
                      placement="bottom-end" placeholder="最多只能查询7天数据"
                      style="width: 200px"></DatePicker>
        </div>
        <div class="btn">
          <Select v-model="quickSelect" class="quickSelect" placeholder="快选" @on-change="quickSelectFn">
            <Option v-for="item in quickSelectArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <span class="doSearch"
                @click="!(select[0].value.search(/vr|all/)>-1&&select[1].value==='all')&&(pagination_page=0,table.content=[],findData())"
                :class="{'noClick':(select[0].value.search(/vr|all/)>-1&&select[1].value==='all')}">查询</span>
          <span class="reset" @click="reset()">重置</span>
        </div>
      </div>
    </div>
    <div class="money-info">
      <h5><img src="./img/ic_zijin.png" alt="">资金状态</h5>
      <div class="number">
        <div class="item">总投注额：<span>{{statistics?statistics.betAmount:''}}</span>元</div>
        <div class="item">有效投注额：<span>{{statistics?statistics.confirmAmount:''}}</span>元</div>
        <div class="item">奖金额：<span>{{statistics?statistics.awardAmount:''}}</span>元</div>
      </div>
    </div>
    <div class="tableData" :class="{'lotteryData':table.top[0]==='订单号'}">
      <ul class="top">
        <li v-for="(v,i) in table.top" :key="i">{{v}}</li>
      </ul>
      <ul v-for="(v,i) in table.content" :key="i" class="content" v-if="table.top[0]==='订单号'">
        <li>{{v.billno}}</li>
        <li>{{v.issue}}</li>
        <li>{{v.lottery}}</li>
        <li>{{v.method}}</li>
        <li>{{timeTransation(v.orderTime)}}</li>
        <li>{{v.money?v.money.toFixed(4):''}}</li>
        <li>{{v.winMoney?v.winMoney.toFixed(4):'0.0000'}}</li>
        <li :class="{'orange':v.status===2,'red':v.status===0}">{{v.statusRemark}}</li>
        <li>
          <span class="detail" @click="$Modal.al_orderDetail(v.billno,'game-lottery/get-order')">详情</span>
          <span class="back" v-if="v.allowCancel" @click="$Modal.withdraw(v,1)">撤单</span>
        </li>
      </ul>
      <!--<ul v-if="table.content.length>0&&table.top[0]==='订单号'" class="subtotal">-->
      <!--<li>小计：¥{{subtotal}}</li>-->
      <!--</ul>-->
      <!--<ul v-if="table.content.length>0&&table.top[0]==='订单号'" class="total">-->
      <!--<li>总计：¥{{table.total.toFixed(4)}}</li>-->
      <!--</ul>-->
      <ul v-for="(v,i) in table.content" :key="i" class="content" v-if="table.top[0]==='用户名'">
        <li>{{v.userName}}</li>
        <li>{{v.gameName}}</li>
        <li>{{timeTransation1(v.date)}}</li>
        <li>{{v.transferInAmount}}</li>
        <li>{{v.transferOutAmount}}</li>
        <li>¥{{v.confirmAmount}}</li>
        <li>¥{{v.awardAmount!=undefined?v.awardAmount.toFixed(4):'0.0000'}}</li>
        <li>¥{{v.profitAmount}}</li>
      </ul>
      <div class="loading" v-if="table.content.length===0&&load"><em class="icon_v3">&#xe6d6;</em>正在加载中</div>
      <div class="noData" v-if="table.content.length===0&&!load">
        <div class="picture"><em class="icon_v3">&#xe6a5;</em></div>
        <div class="txt">暂无数据</div>
      </div>
    </div>
    <div class="tableBottom" v-show="table.content.length>0">
      <span class="total">记录总数：<span>{{pagination_total}}</span>，页数：<span>{{pagination_page+1}}</span>/<span>{{pagination_pageTotal}}</span></span>
      <Page class="table_pagination" @on-change="pagination_change" :total="pagination_total" show-elevator
            :page-size="pagination_size"></Page>
    </div>
  </div>
</template>

<script>
  import service from "@/js/service.js";
  import {mapState, mapMutations, mapActions} from 'vuex';

  export default {
    data() {
      return {
        // 三个下拉框的数据结构  --其中第二个是动态生成的  有一个函数控制
        select: [
          {
            label: '游戏种类', value: 'lottery', arr: [
              {label: '彩票', value: 'lottery', url: 'game-lottery/search-order',},
              {label: 'AG视讯', value: 'ag', url: 'report/agin-report',},
              {label: 'IM体育', value: 'im', url: 'report/im-report',},
              {label: 'KY棋牌', value: 'ky', url: 'report/ky-report',},
              {label: 'VR游戏', value: 'vr', url: '',},
            ]
          },
          {label: '游戏类型', value: 'all', arr: []},
          {
            label: '状态', value: 'all', arr: [
              {label: '全部', value: 'all'},// 全部传空
              {label: '已派奖', value: '2'},
              {label: '未开奖', value: '0'},
              {label: '未中奖', value: '1'},
              {label: '已撤销', value: '4'},
              {label: '系统撤销', value: '5'},
            ]
          },
        ],
        currentOne: '',// 当前选中的1级下拉框数据  这个不展示出来  只是在点击二级时  去查到所在的一级数据  用来判断是哪个接口  哪个类型  来分类
        // 游戏类型的所有数据  函数通过这个对象来计算出游戏类型下拉框的数据
        gameType: {
          lottery: [],
          ag: [],
          im: [],
          ky: [],
          vr: [
            {label: 'VR金星1.5分彩', value: '1', url: 'game/vr/order'},// game/vr/order
            {label: '天彩VR', value: '2', url: 'report/tcg-report'},// 这个的接口是/yx/u/api/report/tcg-report  参数betDateBegin betDateEnd page size
          ],
        },
        statistics: {},
        // 查询的投注期号
        issue: '',
        date: [moment().add(-0, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],// 当前选择的日期
        dateLimit: {// 控制时间选择器的可选时间长度
          disabledDate(date) {
            return date && (date.valueOf() > Date.now());
          }
        },
        // 快选
        quickSelectArr: [
          {label: '今日', value: '1'},
          {label: '三日', value: '3'},
          {label: '七日', value: '7'},
        ],
        quickSelect: '',// 当前选中的数据
        // 表格数据
        table: {
          top: ['订单号', '期号', '彩种', '玩法', '下单时间', '投注金额', '奖金', '状态', '操作'],
          content: [],
          total: 0,
        },
        top: [
          ['订单号', '期号', '彩种', '玩法', '下单时间', '投注金额', '奖金', '状态', '操作'],
          ['用户名', '玩法', '下单时间', '转入', '转出', '有效投注', '中奖', '盈亏'],
        ],
        load: false,// 是否出现正在加载中
        pagination_size: 10,// 一页的数据数
        pagination_total: 0,// 后台数据总数
        pagination_page: 0,// 当前页
        pagination_pageTotal: '',// 后台总共页数

        dateDisable: false,// 日期是否禁止选择
        issueDisable: false,// 期号是否禁止选择
        statusDisable: false,// 状态是否禁止选择
      }
    },
    computed: {
      ...mapState(['initStatus_tableRecord', 'allLotteryList']),
      subtotal() {
        let total = 0;
        for (let val of this.table.content) {
          total += val.money
        }
        return total.toFixed(4)
      }
    },
    watch: {
      initStatus_tableRecord() {
        this.findData()
      },
      allLotteryList() {
        for (let val of this.allLotteryList) {
          this.gameType.lottery.push({label: val.showName, value: val.code})
        }
        this.init();
      },
      currentOne: {
        deep: true,
        handler: function (aft) {
          let name = this.currentOne.value;
          console.log(name)
          if (name === 'lottery') {
            this.statusDisable = false;// 状态是否禁止选择
            this.issueDisable = false;// 期号是否禁止选择
            this.dateDisable = false;// 日期是否禁止选择
          } else if (name.search(/ag|im|ky/) > -1) {
            this.statusDisable = true;// 状态是否禁止选择
            this.dateDisable = false;// 日期是否禁止选择
            this.issueDisable = true;// 期号是否禁止选择
          } else if (name === 'vr') {
            // 这个暂时不用处理  因为要监听到是哪个vr的类型
            this.statusDisable = false;// 状态是否禁止选择
          }
        }
      }
    },
    methods: {
      // 根据游戏种类的数据来计算出游戏类型下拉框的下拉内容
      findGameType(v) {
        let arr = []
        if (v === 'all') {// 不传入参数  说明是全部
          for (let key in this.gameType) {
            arr = arr.concat(this.gameType[key])
          }
          // arr = [].concat(this.gameType.lottery).concat(this.gameType.ag).concat(this.gameType.im).concat(this.gameType.ky)
        } else {
          arr = [].concat(this.gameType[v])
        }
        arr.length >= 2 && v !== 'vr' && arr.unshift({label: '全部', value: 'all'});// 如果元素元素长度大于2，就在前面增加一个全部
	      this.select[1].arr = []
        // 上下两步的操作是为了让下拉框初始化，不然下拉框会记住上次选中的数据
        this.$nextTick(function () {
	        this.select[1].arr = arr;
	        this.select[1].value = arr[0].value;
	        this.currentOne = this.select[0].arr.find(e => (e.value === v)) // 获取到点击的一级数据类型
	        this.findData()
        }.bind(this))

      },
      // 时间格式转换 --过滤器
      timeTransation(v) {
        return moment(v).format('YYYY-MM-DD HH:mm:ss')
      },
      timeTransation1(v) {
        return moment(v).format('YYYY-MM-DD')
      },
      statusTransation() {

      },
      // 选择快选时
      quickSelectFn(i) {
        this.date = [moment().add(-(i - 1), 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];// 当前选择的日期
      },
      // 分页点击时
      pagination_change(i) {
        //i是当前点击的页数，但我们后台是从0开始的  所以要减1
        this.pagination_page = i - 1
        this.findData()// 查询数据
      },
      // 获取第三方游戏的下拉选项数据
      findThridSelect() {
        let p = [service.post(this, 'report/get-game-type', {gameType: 'agin'}), service.post(this, 'report/get-game-type', {gameType: 'im'}), service.post(this, 'report/get-game-type', {gameType: 'ky'})]
        let that = this;
        Promise.all(p).then(function (result) {
          let i = 0;
          for (let val of result) {
            let res = val.data
            if (res.code === 0) {
              let key = i === 0 ? 'ag' : i === 1 ? 'im' : 'ky';
              if (res.data.length > 0) {// 有数据就绑定数据
                for (let v of res.data) {
                  that.gameType[key].push({label: v.value, value: v.key})
                }
              } else {// 没有数据（im）就把大类丢进去  不然就没下级菜单
                let obj = that.select[0].arr.find(e => (e.value === key))
                that.gameType[key].push(obj)
              }
            } else {
              console.log(res.message)// 这里不能三个一起打印出来  会造成页面混乱的
            }
            i++
          }
          that.findGameType(that.select[0].arr[0].value) // 处理一级和二级下拉数据
        }).catch(function (err) {
          console.log(err)
        })

      },
      // 通过二级菜单去寻找一级菜单  但一级是全部的时候  直接去点击二级  这个时候需要手动查一下一级的数据
      findOneData(v) {
        if (this.select[0].value === 'all') {
          for (let key in this.gameType) {
            let obj = this.gameType[key].find(e => (e.value === v))
            if (obj) {
              this.currentOne = Object.assign({}, this.select[0].arr.find(e => (e.value === key)))
              break
            }
          }
        }
        // 如果点击的是vr  就将相关的搜索条件关闭
        if (this.currentOne.value === 'vr') {
          // VR金星1.5分彩
          v === '1' && (this.dateDisable = false, this.issueDisable = false, this.statusDisable = false)
          // 天彩VR
          v === '2' && (this.dateDisable = false, this.issueDisable = true, this.statusDisable = true)
        }
      },
      // 数据请求  --整理数据
      findData() {
        let start = new Date(this.date[0]).getTime()
        let end = new Date(this.date[1]).getTime()
        let range = (end - start) / (24 * 3600 * 1000) + 1
        if (range > 7) {
          this.$Modal.al_default({status: 'warning', content: '查询的时间跨度不能超过7天'})
          return false
        }
        // 拿到url vr的是在第二层里面
        let url = this.currentOne.url
        // let currentType = null // 这个用来装vr 没有就不用
        if (!url) {// 如果没有拿到url  就说明是vr  vr的在下级
          // currentType
          url = this.gameType.vr.find(e => (e.value === this.select[1].value)).url
        }
        this.load = true;// 正在加载中--打开
        let obj = null;
        let currentTwo = this.select[1];
        switch (this.currentOne.value) {
          case 'lottery':
            this.table.top = this.top[0]; //设置表头
            obj = {
              lottery: currentTwo.value === 'all' ? '' : currentTwo.value,
              status: this.select[2].value === 'all' ? '' : this.select[2].value,
              sTime: moment(this.date[0]).format('YYYY-MM-DD') + " 00:00:00",
              eTime: moment(this.date[1]).format('YYYY-MM-DD') + " 23:59:59",
            }
            this.issue && (obj.issue = this.issue)// 期号
            break;
          case 'ag':
          case 'im':
          case 'ky':
            this.table.top = this.top[1]; //设置表头
            obj = {
              gameType: currentTwo.value === 'all' || currentTwo.arr.length === 1 ? '' : currentTwo.value,
              betDateBegin: moment(this.date[0]).format('YYYY-MM-DD') + " 00:00:00",
              betDateEnd: moment(this.date[1]).format('YYYY-MM-DD') + " 23:59:59",
            }
            break;
          case 'vr':

            // 这里需要特殊处理一下
            if (currentTwo.value === '1') {// VR金星1.5分彩
              this.table.top = this.top[0]; //设置表头
              obj = {
                vr: currentTwo.value,
                lottery: 'VR',
                state: this.select[2].value === 'all' ? '' : this.select[2].value,
                sTime: moment(this.date[0]).format('YYYY-MM-DD') + " 00:00:00",
                eTime: moment(this.date[1]).format('YYYY-MM-DD') + " 23:59:59",
              }
            } else {// 天彩VR
              this.table.top = this.top[1]; //设置表头
              obj = {
                betDateBegin: moment(this.date[0]).format('YYYY-MM-DD') + " 00:00:00",
                betDateEnd: moment(this.date[1]).format('YYYY-MM-DD') + " 23:59:59",
              }
            }
            break;
          default :
            break;
        }
        obj.page = this.pagination_page
        obj.size = this.pagination_size
        console.log(obj)
        this.issue && (obj.issue = this.issue);// 有就加  没有就不发这个字段
        this.sendAjax(obj, url);// 发送ajax请求
      },
      // 发送请求查询
      sendAjax(obj, url) {
        service.post(this, url, obj).then(function (result) {
          this.load = false // 关闭正在加载
          let res = result.data
          if (res.code === 0) {
            this.pagination_total = res.data.totalCount// 总数据数量
            this.pagination_pageTotal = Math.ceil(res.data.totalCount / this.pagination_size)// 总页数
            this.statistics = res.data.statistics
            // 数据整理
            if (this.currentOne.value.search(/ag|im|ky/) > -1) {

            } else if (this.currentOne.value.search(/vr/) > -1) {

            }
            this.table.content = res.data.list// 数据绑定
          } else {
            this.$Modal.al_default({status: 'warning', content: res.message})
          }
        }, function (err) {
          this.load = false // 关闭正在加载
          console.log(err)
        })

      },
      // 重置
      reset() {
        // 三个下拉设置成全部
        for (let val of this.select) {
          val.value = 'all'
        }
        this.select[0].value = 'lottery'// 游戏种类设置成彩票
        this.issue = '';// 输入框置空
        this.quickSelect = '';// 快选置空
        this.date = [moment().add(-0, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];// 时间筛选还原
        this.currentOne = this.select[0].arr[0]
        this.init();
        // this.findGameType(this.select[0].arr[0].value)
      },
      init() {
        this.findThridSelect()// 先去请求第三方的下拉数据  请求完了再去处理一级和二级下拉数据
      }
    },
    created() {
      if (!this.allLotteryList.length) return
      for (let val of this.allLotteryList) {
        this.gameType.lottery.push({label: val.showName, value: val.code})
      }
      this.init()
    },
    mounted() {
    },
  }
</script>

<style lang='less' scoped>
  @import "../less/global.less";

  @keyframes transitionSelf {
    0% {
      transform: rotate(0deg)
    }
    100% {
      transform: rotate(360deg)
    }
  }

  .betOrder {
    height: inherit;
    .search {
      /*display: flex;*/
      /*justify-content: space-between;*/
      height: 70px;
      margin-bottom: 17px;
      color: #666;
      .left {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-bottom: 10px;
        .item {
          margin-left: 5px;
          .status {
            width: 75px;
            margin-left: 5px;
          }
          .issue {
            width: 100px;
            margin-left: 10px;
          }
          &:nth-child(2) {
            .status {
              width: 120px;
            }
          }
        }

      }
      .right {
        display: flex;
        justify-content: left;
        align-items: center;
        .date {
          display: flex;
          align-items: center;
          > span {
            font-size: 14px;
            margin-right: 5px;
          }
        }
        .btn {
          display: flex;
          align-items: center;
          padding-left: 10px;
          .quickSelect {
            width: 70px;
          }
          span {
            cursor: pointer;
          }
          .doSearch {
            width: 60px;
            height: 24px;
            border-radius: 12px;
            color: #fff;
            background: @themeColor;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 10px;
            margin-right: 10px;
            &.noClick {
              background: #ccc;
              cursor: not-allowed;
            }
          }
          .reset {

          }
        }
      }
    }
    .money-info {
      text-align: left;
      font-size: 0;
      line-height: 1;
      border: 1px solid @userColor_bor;
      margin-bottom: 16px;
      h5 {
        font-size: 16px;
        background: #f6f6f6;
        line-height: 26px;
        border-bottom: 1px solid @userColor_bor;
        img {
          vertical-align: middle;
          margin: 0 8px 0 10px;
          position: relative;
          top: -2px;
        }
      }
      .number {
        height: 40px;
        background-color: #fff;
        .item {
          display: inline-block;
          vertical-align: top;
          font-size: 14px;
          color: #666666;
          line-height: 40px;
          margin: 0 22px;
          position: relative;
          &:before {
            content: '';
            position: absolute;
            top: 50%;
            right: -22px;
            height: 20px;
            margin-top: -10px;
            border-left: 1px dashed @userColor_bor;
          }
          &:first-child {
            margin-left: 12px;
          }
          &:last-child {
            margin-right: 0px;
            &:before {
              display: none;
            }
          }
          span {
            color: #f53b4a;
          }
        }
      }
    }
    .tableData {
      position: relative;
      width: 100%;
      height: calc(~"100% - 112px");
      ul {
        border-bottom: 1px solid @userColor_bor;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:first-child {
          border-top: 1px solid @userColor_bor;
        }
        li {
          height: 36px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-right: 1px solid @userColor_bor;
          width: 25%;
          &:first-child {
            border-left: 1px solid @userColor_bor;
            /*width: 19.4%;*/
          }
          /*&:nth-child(2) {*/
          /*width: 7.7%*/
          /*}*/
          /*&:nth-child(3) {*/
          /*width: 11.1%*/
          /*}*/
          /*&:nth-child(4) {*/
          /*width: 11.1%*/
          /*}*/
          /*&:nth-child(5) {*/
          /*width: 15%*/
          /*}*/
          /*&:nth-child(6) {*/
          /*width: 8%*/
          /*}*/
          /*&:nth-child(7) {*/
          /*width: 9%*/
          /*}*/
          /*&:nth-child(8) {*/
          /*width: 8%*/
          /*}*/
          /*&:nth-child(9) {*/
          /*width: 10.7%*/
          /*}*/
        }
        &.subtotal, &.total {
          li {
            width: 100% !important;
          }
        }
        &.total {
          color: @themeColor;
        }
      }
      &.lotteryData {
        background: transparent;
        ul {
          li {
            word-break: break-all;
            &:first-child {
              border-left: 1px solid @userColor_bor;
              width: 19.4%;
            }
            &:nth-child(2) {
              width: 11.1%
            }
            &:nth-child(3) {
              width: 11.1%
            }
            &:nth-child(4) {
              width: 11.7%
            }
            &:nth-child(5) {
              width: 15%
            }
            &:nth-child(6) {
              width: 8%
            }
            &:nth-child(7) {
              width: 9%
            }
            &:nth-child(8) {
              width: 8%
            }
            &:nth-child(9) {
              width: 10.7%
            }
          }
        }
      }
      .top {
        font-size: 14px;
        background: #f6f6f6;
        color: #333;
      }
      .content {
        color: #666;
        font-size: 12px;
        li:first-child {
          color: @themeColor;
        }
        .orange {
          color: #ff7200;
        }
        .red {
          color: @themeColor;
        }
        .detail {
          color: @themeColor_Sec;
          cursor: pointer;
        }
        .back {
          color: @themeColor;
          margin-left: 5px;
          cursor: pointer;
        }
      }
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(~"100% - 40px");
        font-size: 14px;
        color: #888;
        em {
          color: #CFCFCF;
          font-size: 24px;
          animation: transitionSelf 0.7s linear infinite;
          margin-right: 8px;
        }
      }
      .noData {
        height: calc(~"100% - 40px");
        display: flex;
        flex-direction: column;
        justify-content: center;
        .picture {
          em {
            color: #888;
            opacity: 0.4;
            font-size: 52px;
          }
        }
        .txt {
          color: #888;
          font-size: 16px;
        }
      }
    }
    .tableBottom {
      position: absolute;
      bottom: 0px;
      right: 20px;
      left: 20px;
      padding: 10px 0;
      border: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .total {
        span {
          color: @themeColor;
        }
      }
      .table_pagination {
        border: none;
      }
    }
  }
</style>
