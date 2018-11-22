<template>
  <div class="alanModal">
    <!--//基础弹框-->
    <Modal v-model="defaultModal" class="defaultModal" width="500px" :closable="false" :mask-closable="false"
           class-name="vertical-center-modal">
      <div class="defaultModal_content" :class="{
      'success':defaultModalContent.status==='success',
      'warning':defaultModalContent.status==='warning',
      'confim':defaultModalContent.status==='confim',
      }" v-html="defaultModalContent.content">
      </div>

      <div class="defaultModal_bottom">
        <span v-if="defaultModalContent.status!=='confim'"
              @click="setData({key: 'defaultModal', value: false});defaultModalContent.onOk&&defaultModalContent.onOk()">关闭</span>
        <span v-if="defaultModalContent.status==='confim'" class="cancel"
              @click="setData({key: 'defaultModal', value: false});defaultModalContent.onCancel&&defaultModalContent.onCancel()">取消</span>
        <span v-if="defaultModalContent.status==='confim'" class="ok"
              @click="setData({key: 'defaultModal', value: false});defaultModalContent.onOk(defaultModalContent.content)">确认</span>
      </div>
    </Modal>

    <!--开奖弹框   这个和基础弹框是一样的 但是不能和基础弹框重复  因为开奖时会自动关闭 如果重复了就会关闭掉其他的-->
    <Modal v-model="openLotteryModal" class="defaultModal openLotteryModal" width="500px" :closable="false"
           :mask-closable="false"
           class-name="vertical-center-modal"
    >
      <div class="defaultModal_content" :class="{
      'success':openLottery.status==='success',
      'warning':openLottery.status==='warning'
      }" v-html="openLottery.content">
      </div>
      <div class="defaultModal_bottom">
        <span @click="setData({key: 'openLotteryModal', value: false});openScroll()">关闭</span>
      </div>
    </Modal>

    <!--中奖推送-->
    <Modal v-model="winningModal" class="winningModal" width="800px"
           :closable="false"
           :mask-closable="false"
           class-name="vertical-center-modal"
    >
      <div class="winningModal_content">
        <p class="title">恭喜您！</p>
        <div class="content" v-html="winningContent.content"></div>
      </div>
      <div class="winningModal_bottom">
        <span class="cancel"
              @click="cancelWinning(winningContent)">取消({{timeCount}})</span>
        <span class="ok"
              @click="okWinning(winningContent)">继续投注</span>
      </div>
    </Modal>

    <!--时时彩专属开奖号码的弹框-->
    <Modal v-model="ssc_openLotteryAnimation" class="ssc_animation" width="800px" :closable="false"
           :class="{'Narrow':sscNarrow}"
           :mask-closable="false">
      <div class="ssc_animation_content" v-if="ssc_openLotteryAnimation">
        <div class="ssc_video">
          <video loop="loop" autoplay src="/static/img/lottery/ssc_openVideo.mp4"></video>
        </div>
        <div class="openCode">
          <div class="ballBox" v-if="sscDataModal.openCode">
            <span v-for="(v,i) in sscDataModal.openCode.split(',')" :key="i">{{v}}</span>
          </div>
        </div>
        <img :src="`/static/img/lottery/${!sscNarrow?'sscClose':'sscOpen'}.png`" class="normalImg" alt=""
             @click="sscNarrow=!sscNarrow;openScroll()">
        <span class="close" @click="setData({key:'ssc_openLotteryAnimation', value: false})"></span>
      </div>
      <!--<div class="defaultModal_bottom">-->
      <!--<span @click="setData({key: 'openLotteryModal', value: false})">关闭</span>-->
      <!--</div>-->
    </Modal>

    <!-- 快速投注模态框 -->
    <Modal class="modal_bettingNow"
           v-model="modal_bettingNow"
           :title="bettingContent.title"
           :closable="false"
           :mask-closable="false"
           class-name="vertical-center-modal"
           width="500px"
    >
      <p class="issue">您确认加入第<span>{{issue}}</span>期？</p>
      <div class="info">
        <p>总注数：<span>{{bettingContent.data?bettingContent.data.note:note}}</span></p>
        <p>投注总额：<span>{{bettingContent.data?bettingContent.data.total:total}}元</span></p>
        <p>是否追号：<span>否</span></p>
        <p>订单笔数：<span>{{1}}</span></p>
      </div>
      <p class="prompt">
        <span>温馨提示：</span>本期最高奖金限额<span>{{ maxBouns?maxBouns:400000 }}</span>元，请会员谨慎投注！
      </p>
      <div class="defaultModal_bottom">
        <span class="cancel"
              @click="setData({key: 'modal_bettingNow', value: false});bettingContent.onCancel&&bettingContent.onCancel()">取消</span>
        <span class="ok" @click="setData({key: 'modal_bettingNow', value: false}),bettingContent.onOk()">确认投注</span>

      </div>
    </Modal>

    <!-- 快速投注模态框 -->
    <Modal class="modal_bettingNow"
           v-model="jd_betting"
           :title="jdBettingList.title"
           :closable="false"
           :mask-closable="false"
           class-name="vertical-center-modal"
           width="500px"
    >
      <p class="issue">您确认加入第<span>{{issue}}</span>期？</p>
      <div class="jd-info">
        <span class="jd-item" v-for="item in jdBettingList.data.list">{{item.gname}}&nbsp;【{{item.BetContext}}】&nbsp;@{{item.rate ? item.rate : item.Lines}}&nbsp;x&nbsp;{{item.Money}}</span>
        <!--<p>总注数：<span>{{bettingContent.data?bettingContent.data.note:note}}</span></p>-->
        <!--<p>投注总额：<span>{{bettingContent.data?bettingContent.data.total:total}}元</span></p>-->
        <!--<p>是否追号：<span>否</span></p>-->
        <!--<p>订单笔数：<span>{{1}}</span></p>-->
      </div>
      <div class="total-note">
        共计:<span>￥{{jdBettingList.data.note}}/{{jdBettingList.data.total}}</span>,您确认要下注吗?
      </div>
      <!--<p class="prompt">-->
      <!--<span>温馨提示：</span>本期最高奖金限额<span>{{ bettingContent.data?bettingContent.data.maxBouns:maxBouns }}</span>元，请会员谨慎投注！-->
      <!--</p>-->
      <div class="defaultModal_bottom">
        <span class="cancel"
              @click="setData({key: 'jd_betting', value: false});jdBettingList.onCancel&&jdBettingList.onCancel()">取消</span>
        <span class="ok" @click="setData({key: 'jd_betting', value: false}),jdBettingList.onOk()">确认投注</span>
      </div>
    </Modal>

    <!--//H5弹框-->
    <Modal v-model="H5DefaultModal" class="defaultModalH5" :closable="false" :mask-closable="false"
           class-name="vertical-center-modal">
      <div class="defaultModal_content" :class="{
      'success-h5':defaultModalContent.status==='success-h5',
      }">{{defaultModalContent.content}}
      </div>
      <div class="defaultModal_bottom">
        <span v-if="defaultModalContent.status!=='confim'"
              @click="setData({key: 'H5DefaultModal', value: false})">关闭</span>
        <span v-if="defaultModalContent.status==='confim'" class="cancel"
              @click="setData({key: 'H5DefaultModal', value: false});defaultModalContent.onCancel&&defaultModalContent.onCancel()">取消</span>
        <span v-if="defaultModalContent.status==='confim'" class="ok"
              @click="setData({key: 'H5DefaultModal', value: false});defaultModalContent.onOk()">确认</span>
      </div>
    </Modal>

    <Modal v-model="defaultModal" class="defaultModal" width="500px" :closable="false" :mask-closable="false"
           class-name="vertical-center-modal">
      <div class="defaultModal_content" :class="{
      'success':defaultModalContent.status==='success',
      'warning':defaultModalContent.status==='warning',
      'confim':defaultModalContent.status==='confim',
      }" v-html="defaultModalContent.content">
      </div>

      <div class="defaultModal_bottom">
        <span v-if="defaultModalContent.status!=='confim'"
              @click="setData({key: 'defaultModal', value: false});defaultModalContent.onOk&&defaultModalContent.onOk()">关闭</span>
        <span v-if="defaultModalContent.status==='confim'" class="cancel"
              @click="setData({key: 'defaultModal', value: false});defaultModalContent.onCancel&&defaultModalContent.onCancel()">取消</span>
        <span v-if="defaultModalContent.status==='confim'" class="ok"
              @click="setData({key: 'defaultModal', value: false});defaultModalContent.onOk(defaultModalContent.content)">确认</span>
      </div>
    </Modal>

    <!-- 新手任务弹框 -->
    <Modal class="newPersonModal" v-model="newPersonModal" :closable="false" :mask-closable="false">
      <div class="taskClose"
           @click="setData({key: 'newPersonModal', value: false});userNames='';phoneNum='';imgYzCode='';yzCode='';isCaptcha=false;send_code_error=''">
        关闭
      </div>
      <div class="taskContent">
        <h3 v-if="'填写真实姓名'==defaultModalContent.taskTitle">填写真实姓名</h3>
        <h3 v-if="'填写微信号'==defaultModalContent.taskTitle">填写微信号</h3>
        <h3 v-if="'填写手机号'==defaultModalContent.taskTitle">填写手机号</h3>
      </div>
      <div class="taskMain">
        <div class="taskInput" v-if="'bindName'==defaultModalContent.typeNow">
          <input type="text" placeholder="请输入您的真实姓名" v-model="userNames">
        </div>
        <div class="taskInput" v-if="'bindWechat'==defaultModalContent.typeNow">
          <input type="text" placeholder="请输入您的微信号" v-model="userNames">
        </div>

        <div class="taskBtn" v-if="'bindName'==defaultModalContent.typeNow">
          <span :class="verficationUserNames&&userNames!=''?'active':''"
                @click="verficationUserNames&&userNames!=''&&setName()">确定</span>
          <!-- <span v-if="defaultModalContent.setWechat" :class="verficationweChatNum&&userNames!=''?'active':''"
                @click="verficationweChatNum&&userNames!=''&&setWechat()">确定</span> -->
        </div>
        <div class="taskBtn" v-if="'bindWechat'==defaultModalContent.typeNow">
          <span :class="verficationweChatNum&&userNames!=''?'active':''"
                @click="verficationweChatNum&&userNames!=''&&setWechat()">确定</span>
        </div>
        <div class="taskPhone" v-if="'bindMobile'==defaultModalContent.typeNow">
          <div></div>
          <div class="phoneType">
            <div class="country">国家/地区</div>
            <div class="countryType">
              <Select v-model="countryType" @on-change="selOption">
                <Option v-for="item in phoneTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </div>
          </div>
          <div class="phoneMain">
            <div class="countryNum">{{phoneType}}</div>
            <div class="phoneInput">
              <input type="text" placeholder="请输入手机号码" v-model="phoneNum"
                     :class="alreadyPhone?'inputErr':''" maxlength="11"
                     @input="verificationMobile&&regCheckphone();isCountFinish = false;send_code_error='';alreadyPhone = false">
              <i class="icon_v3 success" v-show="!alreadyPhone&&phoneNum!=''&&verificationMobile">&#xe646;</i>
              <i class="icon_v3 error" v-show="alreadyPhone&&phoneNum!=''" @click="phoneNum='';send_code_error=''">&#xe648;</i>
            </div>
          </div>
          <div class="codeMain" v-if="isCaptcha" style="border-bottom:1px solid #ddd">
            <div class="codeText">图片验证码：</div>
            <div class="codeInput">
              <input type="text" placeholder="输入图片验证码" v-model="imgYzCode"
                     @input="isCountFinish = false;send_code_error=''">
            </div>
            <div class="codeBtn" @click="RefreshSrc"><img :src="safetySrc" alt=""></div>
          </div>
          <div class="codeMain">
            <div class="codeText">验证码：</div>
            <div class="codeInput">
              <input type="text" placeholder="请输入验证码" v-model="yzCode" @input="send_code_error = ''">
            </div>
            <div class="codeBtn">
              <span class="getCode" @click="!alreadyPhone&&verificationMobile&&getCode()"
                    v-show="!isCountFinish">获取验证码</span>
              <span class="getCode" v-show="isCountFinish">剩余{{countTime}}s</span>
            </div>
          </div>
          <div :class="send_code_error!=''?'inputErrtips':''">{{send_code_error}}</div>
        </div>
        <div class="taskBtn" v-if="'bindMobile'==defaultModalContent.typeNow">
          <span :class="verificationMobile&&verificationMobileCode&&yzCode!=''&&!alreadyPhone?'active':''"
                @click="verificationMobile&&verificationMobileCode&&yzCode!=''&&!alreadyPhone&&setPhone()">确定</span>
        </div>
      </div>
    </Modal>

    <!-- 新手任务领取奖金弹框 -->
    <Modal class="newPersonBonus" v-model="newPersonBonus" :closable="false" :mask-closable="false">
      <div class="bonusClose"
           @click="setData({key: 'newPersonBonus', value: false});userNames='';phoneNum='';imgYzCode='';yzCode='';isCaptcha=false;send_code_error=''">
        关闭
      </div>
      <div class="bonusContent">
        <div :class="defaultModalContent.bonus?'carry':''">¥<span>{{defaultModalContent.nowBonus}}</span></div>
      </div>
      <div class="bonusMain" v-if="!defaultModalContent.Content">
        <div class="bonusBtn goBet" @click="goBetting">点击使用</div>
        <div class="bonusBtn carryOn" @click="carryOn">再领 {{defaultModalContent.nextBonus}} 元</div>
      </div>
      <div class="bonusBottom" v-if="!defaultModalContent.Content">
        <div class="bonusBottomBtn" @click="()=>(this.$router.push('/lottery/#11'))">跳转投注页开始投注吧!</div>
        <div class="bonusBottomBtn" @click="carryOn">继续完成任务，领取大奖!</div>
      </div>
      <div class="bonusMain" v-if="defaultModalContent.Content" style="margin-top: -6px">
        <div class="tatalMain">恭喜您总共获得<span>¥{{defaultModalContent.setTotal}}</span>红包</div>
      </div>
      <div class="bonusMain" v-if="defaultModalContent.Content" style="height:60px;margin-top: 0">
        <div class="bounsText">恭喜玩家您已经领取了彩天堂送给您的新手大礼包，快来开始游戏吧！</div>
      </div>
      <div class="bonusMain" v-if="defaultModalContent.Content">
        <div class="bonusBtn carryOn" @click="()=>(this.$router.push('/lottery/#11'))">游戏投注</div>
      </div>
    </Modal>

    <!--订单详情弹框-->
    <!--订单详情这里有+两个分类   未开奖订单和游戏记录是同一类    追号记录是另外一类-->
    <Modal class="modal_orderDetail"
           v-model="modal_orderDetail"
           width="800"
           :closable="false"
           :mask-closable="false"
           title="订单详情">
      <div class="orderDetail_table" v-if="modal_orderDetailTable">
        <div class="item"><span class="col1">订单编号</span><span class="col2">{{modal_orderDetailTable.billno}}</span><span
          class="col3">状态</span><span class="col4">{{modal_orderDetailTable.statusRemark}}</span></div>
        <div class="item"><span class="col1">彩种</span><span class="col2">{{modal_orderDetailTable.lottery}}</span><span
          class="col3">期号</span><span class="col4">{{modal_orderDetailTable.issue}}期</span></div>
        <div class="item"><span class="col1">玩法</span><span class="col2">{{modal_orderDetailTable.method}}</span><span
          class="col3">注数</span><span class="col4">{{modal_orderDetailTable.nums}}注</span></div>
        <div class="item"><span class="col1">资金模式</span><span class="col2">{{modal_orderDetailTable.model}}</span><span
          class="col3">倍数</span><span class="col4">{{modal_orderDetailTable.multiple}}倍</span></div>
        <div class="item"><span class="col1">奖金模式</span><span class="col2">{{modal_orderDetailTable.code}}</span><span
          class="col3">返点</span><span class="col4">{{Number(modal_orderDetailTable.point).toFixed(1)}}%</span></div>
        <div class="item"><span class="col1">投注金额</span><span class="col2">¥ {{Number(modal_orderDetailTable.money).toFixed(3)}}</span><span
          class="col3">中奖金额</span><span class="col4">¥ {{Number(modal_orderDetailTable.winMoney)}}</span>
        </div>
        <div class="item item_row"><span class="col1">下单时间</span><span
          class="col2">{{modal_orderDetailTable.orderTime}}</span></div>
        <div class="item item_row"><span class="col1">开奖号码</span><span class="col2">{{modal_orderDetailTable.openCode?modal_orderDetailTable.openCode:'无'}}</span>
        </div>
        <div class="item item_row table_bottm">
          <div class="col1">
            <div class="text">投注内容</div>
            <span @click="order_print()">打印</span>
          </div>
          <div class="col2 openCode" v-if="modal_orderDetailTable.lottery">
            {{modal_orderDetailTable.lottery.includes('11选5')?modal_orderDetailTable.content.replace(/,/g,'').replace(/\|/g,','):modal_orderDetailTable.content}}
          </div>
        </div>

      </div>
      <div slot="footer">
        <span class="cancel" @click="close_orderDetail()">取消</span>
        <span class="ok" @click="ok_orderDetail(1)">{{modal_orderDetailTable&&modal_orderDetailTable.allowCancel?'撤销订单':'确定'}}</span>
      </div>
    </Modal>
    <!--打印iframe-->
    <div id="printnow"></div>
    <!--追号记录的订单详情-->
    <Modal class="modal_orderDetail"
           v-model="modal_chaseDetail"
           width="800"
           title="订单详情"
           :closable="false"
           :mask-closable="false"
           :okText="modal_orderDetailTable&&modal_orderDetailTable.allowCancel?'撤销订单':'确定'"
           @on-ok="modal_orderDetailTable&&modal_orderDetailTable.allowCancel&&Withdrawal(modal_orderDetailTable,2)"
           @on-cancel="modal_chaseDetailTabIndex=0">
      <div class="tab">
        <span :class="{'active':modal_chaseDetailTabIndex===i}" @click="modal_chaseDetailTabIndex=i"
              v-for="(v,i) in modal_chaseDetailTab" :key="i">{{v}}</span>
      </div>
      <div class="orderDetail_table" v-if="modal_orderDetailTable&&modal_chaseDetailTabIndex===0">
        <div class="item"><span class="col1">订单编号</span><span class="col2">{{modal_orderDetailTable.billno}}</span><span
          class="col3">状态</span><span class="col4">{{modal_orderDetailTable.statusStr}}</span></div>
        <div class="item"><span class="col1">彩种</span><span class="col2">{{modal_orderDetailTable.lottery}}</span><span
          class="col3">玩法</span><span class="col4">{{modal_orderDetailTable.method}}</span>
        </div>
        <div class="item"><span class="col1">开始期号</span><span class="col2">{{modal_orderDetailTable.startIssue}}期</span><span
          class="col3">注数</span><span class="col4">{{modal_orderDetailTable.nums}}注</span></div>
        <div class="item"><span class="col1">总期数</span><span
          class="col2">{{modal_orderDetailTable.totalCount}}</span><span class="col3">已追期数</span><span class="col4">{{modal_orderDetailTable.clearCount}}</span>
        </div>
        <div class="item"><span class="col1">资金模式</span><span class="col2">{{modal_orderDetailTable.model}}</span><span
          class="col3">返点</span><span class="col4">{{Number(modal_orderDetailTable.point).toFixed(1)}}%</span></div>
        <div class="item"><span class="col1">总金额</span><span class="col2">¥ {{Number(modal_orderDetailTable.totalMoney).toFixed(3)}}</span><span
          class="col3">总奖金</span><span class="col4">¥ {{Number(modal_orderDetailTable.winMoney)}}</span>
        </div>
        <div class="item item_row"><span class="col1">下单时间</span><span
          class="col2">{{modal_orderDetailTable.orderTime}}</span></div>
        <div class="item item_row"><span class="col1">中单是否撤单</span><span class="col2">{{modal_orderDetailTable.winStop?'是':'否'}}</span>
        </div>
        <div class="item item_row table_bottm">
          <div class="col1">
            <div class="text">投注内容</div>
            <!--<span @click="order_print()">打印</span>-->
          </div>
          <div class="col2">{{modal_orderDetailTable.content}}</div>
        </div>

      </div>
      <div class="everyIssue_table" v-if="modal_orderDetailTable&&modal_chaseDetailTabIndex===1">
        <ul class="everyIssue_tableTop"
            :class="{'isScroll':modal_orderDetailTable.chaseList&&modal_orderDetailTable.chaseList.length>7}">
          <li v-for="(v,i) in everyIssue_tableTop" :key="i">{{v}}</li>
        </ul>
        <div class="everyIssue_tableContentBox">
          <ul v-for="(v,i) in modal_orderDetailTable.chaseList" :key="i">
            <li>{{v.issue}}</li>
            <li>{{v.multiple}}</li>
            <li>¥ {{Number(v.money).toFixed(3)}}</li>
            <li>¥ {{Number(v.winMoney).toFixed(3)}}</li>
            <li>{{v.statusRemark}}</li>
            <li>{{v.openCode?v.openCode:'无'}}</li>
            <li :class="{'back':v.allowCancel}" @click="v.allowCancel&&Withdrawal(v,3)"><span>{{v.allowCancel?'撤销':'无操作'}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer">
        <span class="cancel" @click="close_orderDetail()">取消</span>
        <span class="ok" @click="ok_orderDetail(2)">{{modal_orderDetailTable&&modal_orderDetailTable.allowCancel?'撤销订单':'确定'}}</span>
      </div>
    </Modal>

    <!-- 第三方游戏页面转账 -->
    <Modal class="thridTransfer_Modal"
           v-model="thridTransfer_Modal"
           width="650"
           height="390"
           title="余额转账"
           :closable="false"
           :mask-closable="false">
      <div class="close" @click="setData({key:'thridTransfer_Modal',value:false});money='';errTips='';directionIndex=0">
        ×
      </div>
      <div class="thridTransfer_Main">
        <div class="thridTransferType">
					<span v-for="(v,i) in direction" :key="i" :class="{'active':directionIndex===i}"
                @click="directionIndex=i;money=''">
						{{v.label}}
					</span>
        </div>
        <div class="thridTransferInput">可转入金额: <span>{{directionIndex===1?Math.floor(defaultModalContent.money):Math.floor(baseInfo.lotteryBalance)}}</span><em>元</em>
        </div>
        <div class="write">转入金额：<input type="text" v-model="money" @input="errTips = ''"><span
          @click="money=Math.floor(directionIndex===1?defaultModalContent.money:baseInfo.lotteryBalance)">全部转入</span>
          <em>元</em>
        </div>
        <div class="errTips"><p>{{errTips}}</p></div>
        <div class="btn" :class="{'noClick':!money}" @click="money>0&&thridTransfer()">确定转入</div>
      </div>
    </Modal>

    <!-- 提示不是6位数字资金密码老用户修改资金密码 -->
    <Modal class="modifyFundsPass_Modal" v-model="modifyFundsPass_Modal"  width="500px" :closable="false" :mask-closable="false">
      <div class="defaultModal_content" :class="{
      'success':modifyFundsPassContent.status==='success',
      'warning':modifyFundsPassContent.status==='warning',
      'confim':modifyFundsPassContent.status==='confim',
      }" v-html="modifyFundsPassContent.content">
      </div>

      <div class="defaultModal_bottom"> <!--@click="setData({key: 'modifyFundsPass_Modal', value: false})"-->
        <span class="cancel"  ><a :href="appConfigData.kefu" target="_blank">联系客服</a></span>
        <span class="ok"   @click="setData({key: 'modifyFundsPass_Modal', value: false});modifyFundsPassContent.onOk&&modifyFundsPassContent.onOk()">前往修改</span>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex';
  // import { Cookie } from "../../js/common.js";
  // import Bounce from "bounce.js";  // 引入动画插件
  import {
    getVerifyCode,
    regCheckphone,
    RefreshSrc,
    userInit,
    userConter,
    registerInit,
    getAccoutStatus,
    updaAccoutStatus,
    getThreeAllMoney
  } from '@/js/index.js'
  import service from "@/js/service.js";
  import {verifyRule} from "@/js/const.js"; // 正则验证


  let init = {
    userHeader: userInit(),
    userContent: userConter(),
    registerInit: registerInit()
  };

  export default {
    data() {
      return {
        defaultModalContent: {}, // 基础弹框的数据
        winningContent: {},
        timeCount: 0,
        timerWin: false,
        currentList: '',
        lotteryList: '', // 所有彩种
        openLottery: {}, // 开奖弹框的数据
        sscDataModal: {}, // 时时彩开奖弹框的数据
        sscNarrow: false, // 时时彩开奖动画是否缩小
        bettingContent: {},  // 投注框的数据
        modifyFundsPassContent:{},  // 提示老用户去修改资金密码弹窗数据
        jdBettingList: {
          title: '',
          data: {
            note: '',
            total: '',
            list: []
          }
        },
        direction: [
          {label: '转入游戏'},
          {label: '转入钱包'},
        ],
        directionIndex: 0, // 当前选中的方向
        money: '', // 第三方转账金额
        errTips: '',  // 第三方转账提示
        bindNameBouse: 0,  // 绑定姓名的奖金
        bindNameBouseNext: 0,  // 绑定姓名下一步的奖金
        bindWechatBouse: 0,  // 绑定微信的奖金
        bindWechatBouseNext: 0,  // 绑定微信下一步的奖金
        bindMobileBouse: 0,  // 绑定手机的奖金
        bindMobileBouseNext: 0,  // 绑定手机下一步的奖金
        sortNow: 0,  // 新手任务当前的步奏

        modal_orderDetailTable: {}, // 订单详情的数据
        closable: false, // 订单详情是否可以按esc键
        modal_data: null, // 公共数据存起来  方便调用
        modal_chaseDetailTabIndex: 0, // 当前选中的第几个页签
        modal_chaseDetailTab: ['详细', '列表'], // 追号详情订单里面的页签
        moneyMode_mapping: {yuan: '元', jiao: '角', fen: '分', li: '厘'}, // 资金模式映射表
        everyIssue_tableTop: ['期号', '倍数', '投注金额', '中奖金额', '状态', '开奖号码', '操作'], // 追号详情订单列表里面的表格头部
        // newPersonModal:{},  // 新手任务的数据
        newTaskBouns: [],  // 新手任务汇总奖金
        userNames: '',  // 用户输入的真实姓名
        phoneNum: '',  // 手机号
        yzCode: '',   // 验证码
        safetySrc: "", // 获取图片验证码
        isCaptcha: false, // 图片验证码是否显示
        imgYzCode: '',
        alreadyPhone: false,  // 是否绑定手机号
        countTime: 60, // 验证码倒计时
        isCountFinish: false, // 倒计时
        send_code_error: '',   // 错误提示
        countryType: '+0086',
        phoneType: "+0086", // 默认选中中国大陆
        phoneTypeList: [
          {
            value: "+0086",
            label: "中国大陆"
          },
          // {
          // 	value: "+60",
          // 	label: "马来西亚"
          // },
          // {
          // 	value: "+63",
          // 	label: "菲律宾"
          // },
          // {
          // 	value: "+01",
          // 	label: "美国"
          // }
        ]
      }
    },
    computed: {
      ...mapState([
        'newPersonModal',   // 新手任务弹框
        'newPersonBonus',   // 新手任务领取奖金弹框
        'accountStatus',   // 用户绑定的信息
        'thridTransfer_Modal', // 第三方游戏页面转账
        'modifyFundsPass_Modal', // 提示老用户去修改资金密码弹框
        'defaultModal',
        'H5DefaultModal',
        'openLotteryModal',
        'ssc_openLotteryAnimation',
        'modal_orderDetail', // 订单详情的弹框是否打开
        'modal_chaseDetail', // 追号记录的详情
        'modal_bettingNow',
        'maxBouns', // 点击投注时弹框的最高限额值
        'note', // note  --注数
        'total', // 选注栏的总金额
        'issue', // 当前即将开奖的期号
        'followNum', // 是否追号
        'currentLottery', // 当前彩种
        'biggerType', // 当前彩种大类
        'initStatus_tableRecord', //  控制刷新订单表格的数据
        'taskActivity',  // 新手任务步奏及奖金
        'newTaskMoney',  //  新手任务领取的将奖金
        'sortNo',   // 新手任务步奏
        'baseInfo',  //  基本的数据
        'appConfigData' , // 客服等数据
        'jd_betting',
        'winningModal',
        'winningMessageData',
        'allLotteryList'
      ]),
      verficationUserNames() {
        // console.log(/^[\u4e00-\u9fa5]{1,8}$/.test(this.userNames));
        // return /^[\u4e00-\u9fa5]{1,8}$/.test(this.userNames)
        if (/^[\u4e00-\u9fa5]{2,20}$/.test(this.userNames)) {
          return true
        } else {
          this.userNames = this.userNames.substr(0, 20);
          return false
        }
      },
      // 绑定手机号
      verificationMobile() {
        if (this.phoneType === "+0086") {
          return verifyRule.mobile.reg.test(this.phoneNum);
        } else {
          return /^([0-9]{4,18})$/.test(this.phoneNum);
        }
      },
      // 绑定手机号验证码
      verificationMobileCode() {
        return /^([0-9]){4}$/.test(this.yzCode);
      },
      // 检验微信号
      verficationweChatNum() {
        return /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/.test(this.userNames);
      },
    },
    watch: {
      $route() {
        this.initModal();
    },
      money(aft) {
        let num = parseInt(aft)
        if (isNaN(num)) {
          num = ''
        }
        this.money = num
        if (this.directionIndex === 0) {
          if (aft > Number(this.baseInfo.lotteryBalance)) {
            this.money = parseInt(this.baseInfo.lotteryBalance)
          }
        } else if (this.directionIndex === 1) {
          if (aft > Number(this.defaultModalContent.money)) {
            this.money = parseInt(this.defaultModalContent.money)
          }
        }
      },
      allLotteryList(newVal) {
        // console.log(newVal, 'allLotteryList');
        this.lotteryList = newVal;
      },
      winningMessageData(newVal, oldVal) {
        let t = this;
        console.log(newVal, 'watch--winningMessageData');
        clearTimeout(t.time1);
        t.time1 = setTimeout(function () {
          if (newVal.length > 0 && !t.timerWin) {
            let content = newVal[0].content;
            let list = content.split('<br/>');
            let name = list[0].split(':')[1]; // 彩种名称
            let issue = list[1].split(':')[1]; // 彩种期号
            // 获取彩种ID
            let lotteryId = null;
            let lotteryList = t.lotteryList;
            if (lotteryList !== '') { // 获取当前彩种ID
              for (let i = 0; i < lotteryList.length; i++) {
                let item = lotteryList[i];
                if (item.showName === name) {
                  lotteryId = item.id;
                  break;
                }
              }
            }
            // console.log(lotteryId, issue, 'issueissueissue');
            let count = 0;
            let time = 0.5; // 第一次的延时
            t.timer2 = setInterval(function () {
              t.$http.post(`/yx/u/api/game-lottery/search-user-lotteryPrize?lottery=${lotteryId}&issue=${issue}`).then((_data) => {
                console.log(_data, 'search-user-lotteryPrize');
                if (_data.body.code === 0) { // 通讯成功
                  let data = _data.body.data;
                  if (data.isOpen === 1) { // 当isOpen为1时，当前奖期开奖完毕，弹框
                    let winAmount = data.winAmount;
                    let content = `<p class="content">在" ${name} "第${issue}期<p/><p class="content">喜中<span>${winAmount}</span>元彩金</p>`;
                    let winningContent = {
                      content: content,
                      name: name,
                      issue: issue,
                      id: lotteryId
                      // timeCount:5 // 5秒钟后关闭！
                    };
                    t.$Modal.al_wining(winningContent);
                    clearTimeout(t.time1); // 清除监听器的延时
                    clearInterval(t.timer2); // 清除循环回调
                  } else {
                    time = 3; // 第二次之后就开始三秒每一次！
                    count = count + 1;
                    if (count > 10) { // 最多循环10次！
                      clearInterval(t.timer2)
                    }
                  }
                }
              });
            }, 1000 * time) // 3秒钟
          }
        }, 500);
      }
    },
    methods: {
      ...mapMutations(['setData', 'initModal', 'setWinningMessageAgain']),

      init_default() {
        this.$Modal.al_default = function (data) {
          this.defaultModalContent = data;
          this.setData({key: "defaultModal", value: true})
        }.bind(this)
        // 使用方法
        // this.$Modal.al_default({status:'warning',content:'这个是标题'})
      },
      init_openLottery() {
        this.$Modal.al_openLottery = function (data) {
          this.openLottery = data
          // this.setData({key: "isShowBetting", value: false})   // 投注指引关闭
          this.setData({key: "openLotteryModal", value: true})
          // 这个要加时间
          if (data.time) {
            setTimeout(function () {
              this.setData({key: "openLotteryModal", value: false})
              this.openScroll() // 隐藏滚动条的样式   手动去掉  iview有时会出现无法删除的情况 这里我们手动删除
            }.bind(this), data.time)
          }
        }.bind(this)
        // 使用方法  ---这个除了开奖可以用之外  其他的都不允许能使用
        // this.$Modal.al_openLottery({status:'warning',content:'这个是标题'})
      },
      // 时时彩专属开奖号码
      init_openLottery_ssc() {
        this.$Modal.al_openLottery_ssc = function (data) {
          this.sscDataModal = data
          this.sscNarrow = false;// 时时彩开奖动画是否缩小
          this.setData({key: "ssc_openLotteryAnimation", value: true})
          let that = this;
          // 这个要加时间  定时关闭
          let timer = setTimeout(function () {
            this.setData({key: "ssc_openLotteryAnimation", value: false})
          }.bind(this), 7000)
          // 增加事件-esc关闭
          $(document).keydown(function (e) {
            var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
            if (eCode == 27) { // esc事件
              that.setData({key: "ssc_openLotteryAnimation", value: false})
              clearTimeout(timer)
            }
          });
        }.bind(this)
      },
      // 投注
      init_bettingNow() {
        this.$Modal.al_bettingNow = function (data) {
          this.bettingContent = data
          this.setData({key: 'modal_bettingNow', value: true})
        }.bind(this)
        // 使用方法  this.$Modal.al_bettingNow({title:'快速投注',status:'confim',onOk:this.sendImmediatelyBetting})
      },
      // H5
      init_default_H5() {
        this.$Modal.al_default_H5 = function (data) {
          this.defaultModalContent = data
          this.setData({key: "H5DefaultModal", value: true})
        }.bind(this)
        // 使用方法
        // this.$Modal.al_default({status:'warning',content:'这个是标题'})
      },
      // 第三方游戏页面转账框
      init_thridModal() {
        this.$Modal.thridTransfer_Modal = function (data) {
          this.defaultModalContent = data
          this.setData({key: 'thridTransfer_Modal', value: true})
        }.bind(this)
        // 使用方法
        // this.$Modal.thridTransfer_Modal({money:'111111'})
      },
      // 确定转账
      thridTransfer() {
        let that = this
        this.errTips = '正在处理中，请耐心等待。。'
        if (that.money === 0) {
          this.errTips = '转账金额不能为 0'
          return false
        }
        this.$http.post('/yx/api/i/u/bank/playerTransferRefreshToken').then(function (result) {
          let res = result.data
          if (res.code === 0) {
            that.$http.post('/yx/api/i/u/bank/playerTransfer', {
              turnOut: that.directionIndex === 1 ? that.defaultModalContent.turnIn : 'sobet_01',
              turnIn: that.directionIndex === 0 ? that.defaultModalContent.turnIn : 'sobet_01',
              cash: that.money,
              // payPasswd: md5('a12345678'), // 这个后面要去掉  不要资金密码了
              token: res.data,
            }).then(function (result1) {
              let res1 = result1.data
              if (res1.code === 0) {
                that.money = ''
                that.errTips = ''
                that.setData({key: 'thridTransfer_Modal', value: false})
                that.$Modal.al_openLottery({status: 'success', content: '转账成功', time: 2000})
                userInit().initlotteryBalance(that)// 刷新金额
                getThreeAllMoney(that)  //  刷新第三方金额
              } else {
                // this.$Modal.al_default({status: 'warning', content: res1.message,time:2000})
                that.errTips = res1.message
              }
            }, function (err1) {
              console.log(err1)
            })
          } else {
            // this.$Modal.al_default({status: 'warning', content: res.message})
          }
        }, function (err) {
          console.log(err)
        })
      },
      // 提示老用户去修改资金密码
      init_modifyFundsPass_Modal() {
        this.$Modal.modifyFundsPass_Modal = function (data) {
          this.modifyFundsPassContent = data
          this.setData({key: "modifyFundsPass_Modal", value: true})
        }.bind(this)
        // 使用方法
        // this.$Modal.modifyFundsPass_Modal({status:'warning',content:'这个是标题'})
      },

      // 订单详情
      init_orderDetail() {
        this.$Modal.al_orderDetail = function (billno, url) {
          this.openModal_orderDetail(billno, url) // 请求数据
          this.setData({key: "modal_orderDetail", value: true}) // 打开弹框
        }.bind(this)
      },
      // 追号详情
      init_chaseDetail() {
        this.$Modal.al_chaseDetail = function (billno, url) {
          this.openModal_orderDetail(billno, url) // 请求数据
          this.setData({key: "modal_chaseDetail", value: true}) // 打开弹框
        }.bind(this)
      },
      // 点击订单详情  打开模态框事件
      openModal_orderDetail(v, url) {
        let that = this;
        service.post(this, url, {billno: v}).then(function (result) {
          let res = result.data
          if (res.code === 0) {
            res.data.orderTime = moment(res.data.orderTime).format('YYYY-MM-DD HH:mm:ss')
            res.data.model = this.moneyMode_mapping[res.data.model]
            this.modal_orderDetailTable = res.data
          } else {
            this.$Modal.al_default({status: 'warning', content: res.message})
          }
        }, function (err) {
          console.log(err)
        })
      },
      // 打印功能
      order_print() {
        let data = this.modal_orderDetailTable
        $('.alanModal #printfr').remove();
        $('.alanModal #printnow').html('<iframe id="printfr" rel="/static/print.html"></iframe>');
        // $('.alanModal #printfr').load(function () {
        var iframe = $('.alanModal #printfr');
        var innerDoc = iframe[0].contentDocument || iframe[0].contentWindow.document;
        innerDoc.write([
          // '<style media="all">.PrintArea{color:#000;width:228px;}.smallNum{display:block;}em{font-style:normal;}ul{margin:0px;padding:0px;}li{line-height:25px;}hr{border:none;height:2px;background-color: #000000;border-bottom:2px solid #000000;}h2{font-size:18px;padding:0px;margin:0px;text-align:center;line-height:45px;}.bl{display:block;}.printContent{word-break: break-all;max-height: 220px;overflow-y: hidden;display: inline-block;}</style>',
          '<div class="PrintArea">',
          '<h2>彩票投注单</h2>',
          '<ul>',
          '<li><span>下单时间：</span><em>', moment(data.orderTime).format('MM-DD HH:mm:ss'), '</em></li>',
          '<li><span>投注彩种：</span><em>', data.lottery, '</em></li>',
          '<li class="lottime"><span>投注期号：</span><em>', data.issue, '</em><hr/></li>',
          '<li class="lotbh"><span>注单编号：</span><em class="smallNum">', data.billno, '</em></li>',
          '<li><span>投注玩法：</span><em>', data.method, '</em></li>',
          '<li><span class="bl">投注内容：</span><em class="printContent">', (data.content.length > 100 ? data.content.substr(0, 100) + '... 投注内容较长，只显示部分投注内容。' : data.content), '</em></li>',
          '<li class="lotje"><span>投注金额：</span><em>', data.money.toFixed(3), '元</em></li>',
          '<li class="lotmon"><hr/>　　<span>总金额：</span><em>', data.money.toFixed(3), '元</em></li>',
          '</ul>',
          '</div>',
        ].join(''));
        //  console.log(innerDoc,iframe[0].contentWindow);
        iframe[0].contentWindow.print();
        // });
      },
      // 订单详情关闭
      close_orderDetail() {
        // 关闭订单详情和追号详情的弹框
        this.modal_orderDetail && this.setData({key: "modal_orderDetail", value: false});
        this.modal_chaseDetail && this.setData({key: "modal_chaseDetail", value: false});
      },
      // 订单详情确定事件
      ok_orderDetail(i) {
        if (this.modal_orderDetailTable && this.modal_orderDetailTable.allowCancel) {
          this.Withdrawal(this.modal_orderDetailTable, i)
        } else {
          this.close_orderDetail()
        }

      },
      // 去掉body的overflow  hidden的样式  不然页面无法滚动
      openScroll() {
        this.$nextTick(function () {
          $('body').attr("style", '')
        })
      },

      // 撤销订单
      // 订单表格的撤单的点击事件
      Withdrawal(v, i) {
        this.modal_data = v;// 操作订单表格时的当前数据--存起来  之后调用时使用
        this.modal_data.al_type = i // 标记为撤销 1是订单撤单  2是追号撤单   3个追号里面的期数撤单
        i === 3 && (this.closable = false);// 禁用esc
        let that = this;
        this.$Modal.al_default({
          status: 'confim', content: '确定要撤销该订单？',
          onOk() {
            that.ok_WithdrawalOrder(that.modal_data)
            i === 3 && (that.closable = true);// 开启esc键
          },
          onCancel() {
            i === 3 && (that.closable = true);// 开启esc键
          }
        })
      },
      // 是否撤销订单的模态框  确认事件
      ok_WithdrawalOrder(v) {
        let obj = {billno: v.billno}
        let url = ''
        // 这里做一个适配  兼容追号的撤单和追号单里面单个期数的撤单  总共是三个
        // 用al_type来做适配 al_type   1是订单撤单  2是追号撤单   3个追号里面的期数撤单
        if (v.al_type === 1) {
          url = 'game-lottery/cancel-order'
        }
        if (v.al_type === 2) {
          obj.type = 'chase'
          url = 'game-lottery/cancel-chase'
        }
        if (v.al_type === 3) {
          obj.type = 'general'
          url = 'game-lottery/cancel-single-chase'
        }
        service.post(this, url, obj).then(function (result) {
          if (result.data.code === 0) {
            this.modal_orderDetail && this.setData({key: "modal_orderDetail", value: false})
            this.$Modal.al_default({status: 'success', content: '撤单成功！'})
            if (v.al_type !== 1) {
              // 将追号详情的模态框关闭
              this.setData({key: "modal_chaseDetail", value: false})
              this.modal_chaseDetailTabIndex = 0// 追号详情订单里面的页签  当前选中的第几个页签  初始化
            }
            this.modal_data = null;// 操作订单表格时的当前数据清空 避免下一次使用时出错
            this.setData({key: "initStatus_tableRecord", value: !this.initStatus_tableRecord})// 刷新订单框 当前表格的数据
            userInit().initlotteryBalance(this)// 刷新金额
          } else {
            this.$Modal.al_default({status: 'warning', content: result.data.message})
          }
        }, function (err) {
          console.log(err)
        })
      },

      // 新手任务的奖金累加
      // sum(arr) {
      //   let s = 0;
      //   arr.forEach(function (val, idx, arr) {
      //     s += val;
      //   }, 0);
      //   return s;
      // },
      // 新手任务
      init_newPersonModal() {
        this.$Modal.newPersonModal = function (data) {
          this.defaultModalContent = data
          this.setData({key: "newPersonModal", value: true})
        }.bind(this)
        // 使用方法
        // this.$Modal.newPersonModal({taskTitle:'任务一：填写真实姓名',inputContent:'请输入真实姓名'})
      },
      // 新手奖金
      init_newPersonBonus() {
        this.$Modal.newPersonBonus = function (data) {
          this.defaultModalContent = data
          this.setData({key: "newPersonBonus", value: true})
        }.bind(this)
        // 使用方法
        // this.$Modal.newPersonBonus({taskTitle:'任务一：填写真实姓名',inputContent:'请输入真实姓名'})
      },
      // 去投注页
      goBetting() {
        // Cookie.setCookie("tc_tempoBet_"+this.baseInfo.nickName, 1, 30);
        if (window.location.href.indexOf('/lottery/#11') != -1) {
          this.userNames = ''
          this.setData({key: "newPersonBonus", value: false})
        } else {
          this.userNames = ''
          this.$router.push('/lottery/#11')
        }
      },
      // 继续领取奖金
      carryOn() {
        let sortNoName = {
          bindName: '填写真实姓名',
          bindWechat: '填写微信号',
          bindMobile: '填写手机号'
        }
        this.userNames = ''
        this.setData({key: 'newPersonBonus', value: false});// 关闭第一个领取红包成功的弹框
        // debugger
        // this.sortNow = this.sortNo[1]

        if (typeof this.sortNo[this.sortNow] == 'undefined' && this.sortNow == 2) {
          this.sortNow = 1
        }
        this.$Modal.newPersonModal({
          taskTitle: sortNoName[this.sortNo[this.sortNow]],
          inputContent: sortNoName[this.sortNo[this.sortNow]],
          typeNow: this.sortNo[this.sortNow]
        })
        // _this.$Modal.newPersonBonus({
        // 	bonus: false,
        // 	Content: swTag,
        // 	nowBonus: nowBonus,
        // 	nextBonus: nextBonus,
        // 	setTotal: total
        // })

        // if (!this.accountStatus.isBindWeChat) {
        // 	this.$Modal.newPersonModal({taskTitle: '任务二：填写微信号', inputContent: '请输入微信号', typeOne: true, setWechat: true})
        // } else if (!this.accountStatus.cellphone) {
        // 	this.$Modal.newPersonModal({taskTitle: '任务三：填写手机号',  typeTwo: true})
        // }
      },
      // 绑定用户真实姓名
      setName() {
        let _this = this;
        let swTag = false;
        if (this.sortNo.indexOf('bindName') === 2) {
          swTag = true;
        }
        let options = {
          withdrawName: this.userNames
        }
        let total = 0;
        let bandNameBonus = 0
        let nextBonus = 0
        let nowindex = this.sortNo.indexOf('bindName') + 1
        for (let i in this.taskActivity) {
          total += Number(this.taskActivity[i]);
          if (i === 'bindName') {
            bandNameBonus = Number(this.taskActivity[i])
            console.log(bandNameBonus);
          }
          if (i === this.sortNo[nowindex]) {
            nextBonus = Number(this.taskActivity[i])
            console.log(nextBonus, 'nextBonus');
          }
        }
        console.log(total);

        this.$http.post('/yx/u/api/account/apply-bind-withdrawName', options).then(res => {
          let data = res.body;
          if (data.code === 0) {
            let arr = [], nowtotal = 0
            for (let val of this.sortNo) {
              arr.push(this.taskActivity[val])
              nowtotal += parseInt(this.taskActivity[val], 10)
            }
            _this.setData({key: 'newPersonModal', value: false})
            _this.sortNow = '1'
            console.log(this.sortNo.length, this.sortNo, nowtotal, 'setNamesetNamesetName');
            if (this.sortNo.length < 3 && this.sortNo[this.sortNo.length - 1] == 'bindName') {
              _this.$Modal.newPersonBonus({
                Content: true,
                nowBonus: bandNameBonus,
                nextBonus: nextBonus,
                setTotal: nowtotal
              })
            } else {

              _this.$Modal.newPersonBonus({
                bonus: false,
                Content: swTag,
                nowBonus: bandNameBonus,
                nextBonus: nextBonus,
                setTotal: nowtotal
              })
            }

            updaAccoutStatus(_this)
            // if (!_this.accountStatus.isBindWeChat) {
            // _this.$Modal.newPersonBonus({bonus: false, Content: false,prizeAmount:_this.taskActivity.bindName,crraryMOney:_this.taskActivity.bindMobile})
            // }else if (!this.accountStatus.isBindPhone){
            // 	_this.$Modal.newPersonBonus({bonus: false, Content: false,prizeAmount:_this.taskActivity.bindMobile,crraryMOney:_this.taskActivity.bindWechat})
            // }else{
            // 	_this.$Modal.newPersonBonus({bonus: true, Content: true})
            // }
          } else {

          }
        })
      },
      // 绑定微信号
      setWechat() {
        let _this = this;
        let options = {
          category: 3,
          wechatNum: _this.userNames,
        }
        let swTag = false;
        var total = 0;
        let wechatBonus = 0
        let nextBonus = 0
        let nowindex = this.sortNo.indexOf('bindWechat') + 1
        for (let i in this.taskActivity) {
          total += Number(this.taskActivity[i]);
          if (i === 'bindWechat') {
            wechatBonus = Number(this.taskActivity[i])
            console.log(wechatBonus);
          }
          if (i === this.sortNo[nowindex]) {
            nextBonus = Number(this.taskActivity[i])
            console.log(nextBonus, 'nextBonus');
          }
        }
        let nowtotal = 0
        for (let val of this.sortNo) {
          //arr.push(this.taskActivity[val])
          nowtotal += parseInt(this.taskActivity[val], 10)
        }

        if (this.sortNo.indexOf('bindWechat') === 2) {
          swTag = true;
        }
        this.$http.post('/yx/u/api/personal/bind', options, {emulateJSON: true}).then(res => {
          let data = res.body;
          console.log(data);
          if (data.code === 0) {
            _this.setData({key: 'newPersonModal', value: false})
            console.log(this.sortNo, 'this.taskActivitythis.taskActivity', this.sortNo.length, this.sortNo[0] == 'bindWechat');
            console.log(this.taskActivity, this.sortNo, 'sortNosortNosortNosortNowwwwwwwwwwwwwwwsortNosortNo');
            let arr = []
            for (let val of this.sortNo) {
              arr.push(this.taskActivity[val])
            }
            console.log(this.sortNo.length < 2, this.sortNo[0] == 'bindWechat');
            if (this.sortNo.length < 3 && this.sortNo[this.sortNo.length - 1] == 'bindWechat') {
              //if(this.sortNo.length<2&&this.sortNo[0]=='bindWechat'){
              //if(this.taskActivity.length <0){
              _this.$Modal.newPersonBonus({
                Content: true,
                nowBonus: wechatBonus,
                nextBonus: nextBonus,
                setTotal: nowtotal
              })
            } else {
              _this.$Modal.newPersonBonus({
                bonus: false,
                Content: swTag,
                nowBonus: wechatBonus,
                nextBonus: nextBonus,
                setTotal: nowtotal
              })
              _this.sortNow = parseInt(this.sortNo.indexOf('bindWechat'), 10) + 1
              updaAccoutStatus(_this)
            }
            // 	_this.$Modal.newPersonBonus({bonus: false, Content: false,prizeAmount:_this.taskActivity.bindMobile})
            // getAccoutStatus(this)
            // if (!this.accountStatus.isBindPhone){
            // 	_this.setData({key: 'newTaskMoney', value: _this.taskActivity.bindWechat})
            // 	_this.$Modal.newPersonBonus({bonus: false, Content: false,prizeAmount:_this.taskActivity.bindMobile})
            // }else{
            // 	_this.$Modal.newPersonBonus({bonus: true, Content: true})
            // }
          } else {
            _this.send_code_error = data.message;
          }
        })
      },
      // 绑定手机号
      setPhone() {
        let _this = this;
        let swTag = false;
        var total = 0;
        let nowBonus = 0
        let nextBonus = 0
        let nowindex = this.sortNo.indexOf('bindMobile') + 1
        for (let i in this.taskActivity) {
          total += Number(this.taskActivity[i]);
          if (i === 'bindMobile') {
            nowBonus = Number(this.taskActivity[i])
          }
          if (i === this.sortNo[nowindex]) {
            nextBonus = Number(this.taskActivity[i])
            console.log(nextBonus, 'nextBonus');
          }
        }
        let nowtotal = 0
        for (let val of this.sortNo) {
          // arr.push(this.taskActivity[val])
          nowtotal += parseInt(this.taskActivity[val], 10)
        }
        if (this.sortNo.indexOf('bindMobile') === 2) {
          swTag = true;
        }
        this.$http.post("/yx/u/api/account/bind-phone",
          {phone: _this.phoneNum, phYzCode: _this.yzCode},
          {emulateJSON: true}
        )
          .then(res => {
            let data = res.body;
            console.log(data);
            if (data.code === 0) {
              getAccoutStatus(_this)
              _this.setData({key: 'newPersonModal', value: false})
              console.log(this.taskActivity, this.sortNo, 'sortNosortNosortNosortNosortNosortNo');
              if (this.sortNo.length < 3 && this.sortNo[this.sortNo.length - 1] == 'bindMobile') {
                // if(this.sortNo.length<2 && this.sortNo[0]=='bindMobile'){
                _this.$Modal.newPersonBonus({
                  Content: true,
                  nowBonus: nowBonus,
                  nextBonus: nextBonus,
                  setTotal: nowtotal
                })
              } else {
                _this.$Modal.newPersonBonus({
                  bonus: false,
                  Content: swTag,
                  nowBonus: nowBonus,
                  nextBonus: nextBonus,
                  setTotal: total
                })
              }
              updaAccoutStatus(_this)
            } else {
              _this.send_code_error = data.message;
              /*_this.setData({key: 'newPersonModal', value: false})
              if(this.sortNo.length<3 && this.sortNo[this.sortNo.length-1]=='bindMobile'){
								_this.$Modal.newPersonBonus({ Content: true,nowBonus:nowBonus,nextBonus:nextBonus,setTotal:nowtotal})
							}else{
								_this.$Modal.newPersonBonus({
									bonus: false,
									Content: swTag,
									nowBonus: nowBonus,
									nextBonus: nextBonus,
									setTotal: total
								})
							}*/
              //_this.$Modal.newPersonBonus({ Content: true,nowBonus:nowBonus,nextBonus:nextBonus,setTotal:total})
              // _this.setData({key: 'newPersonModal', value: false})
            }
          });
      },
      selOption() {
        this.phoneType = this.countryType;
      },
      // 检测手机是否绑定
      regCheckphone() {
        let _this = this;
        _this.$http.get('/yx/rg/exist?userName=' + _this.phoneNum).then((response) => {
          let data = response.body;
          console.log(data);
          if (data.data == true) {
            _this.alreadyPhone = true;
            _this.send_code_error = '该手机号已注册'
          } else {
            _this.alreadyPhone = false;
            _this.send_code_error = ''
          }
        })
      },
      // 获取图片验证码
      RefreshSrc() {
        init.registerInit.RefreshSrc(this);
      },
      // 获取验证码
      getCode() {
        let options = {
          phoneNum: this.phoneNum,
          capchaCode: this.imgYzCode,
          checkUnique: false,
          type: 1
        };
        if (!this.phoneNum) {
          this.send_code_error = '请输入手机号码'
          return false
        }
        // this.isCountFinish = true;
        getVerifyCode(this, options);
      },
      goHome() {
        this.$router.push("/");
      },
      initJDbetting() {
        this.$Modal.al_jdbetting = function (data) {
          this.jdBettingList = data
          this.setData({key: 'jd_betting', value: true})
        }.bind(this)
        //使用方法  this.$Modal.al_jdbetting({title:'快速投注',status:'confim',onOk:this.sendImmediatelyBetting})
      },
      init_winning() {
        this.$Modal.al_wining = function (data) {
          this.setData({key: "winningModal", value: true}); // 打开弹框
          this._cuttingArr(data, 5)
        }.bind(this)
        // 使用方法
        // this.$Modal.al_default({status:'warning',content:'这个是标题'})
      },
      // 关闭中奖推送
      cancelWinning(data) { // 关闭中奖推送
        this._formatArr(data);
      },
      // 确定中奖推送
      okWinning(data) { // 确定中奖推送
        this._formatArr(data)
        this.$router.push({path: `/lottery/#${data.id}`})
      },
      _cuttingArr(data, num) {
        let t = this;
        this.timeCount = num;
        this.winningContent = data;
        console.log(data.content, 'content-form-watch');
        t.winningContent.content = data.content;
        t.timerWin = setInterval(function () {
          console.log(data, t.timeCount, 'data_alalal');
          if (t.timeCount <= 1) {
            t._formatArr(data)
          }
          t.timeCount = t.timeCount - 1;
        }, 1000)
      },
      _formatArr(data) {
        let t = this;
        t.setData({key: 'winningModal', value: false}); // 关闭弹框
        let list = t.winningMessageData; // 当前的notice里的数组；
        let formatArr = [];
        for (let i = 0; i < list.length; i++) {
          let item = list[i]; // 当前的数组对象
          let content = item.content
          let arr = content.split('<br/>')
          let name = arr[0].split(':')[1]; // 彩种名称
          let issue = arr[1].split(':')[1]; // 彩种期号
          if (name !== data.name && issue !== data.issue) {
            formatArr.push(item);
          }
        }
        t.currentList = formatArr; // 重置数组
        // clearInterval(t.timerWin);
        if (t.currentList.length > 0) { // 当数组多于2个的时候。
          t.setWinningMessageAgain(t.currentList);
          clearInterval(t.timerWin)
          t.timerWin = false;
          console.log(t.timerWin, 't.timerWin>0')
        } else { // 数组就只有一个的时候
          t.setWinningMessageAgain([]);
          clearInterval(t.timerWin)
          t.timerWin = false;
          console.log(t.timerWin, 't.timerWin====0')
        }
      }
    },
    created() {
      !this.$Modal.al_default && this.init_default();
      !this.$Modal.al_openLottery && this.init_openLottery()
      !this.$Modal.al_openLottery_ssc && this.init_openLottery_ssc()
      !this.$Modal.al_bettingNow && this.init_bettingNow();
      !this.$Modal.al_default_H5 && this.init_default_H5();
      !this.$Modal.al_orderDetail && (this.init_orderDetail(), this.$Modal.withdraw = this.Withdrawal);// 增加一个全局撤单事件
      !this.$Modal.al_chaseDetail && (this.init_chaseDetail());
      !this.$Modal.newPersonModal && this.init_newPersonModal();
      !this.$Modal.newPersonBonus && this.init_newPersonBonus();
      !this.$Modal.thridTransfer_Modal && this.init_thridModal();
      !this.$Modal.modifyFundsPass_Modal && this.init_modifyFundsPass_Modal();
      !this.$Modal.al_jdbetting && this.initJDbetting();
      !this.$Modal.al_wining && this.init_winning();
    },
    mounted() {
      this.RefreshSrc()
    },
  }
</script>

<style lang='less' scoped>
  /*样式全部写在customize.less里面*/
  .alanModal {
    width: 0px;
    height: 0px;
    overflow: hidden; //这个是将打印的页面不显示出来
  }
</style>
