<template>
  <div class="fundsOrder">
    <div class="nav">
      <span v-for="(v,i) in nav" :key="i" :class="{'active':navIndex===i}"
            @click="clickNav(i)">{{v.label}}</span>
    </div>
    <div class="search">
      <div class="left">
        <span>{{text}}状态 : </span>
        <Select v-model="currentStatus" class="status" :disabled="navIndex===2" v-if="navIndex===0||navIndex===2">
          <Option v-for="item in statusArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="currentStatus" class="status" v-if="navIndex===1">
          <Option v-for="item in statusArr1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="currentStatus_active" class="status" v-if="navIndex===3">
          <Option v-for="item in statusArr_active" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="right clearfix">
        <div class="date">
          <span>{{text}}时间 : </span>
          <DatePicker type="daterange" @on-change="timeChange" :clearable="false" v-model="date" :options="dateLimit"
                      placement="bottom-end" placeholder="最多只能查询7天数据"
                      style="width: 200px"></DatePicker>
        </div>
        <div class="btn">
          <Select v-model="quickSelect" class="quickSelect" placeholder="快选" @on-change="quickSelectFn">
            <Option v-for="item in quickSelectArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <span class="doSearch" @click="pagination_page=0,table.content=[],findData(navIndex)">查询</span>
          <span class="reset" @click="reset()">重置</span>
        </div>
      </div>
    </div>
    <div class="money-info">
      <h5><img src="./img/ic_zijin.png" alt="">资金状态</h5>
      <div class="number" v-show="navIndex === 0">
        <div class="item">总申请额：<span>{{statistics.totalCash}}</span>元</div>
        <div class="item">充值成功额：<span>{{statistics.successCash}}</span>元</div>
        <div class="item">充值失败额：<span>{{statistics.failCash}}</span>元</div>
      </div>
      <div class="number" v-show="navIndex === 1">
        <div class="item">总申请额：<span>{{statistics.totalAmount}}</span>元</div>
        <div class="item">实际提现：<span>{{statistics.practicalAmount}}</span>元</div>
        <div class="item">手续费：<span>{{statistics.feeAmount}}</span>元</div>
      </div>
      <div class="number" v-show="navIndex === 2">
        <div class="item">转入钱包：<span>{{statistics.sobetAmount}}</span>元</div>
        <div class="item">转入AG：<span>{{statistics.aginAmount}}</span>元</div>
        <div class="item">转入IM：<span>{{statistics.imAmount}}</span>元</div>
        <div class="item">转入KY：<span>{{statistics.kyAmount}}</span>元</div>
      </div>
      <div class="number" v-show="navIndex === 3">
        <div class="item">总申请额：<span>{{statistics.totalAmount}}</span>元</div>
        <div class="item">成功金额：<span>{{statistics.successAmount}}</span>元</div>
        <div class="item">待处理：<span>{{statistics.pendingAmount}}</span>元</div>
        <div class="item">拒绝金额：<span>{{statistics.refuseAmount}}</span>元</div>
      </div>
    </div>
    <div class="tableData">
      <ul class="top">
        <li v-for="(v,i) in table.top[navIndex]" :key="i">{{v}}</li>
      </ul>
      <ul v-for="(v,i) in table.content" :key="i" class="content">
        <li v-if="navIndex<=1">{{v.billno}}</li>
        <li v-if="navIndex==2">{{v.spsn}}</li>
        <li v-if="navIndex==3">{{v.title}}</li>
        <li v-if="navIndex===2" class="wallet">
          <span>{{v.note.replace(/从/,'').split(/转入到/)[0]}}</span><em class="icon_v3">&#xe604;</em><span>{{v.note.replace(/从/,'').split(/转入到/)[1]}}</span>
        </li>
        <li v-if="navIndex===0">{{v.channelName}}</li>
        <li>¥{{Number(navIndex===3?v.award:v.amount).toFixed(2)}}</li>
        <li v-if="navIndex===1">{{v.actualAmount?('¥'+Number(v.amount-v.actualAmount).toFixed(2)):''}}</li>
        <li v-if="navIndex===1">{{v.actualAmount?('¥'+Number(v.actualAmount).toFixed(2)):''}}</li>
        <li v-if="navIndex<=1">{{timeTransation(v.orderTime)}}</li>
        <li v-if="navIndex===2">{{timeTransation(v.createTime)}}</li>
        <li v-if="navIndex===3">{{v.receiveTime}}</li>
        <li v-if="navIndex==0">{{statusTransation(v.orderStatus)}}</li>
        <li v-if="navIndex==1">{{statusTransation(v.orderStatus)}}</li>
        <li v-if="navIndex==2">成功</li>
        <li v-if="navIndex==3">{{v.drawStatusStr}}</li>
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

  export default {
    data() {
      return {
        nav: [ // 导航栏
          {label: '充值记录', value: '', url: 'account/search-recharge'},
          {label: '提现记录', value: '', url: 'account/search-withdraw'},
          {label: '转账记录', value: '99', url: 'account/search-zbrecord'},
          {label: '活动', value: '90', url: 'account/activity-Record'},
        ],
        navIndex: 0,// 当前选中的导航栏下标
        currentStatus: '0',// 当前选中的状态
        statusArr: [ // 状态选择
		      {label: '全部', value: '0'},
		      {label: '成功', value: '1'},
		      {label: '失败', value: '2'},
		      {label: '待处理', value: '3'},
		      {label: '已取消', value: '4'},
	      ],
        statusArr1: [ // 状态选择
		      {label: '全部', value: '0'},
		      {label: '成功', value: '1'},
		      {label: '失败', value: '2'},
		      {label: '待处理', value: '3'},
		      // {label: '已取消', value: '4'},
	      ],
        currentStatus_active: '0',// 当前选中的导航栏下标-活动
        statusArr_active: [ // 状态选择
          {label: '全部', value: '0'},
          {label: '成功', value: '1'},
          {label: '失败', value: '2'},
          {label: '领取中', value: '3'},
        ],
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
          top: [
            ['订单号', '充值方式', '充值金额', '充值日期', '状态'],
            ['订单号', '申请金额', '手续费', '实际提现', '申请日期', '状态'],
            ['订单号', '转账类型', '转账金额', '转账日期', '状态'],
            ['活动名称', '活动金额', '时间', '状态'],
          ],
          content: [],
        },
        statistics: {},
        load: false,// 是否出现正在加载中
        pagination_size: 10,// 一页的数据数
        pagination_total: 0,// 后台数据总数
        pagination_page: 0,// 当前页
        pagination_pageTotal: '',// 后台总共页数
      }
    },
    computed: {
      // 选择状态和选择时间的前面的两个字
      text() {
        return this.nav[this.navIndex].label.substr(0, 2)
      }
    },
    watch: {},
    methods: {
      // 后台传回来的状态转换  --过滤器
      statusTransation(i) {
        switch (i) {
          case 0:
            return '成功';
          case 6:
          case 7:
          case 2:
            return '失败';
          case 8:
            return '已取消';
          default :
            return '待处理'
        }
      },
      // 充值方式 --过滤器
      rechargeMethod(i) {
        switch (i) {
          case 0:
            return '网银充值';
          case 1:
            return '转账汇款';
          case 2:
            return '';// 这个没有
          case 3:
            return '系统充值';
          case 4:
            return '微信充值';
          default :
            return '';
        }
      },
      // 时间格式转换 --过滤器
      timeTransation(v) {
        return moment(v).format('YYYY-MM-DD HH:mm:ss')
      },
      // 选择快选时
      quickSelectFn(i) {
        this.date = [moment().add(-(i - 1), 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];// 当前选择的日期
      },
      clickNav(i) {

        this.navIndex !== i && (this.navIndex = i, this.table.content = []);
        // this.navIndex > 0 && (this.currentStatus = '0');
	      this.currentStatus = '0'
        this.quickSelect = '';
        this.date = [moment().add(0, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];// 当前选择的日期还原
        this.findData(this.navIndex)
      },
      // 分页点击时
      pagination_change(i) {
        //i是当前点击的页数，但我们后台是从0开始的  所以要减1
        this.pagination_page = i - 1
        this.findData(this.navIndex)// 查询数据
      },
      // 数据请求  --整理数据
      findData(i) {
        let start = new Date(this.date[0]).getTime()
        let end = new Date(this.date[1]).getTime()
        let range = (end - start) / (24 * 3600 * 1000) + 1
        let str = ''
        switch (this.navIndex) {
          case 0:
          case 1:
            str = range > 15 ? '查询的时间跨度不能超过15天' : '';
            break
          case 2:
          case 3:
            str = range > 30 ? '查询的时间跨度不能超过30天' : '';
            break
        }
        if (str) {
          this.$Modal.al_default({status: 'warning', content: str})
          return false
        }
        this.load = true;// 正在加载中--打开
        let url = this.nav[i].url;
        if (!url || !this.date[0]) { // 如果url没有  或者时间没有选择就不请求
          this.load = false;// 正在加载中-- 关闭
          return
        }
        let obj = {
          sTime: moment(this.date[0]).format('YYYY-MM-DD') + " 00:00:00",
          eTime: moment(this.date[1]).format('YYYY-MM-DD') + " 23:59:59",
          page: this.pagination_page,
          size: this.pagination_size,
        }
        // 转账记录要加这个字段
        if (this.navIndex === 2) {
          obj.zbType = this.nav[this.navIndex].value //第三方平台转账
          obj.accountType = ''
        } else if (this.navIndex === 3) {
          obj.status = this.currentStatus_active // 使用活动的下拉数据
        } else {
          obj.status = this.currentStatus// 是否非活动的数据
          obj.billon = ''
        }
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
            this.table.content = res.data.list   // 数据绑定
            this.statistics = res.data.statistics
          } else {
            this.$Modal.al_default({status: 'warning', content: res.message})
          }
        }, function (err) {
          this.load = false // 关闭正在加载
          console.log(err)
        })
      },
      // 数据清空
      reset() {
        this.currentStatus = this.statusArr[0].value;// 状态设置成全部
        this.currentStatus_active = this.statusArr_active[0].value;// 状态设置成全部
        this.quickSelect = '';// 快选充值
        this.date = [moment().add(0, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];// 当前选择的日期还原
        this.init();
      },
      init() {
        this.findData(this.navIndex)// 请求数据
      },
      timeChange(val) {
        console.log(val)
      }
    },
    created() {
      this.init();
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

  .fundsOrder {
    height: inherit;
    position: relative;
    .nav {
      display: flex;
      height: 30px;
      justify-content: left;
      .bor(@userColor_bor);
      width: fit-content;
      border-radius: 4px;
      background: #f5f5f5;
      span {
        display: flex;
        width: 80px;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        border-right: 1px solid @userColor_bor;
        &:last-child {
          border-right: none;
        }
        &.active {
          background: @themeColor;
          color: #fff;
        }
      }
    }
    .search {
      /*display: flex;*/
      /*justify-content: space-between;*/
      height: 70px;
      margin: 17px 0;
      color: #666;
      .left {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        font-size: 14px;
        >span{
          margin-right: 5px;
        }
        .status {
          width: 70px;
          margin-left: 4px;
        }
      }
      .right {
        justify-content: right;
        align-items: center;
        .date {
          display: inline-block;
          float: left;
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
          > span {
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
      width: 100%;
      position: relative;
      ul {
        border-bottom: 1px solid @userColor_bor;
        display: flex;
        justify-content: space-between;
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
          &:first-child {
            border-left: 1px solid @userColor_bor;
            width: 30%;
          }
        }
        .wallet {
          display: flex;
          justify-content: center;
          span {
            width: 40%;
          }
          em {
            width: 20%;
            font-size: 20px;
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
      bottom: -50px;
      padding: 10px 0;
      right: 0px;
      left: 0px;
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
























