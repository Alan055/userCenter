<template>
	<div id="userProxy-wrapper">
		<div class="manager-box">
			<div class="user-proxy manager">
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
  export default {
    methods: {
      getHtml () {
        $('.daterangepicker').remove()
        $.get('/static/uc_new/proxy.html', function (fhtml) {
          $('.user-proxy').html(fhtml)
          AppData.init()
          initProxy()
        })
      }
    },
    mounted () {
      this.getHtml()
    },
    watch: {
      '$route' (to) {
        this.getHtml()
      }
    }
  }
</script>

<style lang="stylus">
	#userProxy-wrapper {
		// border:1px solid #e1e1e1;
		.user-proxy {
			div.content #tab01 div.tabs a{
			  height: 33px;
				width: 82px;
				display: block;
				float: left;
				line-height: 33px;
				text-align: center;
				color: #666;
				margin: 0 10px 10px 0;
				transition: all .2s ease 0s;
				cursor: pointer;
				background: #fff;
				border-radius: 4px;
				font-size: 14px;
				border: 1px solid #e1e4e8;
			}
			div.content #tab01 div.tabs a.active{
				color: #fff;
				border: 1px solid #5fc1f0;
				background: linear-gradient(to right, #81b0ff, #6387fc);
			}
			.usercenterMmain_contR_card {
				li {
					padding: 15px 0 18px 0;
					margin-top: 20px;
					line-height: 20px;
					border-top-left-radius: 8px;
					border-top-right-radius: 8px;
					border: 1px solid #ccc;
					i {
						margin: 40px 0 0 20px;
					}
					label {
						b {
							margin-left: 15px;
							display: block;
							text-align: left;
							font-weight: bold;
						}
						p {
							font-size: 12px;
							float: left;
							text-align: left;
							padding-left: 20px;
							line-height: 18px;
							margin-top: 5px;
						}
					}
				}
			}
			.total {
				/*100%
				&.item {
					width: 190px
				}*/
			}
			.result {
				clear: both
			}
			div.proxy-index {
				div.team-info {
					height: 100px;
					ul {
						display: flex;
						background: #EDF3FB;
						li {
							height: 100px;
							&:not(:first-child) {
								flex: 1
							}
							div.icon_box {
								width: 65px;
								height: 100%;
								position: relative;
								text-align: center;
								padding: 15px 0 0 10px;
								i {
									font-size: 45px;
								}
								img {
									width: 40px;
								}
							}
							div.team_preview_info {
								/*margin: 0 0 0 65px;*/
								height: 100%;
								padding: 15px 0 0 0;
								h2 {
									font-weight: normal;
									font-size: 14px;
									line-height: 20px;
									& > span {
										font-size: 18px;
									}
								}
								p {
									font-size: 12px;
									color: #999;
								}
							}
						}
					}
				}
				& > div.tabNav {
					padding: 0;
					height: 48px;
					line-height: 48px;
					& > div.row {
						padding: 0;
						line-height: 48px;
						div.x-radio {
							width: 40%;
							float: left;
							height: 100%;
							padding: 0 20px;
							font-size: 0;
							a {
								float: left;
								margin: 9px 10px 0 0;
								height: 30px;
								line-height: 30px;
								padding: 0 10px;
								font-size: 14px;
								border: 1px solid #E0E0E0;
								// background: linear-gradient(to right, #81b0ff, #6387fc);
							}
						}
						div.x-date-range {
							height: 100%;
							float: left;
							line-height: 48px;
							span {
								float: left;
								padding: 0;
							}
							& > input {
								float: left;
								width: 110px;
								height: 30px;
								margin: 9px 0 0 0;
								padding: 0;
								text-align: center;
								cursor: pointer;
							}
							& > input[name='sDate'] {
								border-right: none;
							}
							& > input[name='eDate'] {
								border-left: none;
							}
							label {
								float: left;
								height: 30px;
								line-height: 28px;
								padding: 0;
								margin: 9px 0 0 0;
								border-bottom: 1px solid #E8E8E8;
								border-top: 1px solid #E8E8E8;
							}
						}
						div.x-search {
							float: right;
							margin: 0 20px 0 0;
						}
					}
				}
				& > div.result {
					padding: 0;
					div.total {
						width: 100%;
						margin:15px auto;
						div.item {
							/*margin: 0;
							height: 100%;
							border: none;*/
							div.iconBox {
								float: left;
								text-align: right;
								line-height: 90px;
								width: 52px
								height: 52px
								border-radius: 50%
								background-color: rgb(243, 246, 249);
								margin: 20px 0
								i {
									font-size: 24px;
									display: block;
									margin: 7px
									border-radius: 50%
									width: 38px
									height: 38px
									text-align: center
									line-height: 42px
									background: rgb(145, 152, 165)
									color: #fff
								}
							}
							div.value {
								/*height: 50%;
								text-align: left;
								margin: 0 0 0 60px;
								padding: 15px 0 0 10px;
								font-size: 24px;*/
								span {
									color: #666;
								}
							}
							div.label {
								/*height: 50%;
								text-align: left;
								margin: 0 0 0 60px;
								padding: 0 0 0 10px;
								vertical-align: top;
								color: #999;*/
								font-size: 14px;
							}
						}
					}
					div.radio-group {
						label {
							input {
							
							}
						}
					}
					div.chart {
						background: #fff;
					}
				}
			}
			div.tabsLys {
				border-bottom : 1px solid #E1E4E8;
				div.tab {
					float: left;
					width: 700px;
					padding: 10px 0 0 15px;
					a {
						height: 33px;
						width: 82px;
						display: block;
						float: left;
						line-height: 33px;
						text-align: center;
						color: #666;
						margin: 0 10px 10px 0;
						transition: all .2s ease 0s;
						cursor: pointer;
						background: #fff;
						border-radius: 4px;
						font-size: 14px;
						border: 1px solid #E1E4E8;
					}
					a.active {
						color: #fff;
						// border: 1px solid #5FC1F0;
						background: linear-gradient(to right, #81b0ff, #6387fc);
					}
				}
				span {
					float: right;
					margin: 15px 10px 0 0;
					color: #333;
					i {
						padding: 0 7px;
						border-radius: 50%;
						color: #fff;
						background: #F98100;
					}
				}
			}
			div.panels {
				input.button {
					display: inline-block;
					height: 35px;
					background: linear-gradient(to right, #81b0ff, #6387fc);
					min-width: 200px;
				}
			}
			.proxyNotice {
				width: 90%;
				margin: 30px auto;
				background: #edf3fb;
				padding: 15px 20px;
			}
			.radio-group {
				display: block;
				div {
					display: inline-block;
					width: 78px;
					height: 32px;
					text-align: center;
					line-height: 32px;
					color: gray;
					background: #fff;
					border: 1px solid #ebebeb;
					cursor: pointer
				}
				div.groupDiv {
					color: #fff;
					background: linear-gradient(to right, #81b0ff, #6387fc);
					// border: 1px solid #5FC1F0;
				}
			}
			.easyweb-pagination {
				padding: 10px 20px
			}
		}
	}
</style>
