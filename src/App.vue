<template>
  <div id="app">
      <router-view class="view"></router-view>
  </div>
</template>

<script>

	export default {
		name: "pwa-monuments",
		data() {
			return {
				browserMode: ''
			}
		},
		methods: {
			updateOnlineStatus(event) {
				this.browserMode = navigator.onLine
			}
		},
		mounted() {
			this.browserMode =  navigator.onLine
			window.addEventListener('online', this.updateOnlineStatus);
			window.addEventListener('offline', this.updateOnlineStatus);
		}
	}

</script>

<style lang="stylus">
@require '../node_modules/vuetify/src/stylus/app.styl'
 @import url('https://fonts.googleapis.com/css?family=Rubik');

/* fallback */
@font-face
  font-family 'Material Icons'
  font-style normal
  font-weight 400
  src url(./fonts/google_fonts.eot)
  src url(./fonts/google_fonts.woff2) format('woff2'),
       url(./fonts/google_fonts.woff) format('woff'),
        url(./fonts/google_fonts.ttf) format('truetype')

body
	font-size 16px
	color #333
	font-family Rubik !important

@media screen and (orientation: landscape) and (min-width: 568px) {
	body:before {
		content: "Please rotate your device";
		width: 100vw;
		height: 100vh;
		background: #f1f1f1 url("./assets/icons/smartphone.svg") no-repeat 50% 15%;
		background-size: 20%;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		position: fixed;
		z-index: 9999;
		display: block;
		overflow: hidden;
		box-sizing: border-box;
		padding-top: 50vh;
		font-size: 18px;
		font-weight: bold;
		text-align: center;
		color: #666;
	}
	body:after {
		content: "We don't support landscape mode yet. Please go back to potrait mode for best experience";
		width: 90vh;
		height: 25vh;
		text-align: center;
		font-size: 16px;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 5vh;
		z-index: 10000;
		display: block;
		margin: auto;
		color: #666;
	}
}

.offline_mode 
	position: fixed;
	width: 100%;
	height: 100vh;
	background-color: rgba(245, 245, 245, 0.84);
	z-index: 9;

.offline_text
	position: relative;
	top: 40%;
	text-align: center;
	font-size: 16px;
	color: #000;
	padding: 16px;
	background: #ddd;

p
	margin-bottom 0 !important

li
	list-style-type none

.material-icons
	font-family 'Material Icons'
	font-weight 400
	font-style normal
	font-size 24px
	line-height 1
	letter-spacing normal
	text-transform none
	display inline-block
	white-space nowrap
	word-wrap normal
	direction ltr
	-webkit-font-feature-settings 'liga'
	-webkit-font-smoothing antialiased

.monument-header
	padding 0 16px !important
	background #fff !important

.header_arrow_back
	margin-right 10px !important

.tabs__item
	text-transform capitalize
	padding 0 16px

.p16
	padding 0 16px !important

.img-resp
	width 100%
	height auto

.di
	display inline-block
	vertical-align top

.prel
	position relative

.pabs
	position absolute

input
	outline none

.flex-item
	display flex
	align-items center
	height 56px
	border-bottom 1px solid #EFEFF4

.brd-btm
	border-bottom 1px solid #e4e4e4

.pb16
	padding-bottom 16px !important

.monument-information
	.card__text
		padding 16px 0 0 0 !important
	.tabs__content
		h3
			font-weight normal
			font-size 16px
	p,li
		font-size 14px
		color #666

.heading-txt
	font-size 20px
	font-weight normal
	color #333
	padding 16px 0!important

.mt5
	margin-top 5px

.mb15
	margin-bottom 15px
.mt10
	margin-top 10px

.nav-tab
	.theme--dark
	&.tabs__bar
		.tabs__li
			color #333 !important
			font-size 16px

.vdp-datepicker__calendar
	header
		.next,.prev
			display none
		span
			width 100% !important
			background-color #e6e6e6
	div
		font-size 13px
		background-color #f5f5f5
	.cell
		border 1px solid #efefef!important
		&.selected
			background #ea2330!important
			color #fff
.fr {
	float right
}
.redBtn
	box-shadow 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12) !important
	width 100%
	background-color #ea2330 !important
	color #fff !important
	padding 7px
	text-align center
	margin 0

