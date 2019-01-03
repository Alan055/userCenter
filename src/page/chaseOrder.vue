<template>
  <div class="chaseOrder">
    <div class="search">
      <div class="left">
        <div class="item">
          <span>{{select[0].label}} :</span>
          <Select v-model="select[0].value" class="status" @on-change="findGameType">
            <Option v-for="item,idx in select[0].arr" :value="item.value" :key="idx">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="item">
          <span>{{select[1].label}} :</span>
          <Select v-model="select[1].value" class="status">
            <Option v-for="item,idx in select[1].arr" :value="item.value" :key="idx">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="item">
          <span>{{select[2].label}} :</span>
          <Select v-model="select[2].value" class="status">
            <Option v-for="item,idx in select[2].arr" :value="item.value" :key="idx">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="item">
          <Input v-model="issue" placeholder="投注期数" class="issue"/>
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
          <span class="doSearch" @click="pagination_page=0,findData()">查询</span>
          <span class="reset" @click="reset()">重置</span>
        </div>
      </div>
    </div>
    <div class="money-info">
      <h5><img src="./img/ic_zijin.png" alt="">资金状态</h5>
      <div class="number">
        <div class="item">总金额：<span>{{statistics.betAmount}}</span>元</div>
        <div class="item">总奖金：<span>{{statistics.awardAmount}}</span>元</div>
      </div>
    </div>
    <div class="tableData">
      <ul class="top">
        <li v-for="(v,i) in table.top" :key="i">{{v}}</li>
      </ul>
      <ul v-for="(v,i) in table.content" :key="i" class="content">
        <li>{{v.billno}}</li>
        <li>{{v.lottery}}</li>
        <li>{{v.method}}</li>
        <li>{{v.startIssue}}</li>
        <li>{{v.clearCount+'/'+v.totalCount}}</li>
        <li>{{v.totalMoney.toFixed(4)}}</li>
        <li>{{v.winMoney.toFixed(4)}}</li>
        <li :class="{'orange':v.statusStr.includes('已完成'),'red':v.statusStr.includes('进行中')}">{{v.statusStr}}</li>
        <li>
          <span class="detail" @click="$Modal.al_chaseDetail(v.billno,'game-lottery/get-chase')">详情</span>
          <span class="back" v-if="v.allowCancel" @click="$Modal.withdraw(v,2)">撤单</span>
        </li>
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
              // {label: '全部', value: 'all'},
              {label: '彩票', value: 'lottery'},
              // {label: 'AG视讯', value: 'ag'},
              // {label: 'IM体育', value: 'im'},
              // {label: 'KY棋牌', value: 'ky'},
            ]
          },
          {label: '游戏类型', value: 'all', arr: []},
          {
            label: '状态', value: 'all', arr: [
              {label: '全部', value: 'all'},// 全部传空
              {label: '已完成', value: '0'},
              {label: '进行中', value: '1'},
              {label: '已取消', value: '2'},
            ]
          },
        ],
        // 游戏类型的所有数据  函数通过这个对象来计算出游戏类型下拉框的数据
        gameType: {
          lottery: [],
          // ag: [{label: '真人', value: 'real'}, {label: '电子', value: 'ele'},],
          // im: [{label: '体育', value: 'sport'}],
          // ky: [{label: '棋牌', value: 'chess'}],
        },
        statistics: {},
        // 查询的投注期号
        issue: '',
        date: [moment().add(0, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],// 当前选择的日期
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
          top: ['订单号', '彩种', '玩法', '开始期号', '已追/总期数', '总金额', '总奖金', '状态', '操作'],
          content: [],
        },
        load: false,// 是否出现正在加载中
        pagination_size: 10,// 一页的数据数
        pagination_total: 0,// 后台数据总数
        pagination_page: 0,// 当前页
        pagination_pageTotal: '',// 后台总共页数
      }
    },
    computed: {
      ...mapState(['initStatus_tableRecord', 'allLotteryList']),
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
      }
    },
    methods: {
      // 根据游戏种类的数据来计算出游戏类型下拉框的下拉内容
      findGameType(v) {
        let arr = []
        if (v === 'all') {// 不传入参数  说明是全部
          // arr = [].concat(this.gameType.lottery).concat(this.gameType.ag).concat(this.gameType.im).concat(this.gameType.ky)
          arr = [].concat(this.gameType.lottery)
        } else {
          arr = [].concat(this.gameType[v])
        }
        arr.length >= 2 && arr.unshift({label: '全部', value: 'all'});// 如果元素元素长度大于2，就在前面增加一个全部
        this.select[1].arr = arr;
        this.select[1].value = arr[0].value;
      },
      // 时间格式转换 --过滤器
      timeTransation(v) {
        return moment(v).format('YYYY-MM-DD HH:mm:ss')
      },
      statusTransation() {

      },
      // 分页点击时
      pagination_change(i) {
        //i是当前点击的页数，但我们后台是从0开始的  所以要减1
        this.pagination_page = i - 1
        console.log(this.pagination_page, i)
        this.findData()// 查询数据
      },
      // 选择快选时
      quickSelectFn(i) {
        this.date = [moment().add(-(i - 1), 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];// 当前选择的日期
      },
      // 数据请求  --整理数据
      findData() {
        let start = new Date(this.date[0]).getTime()
        let end = new Date(this.date[1]).getTime()
        let range = (end - start) / (24 * 3600 * 1000) + 1
        if (range > 30) {
          this.$Modal.al_default({status: 'warning', content: '查询的时间跨度不能超过30天'})
          return false
        }
        let url = 'game-lottery/search-chase'
        this.load = true;// 正在加载中--打开
        this.table.content = []
        let obj = {
          lottery: this.select[1].value,
          traceIssueStart: this.issue,
          status: this.select[2].value,
          sTime: moment(this.date[0]).format('YYYY-MM-DD') + " 00:00:00",
          eTime: moment(this.date[1]).format('YYYY-MM-DD') + " 23:59:59",
          page: this.pagination_page,
          size: this.pagination_size,
        }
        obj.status === 'all' && (obj.status = '');
        obj.lottery === 'all' && (obj.lottery = '');
        this.sendAjax(obj, url);// 发送ajax请求
      },
      // 发送请求
      sendAjax(obj, url) {
        service.post(this, url, obj).then(function (result) {
          this.load = false // 关闭正在加载
          let res = result.data
          if (res.code === 0) {
            this.pagination_total = res.data.totalCount// 总数据数量
            this.pagination_pageTotal = Math.ceil(res.data.totalCount / this.pagination_size)// 总页数
            this.table.content = res.data.list// 数据绑定
            this.statistics = res.data.statistics
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
        this.select[0].value = this.select[0].arr[0].value
        this.findGameType(this.select[0].arr[0].value)
        this.issue = '';// 输入框置空
        this.quickSelect = '';// 快选充值
        this.date = [moment().add(0, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];// 时间筛选还原
        this.findData()
      },
      init() {
        this.findGameType(this.select[0].arr[0].value)
        this.findData()
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

  .chaseOrder {
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
        justify-content: left;
        align-items: center;

        &:first-child {
          border-top: 1px solid @userColor_bor;
        }
        li {
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-right: 1px solid @userColor_bor;
          width: 25%;
          word-break: break-all;
          &:first-child {
            border-left: 1px solid @userColor_bor;
            width: 14.4%;
          }
          &:nth-child(2) {
            width: 12.7%
          }
          &:nth-child(3) {
            width: 11.1%
          }
          &:nth-child(4) {
            width: 11.1%
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
      padding: 10px 0;
      right: 20px;
      left: 20px;
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