.card__text{
	.input-group__details{
	display: none;
	}
}
.lh15 {
	line-height: 25px;
}
.input-group__details:before, {
	background-color: #e0e0e0;
}
.login-view .primary--text {
	color: #000 !important;
}
.monument-detail .application--wrap {
	padding-bottom: 50px;
}
.input-group__details:after {
	background-color: #1976d2;
}
.input-group.input-group--error .input-group__details:before,.input-group.input-group--error .input-group__details:after {
	background-color: #ea2330;
}
.input-group.input-group--error label,.input-group.input-group--error .input-group__messages {
	color: #ea2330;
}
.c-999 {
	color: #999;
}
.fs14 {
	font-size: 14px;
}
.fs12 {
	font-size: 12px;
}
.lh29 {
		line-height: 29px;
	}
.fs20 {
	font-size: 20px;
}
.fs16 {
	font-size: 16px;
}
.fs18 {
	font-size: 18px
}
.sk-wave {
    width: 100%;
    height: 30px;
    text-align: center;
    font-size: 10px;
    display: inline-block;
	position: absolute;
}
.sk-wave .sk-rect {
   background-color:#dbdbdb;
   height: 100%;
   width:4px;
   margin:0 1px 0 0;
   display: inline-block;
    -webkit-animation: sk-waveStretchDelay 1.2s infinite ease-in-out;
            animation: sk-waveStretchDelay 1.2s infinite ease-in-out; }
  .sk-wave .sk-rect1 {
    -webkit-animation-delay: -1.2s;
            animation-delay: -1.2s; }
  .sk-wave .sk-rect2 {
    -webkit-animation-delay: -1.1s;
            animation-delay: -1.1s; }
  .sk-wave .sk-rect3 {
    -webkit-animation-delay: -1s;
            animation-delay: -1s; }
  .sk-wave .sk-rect4 {
    -webkit-animation-delay: -0.9s;
            animation-delay: -0.9s; }
  .sk-wave .sk-rect5 {
    -webkit-animation-delay: -0.8s;
            animation-delay: -0.8s; }

@-webkit-keyframes sk-waveStretchDelay {
  0%, 40%, 100% {
    -webkit-transform: scaleY(0.4);
            transform: scaleY(0.4); }
  20% {
    -webkit-transform: scaleY(1);
            transform: scaleY(1); } }

@keyframes sk-waveStretchDelay {
  0%, 40%, 100% {
    -webkit-transform: scaleY(0.4);
            transform: scaleY(0.4); }
  20% {
    -webkit-transform: scaleY(1);
            transform: scaleY(1); } }

	.selectedDate {
		.vdp-datepicker__calendar {
			.cell{
				&.selected {
					background: #ea2330;
					color: #fff;
				}
				&.disabled {
					color: #ddd;
    				cursor: default;
				}
			}
		}
	}

	.unselectedDate {
		.vdp-datepicker__calendar {
			.cell.selected{
				background: transparent !important;
				color: black;
			}
		}
	}
    .block-btm {
        h3{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: normal;
        }
			
    }
	.tabs__li .tabs__item {
	font-size: 14px;
}
select{
	outline: none;
}
.ico-sprite {
	background-image: url(./assets/images/sprite.png);
    background-repeat: no-repeat;
    display: inline-block;
    vertical-align: middle;
}
.vdp-datepicker__calendar {
    width: 100% !important;
}
.monument-detail .tabs__item--active{
	color: #ea2330 !important;
}
.bg-white {
	background: #fff;
	height: 100%;
}
.pricefixed .btn {
	background-color: rgb(234, 35, 48) !important;
	box-shadow: none !important;
	color: #fff !important;
	margin-top: 4px;
}
.net-banking .tabs label {
		top: -17px;
		max-width: 90% !important;
		font-size: 14px;
	}
.login-view .primary--text {
    color: rgba(0,0,0,.54)!important;
}
.login-view .icon--radio, .login-view .icon--selection-control {
    font-size: 21px;
    color: #1976d2 !important;
    padding-top: 3px;
}
.confirmation .dialog {
	background: #fff;
}
.login-view .input-group label {
	font-size: 15px;
}
.confirmation .dialog__content__active {
		background: rgba(0,0,0,0.6);
	}
	.list__tile__title {
		color: #333;
	}
	.txt-r {
		text-align: right;
	}
	.info_content img {
		width: 135px;
		min-height: 100px;
		border-radius: 5px;
		margin-bottom: 5px;
	}
	.info_content h3 {
		overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 131px;
	}
    .font-bold {
        font-weight: 700;
        }
    .txt_blue {
        color: #1976d2!important;
        }
</style>
