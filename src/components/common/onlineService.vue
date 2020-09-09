<template>
    <div class="online-service">
        <c-header>
            <x-header :left-options="{ backText: '' }"
                >在线客服
                <img slot="right" src="../../assets/imgs/wbs/kefu_icon@2x.png" alt="" width="30" />
            </x-header>
        </c-header>
        <div class="content">
            <div class="top">
                <div class="time">{{ systemTime }}</div>
                <img src="../../assets/imgs/wbs/luxiaoge_img@2x.png" alt="" class="logo" width="100px" />
                <div class="chat1">
                    <div class="chat-user">
                        <img src="../../assets/imgs/wbs/kefuluxiaoge_img@2x.png" alt="" />
                    </div>
                    <div class="chat-text">
                        <p style="height: 30px;line-height: 30px;">hello，我是机器人路小哥。</p>
                        <p>您有什么问题想要咨询的，请直接输入内容，小路这边会努力帮您解决哦~</p>
                        <p style="margin-top: 10px;" v-for="(a, b) in questionList" :key="b">
                            <span style="color:#121212;font-weight:bold;">Q{{ b + 1 }}. </span>
                            <a href="javaScript:;" style="color:#15499A;" @click="clickQuestion(a.title, a.knowledgeId)">{{ a.title }}</a>
                        </p>
                        <!-- <p style="line-height:30px;">
                            <span style="color:#121212;">Q2. </span>
                            <a href="javaScript:;" style="color:#15499A;" @click="clickQuestion(a.title)" data="完成司机会员认证但是运单显示未认证怎么办？">完成司机会员认证但是运单显示未认证怎么办？</a>
                        </p> -->
                    </div>
                </div>
            </div>
            <div class="chat-main">
                <ul>
                    <li class="chat-li" v-for="(item, index) in chatList" :key="index" :class="index % 2 == 0 ? ' chat-mine' : ''">
                        <div class="time">{{ item.time }}</div>
                        <div class="chat-user">
                            <img alt="用户头像" :src="[index % 2 == 0 ? src1 : src2]" />
                        </div>
                        <div class="chat-text">
                            <span v-if="index % 2 == 0">{{ item.talk }}</span>
                            <span v-else>
                                <div v-if="item.imgsrc == '' && item.recommendsArr == 0">{{ item.talk }}</div>
                                <div v-else-if="item.imgsrc != '' && item.recommendsArr == 0" id="se-knowledge">
                                    <p>
                                        {{ item.talk }}
                                        <img :src="item.imgsrc" width="300" height="300" />
                                    </p>
                                    <link rel="stylesheet" href="//g.alicdn.com/ikc-fe/kc-editor-theme/pc.css" />
                                </div>
                                <div v-else-if="item.imgsrc == '' && item.recommendsArr != 0">
                                    <div>您想咨询的问题是：</div>
                                    <p style="line-height:30px;" v-for="(c, d) in item.recommendsArr" :key="d">
                                        <span style="color:#121212;font-weight:bold;">Q{{ d + 1 }}. </span>
                                        <a href="javaScript:;" style="color:#15499A;" @click="clickQuestion(c.title, c.knowledgeId)">{{ c.title }}</a>
                                    </p>
                                </div>
                            </span>
                        </div>
                    </li>
                    <!-- <li class="chat-li chat-mine">
                        <div class="time">2019年02月22日 10:24</div>
                        <div class="chat-user">
                            <img src="../../assets/imgs/morentouxiang_img@2x.png" alt="">
                        </div>
                        <div class="chat-text">
                            我想建单，建单异常怎么办？
                        </div>
                    </li>
                    <li class="chat-li">
                        <div class="time">2019年02月22日 10:24</div>
                        <div class="chat-user">
                            <img src="../../assets/imgs/kefuluxiaoge_img@2x.png" alt="">
                        </div>
                        <div class="chat-text">
                            我不是，你是！abcdefghijklmnopqrstuvwxyz
                        </div>
                    </li>
                    <li class="chat-li chat-mine">
                        <div class="time">2019年02月22日 10:24</div>
                        <div class="chat-user">
                            <img src="../../assets/imgs/morentouxiang_img@2x.png" alt="">
                        </div>
                        <div class="chat-text">
                            完成司机认证下一步怎么办？
                        </div>
                    </li>
                    <li class="chat-li">
                        <div class="time">2019年02月22日 10:24</div>
                        <div class="chat-user">
                            <img src="../../assets/imgs/kefuluxiaoge_img@2x.png" alt="">
                        </div>
                        <div class="chat-text">
                            <p>我真不是啊，估计你是吧！</p>
                            <p>我真不是啊，估计你是吧！</p>
                            <p>我真不是啊，估计你是吧！</p>
                            <p>我真不是啊，估计你是吧！</p>
                            <p>我真不是啊，估计你是吧！</p>
                            <p>我真不是啊，估计你是吧！</p>
                        </div>
                    </li> -->
                </ul>
            </div>
        </div>
        <div class="footer" style="height:60px;"></div>
        <div class="chat-footer">
            <div class="chat-send">
                <input type="text" autocomplete="off" class="input" placeholder="我想问..." v-model="condtion" />
                <input type="button" class="button" value="发送" :disabled="buttonFlag" @click="sendMessage(condtion)" />
            </div>
        </div>
    </div>
</template>

<script>
import { getQuestion, gotoCheck, firstQuestion } from '../../api/onlineService.js';
export default {
    name: 'onlineService',
    data() {
        return {
            condtion: '', //输入框输入的值
            buttonFlag: true, //默认不可点击
            chatList: [], //回话集合

            questionList: [], //初始问题集合

            messageId: '',
            sessionId: '',

            systemTime: '',
            src1: require('../../assets/imgs/wbs/morentouxiang_img@2x.png'),
            src2: require('../../assets/imgs/wbs/kefuluxiaoge_img@2x.png'),

            flag: '1' // 控制点击流程
        };
    },
    watch: {
        //监听输入框值的变化
        condtion() {
            if (this.condtion == '') {
                this.buttonFlag = true;
                return;
            }
            this.buttonFlag = false;
        }
    },
    mounted() {
        this.systemTime = this.getTime();
        this.$nextTick(() => {
            firstQuestion()
                .then(res => {
                    //23002
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    if (res.data.reCode == '0') {
                        let result = res.data.result;
                        this.messageId = result.messageId;
                        this.sessionId = result.sessionId;
                        this.questionList = result.recommends;
                    } else {
                        this.$vux.toast.text(res.data.reInfo, 'middle');
                    }
                })
                .catch(err => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    this.$vux.toast.text(err.message, 'middle');
                });
        });
    },
    methods: {
        //获取时间戳
        getTime() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            let minute = date.getMinutes();
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (minute < 10) {
                minute = '0' + minute;
            }
            return year + '年' + month + '月' + day + '日' + ' ' + hour + ':' + minute;
        },
        //点击标题问题
        clickQuestion(item, val) {
            // let val = $event.target.innerText;
            if (this.flag != '1') {
                return;
            }
            this.sendMessage(item, val);
        },
        //点击发送消息
        sendMessage(item, val) {
            if (this.flag != '1') {
                return;
            }
            //操作完消息后，清空input框的值
            this.condtion = '';
            var obj = {
                talk: item,
                time: this.getTime()
            };
            this.chatList.push(obj);
            setTimeout(() => {
                this.gotoBottom();
            }, 20);

            this.flag = '0'; // 没有回复的时候控制不可再次点击

            //判断是直接输入的还是点击问题携带的
            if (val == undefined) {
                let json = {
                    utterance: item,
                    sessionId: this.sessionId
                };
                getQuestion(json)
                    .then(res => {
                        // 23000
                        this.$store.commit('updateLoadingStatus', { isLoading: false });
                        let content;
                        let imgsrc = '';
                        let recommendsArr = [];
                        if (res.data.reCode == '0') {
                            if (res.data.result.knowledge != undefined) {
                                // console.log(res.data.result.knowledge.summary)
                                content = res.data.result.knowledge.summary;
                            } else {
                                if (res.data.result.recommends != undefined) {
                                    recommendsArr = res.data.result.recommends;
                                    content = '';
                                } else {
                                    recommendsArr = [];
                                    content = res.data.result.text.content;
                                }
                            }
                        } else {
                            content = res.data.reInfo;
                        }
                        var obj = {
                            imgsrc: imgsrc,
                            recommendsArr: recommendsArr,
                            talk: content,
                            time: this.getTime()
                        };
                        this.flag = '1'; //有回复的时候，控制可以再次点击
                        this.chatList.push(obj);
                        setTimeout(() => {
                            this.gotoBottom();
                        }, 20);
                    })
                    .catch(err => {
                        this.$store.commit('updateLoadingStatus', { isLoading: false });
                        this.$vux.toast.text(err.message, 'middle');
                    });
                return;
            }
            //点击已经存在的问题会出现图片
            let json = {
                knowledgeId: val,
                sessionId: this.sessionId
            };
            gotoCheck(json)
                .then(res => {
                    //23001
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    let content;
                    let imgsrc = '';
                    let recommendsArr = [];
                    if (res.data.reCode == '0') {
                        // content = res.data.result.knowledge.content;
                        content = res.data.result.knowledge.summary;
                        let imgContent = res.data.result.knowledge.content;
                        //匹配图片（g表示匹配所有结果i表示区分大小写）
                        var imgReg = /<img.*?(?:>|\/>)/gi;
                        //匹配src属性
                        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
                        var arr = imgContent.match(imgReg);
                        if (arr != null) {
                            for (let i = 0; i < arr.length; i++) {
                                imgsrc = arr[i].match(srcReg)[1];
                            }
                        }
                    } else {
                        content = res.data.reInfo;
                    }
                    var obj = {
                        recommendsArr: recommendsArr,
                        talk: content,
                        time: this.getTime(),
                        imgsrc: imgsrc
                    };
                    this.flag = '1'; //有回复的时候，控制可以再次点击
                    this.chatList.push(obj);
                    setTimeout(() => {
                        this.gotoBottom();
                    }, 20);
                })
                .catch(err => {
                    this.$store.commit('updateLoadingStatus', { isLoading: false });
                    this.$vux.toast.text(err.message, 'middle');
                });
        },
        //页面滑动到底部
        gotoBottom() {
            var height = document.querySelector('.chat-main').clientHeight;
            window.scrollTo(0, height);
        }
    }
};
</script>

<style lang="less">
.online-service {
    width: 100%;
    background-color: #efefef;
    position: absolute;
    top: 0px;
    min-height: 100%;
    height: auto;
    overflow-y: scroll;
    @media screen and (max-width: 320px) {
        font-size: 14px;
        .content .logo {
            width: 60px !important;
        }
    }
    @media screen and (max-width: 720px) {
        font-size: 14px;
        .content .logo {
            width: 60px !important;
        }
    }
    .content {
        .top {
            text-align: center;
            padding-top: 30px;
        }
        .time {
            color: #bfbfbf;
            font-size: 14px;
        }
        .logo {
            padding-top: 10px;
            width: 100px;
        }
        .chat1 {
            // width: 100%;
            bottom: 85px;
            padding: 0 0.5rem;
            -webkit-box-sizing: border-box !important;
            -moz-box-sizing: border-box !important;
            box-sizing: border-box !important;
            margin-bottom: 10px;
            padding-left: 75px;
            min-height: 68px;
            .chat-user {
                position: absolute;
                left: 3px;
                width: 40px;
                height: 40px;
                background: #fff;
                border-radius: 100%;
                text-align: center;
                margin-left: 0.5rem;
                img {
                    // width: 30px;
                    height: 40px;
                    border-radius: 100%;
                }
            }
            .chat-text {
                position: relative;
                min-height: 22px;
                line-height: 22px;
                padding: 8px 15px;
                background-color: #fff;
                border-radius: 3px;
                color: #202020;
                word-break: break-word;
                text-align: left;
                max-width: 14rem;
                &::after {
                    content: '';
                    position: absolute;
                    left: -10px;
                    top: 13px;
                    width: 0;
                    height: 0;
                    border-style: solid dashed dashed;
                    border-color: #fff transparent transparent;
                    overflow: hidden;
                    border-width: 10px;
                }
            }
        }
        .chat-main {
            width: 100%;
            bottom: 85px;
            padding: 0 0.5rem;
            -webkit-box-sizing: border-box !important;
            -moz-box-sizing: border-box !important;
            box-sizing: border-box !important;
            ul {
                overflow-x: hidden;
                li {
                    list-style: none;
                    position: relative;
                    margin-bottom: 44px;
                    // padding-left: 60px;
                    // min-height: 68px;
                    .time {
                        width: 100%;
                        position: absolute;
                        top: -18px;
                        text-align: center;
                    }
                    .chat-user {
                        position: absolute;
                        left: 3px;
                        width: 40px;
                        height: 40px;
                        background: #fff;
                        border-radius: 100%;
                        text-align: center;
                        img {
                            // width: 30px;
                            height: 40px;
                            // border-radius: 100%;
                        }
                    }
                    .chat-text {
                        position: relative;
                        min-height: 22px;
                        line-height: 22px;
                        margin-top: 10px;
                        margin-left: 60px;
                        padding: 8px 15px;
                        background-color: #fff;
                        border-radius: 3px;
                        color: #202020;
                        word-break: break-word;
                        display: inline-block;
                        max-width: 13rem;
                        &::after {
                            content: '';
                            position: absolute;
                            left: -10px;
                            top: 13px;
                            width: 0;
                            height: 0;
                            border-style: solid dashed dashed;
                            border-color: #fff transparent transparent;
                            overflow: hidden;
                            border-width: 10px;
                        }
                    }
                }
                .chat-mine {
                    text-align: right;
                    padding-right: 60px;
                    margin-top: 36px;
                    min-height: 44px;
                    .chat-user {
                        width: 40px;
                        height: 40px;
                        border-radius: 100%;
                        background: #1581cf;
                        position: absolute;
                        left: auto;
                        right: 3px;
                        text-align: center;
                        img {
                            height: 25px;
                            width: 20px;
                            margin-top: 6px;
                            // border-radius: 100%;
                        }
                    }
                    .chat-text {
                        margin-left: 0;
                        text-align: left;
                        background-color: #1581cf;
                        color: #fff;
                        position: relative;
                        min-height: 22px;
                        line-height: 22px;
                        margin-top: 10px;
                        padding: 8px 15px;
                        border-radius: 3px;
                        word-break: break-word;
                        display: inline-block;
                        max-width: 13rem;
                        &::after {
                            content: '';
                            position: absolute;
                            top: 13px;
                            width: 0;
                            height: 0;
                            border-style: solid dashed dashed;
                            border-color: #fff transparent transparent;
                            overflow: hidden;
                            border-width: 10px;
                            left: auto;
                            right: -10px;
                            border-top-color: #1581cf;
                        }
                    }
                }
            }
        }
    }
    .chat-footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 40px;
        padding: 10px;
        background: #fff;
        .chat-send {
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            .input {
                -webkit-appearance: none;
                -webkit-box-flex: 1;
                -webkit-flex: 1;
                flex: 1;
                height: 40px;
                padding-left: 10px;
                border: 0;
                background-color: #fff;
                border-radius: 3px;
                border: 1px solid #dcdcdc;
                font-size: 16px;
                color: #202020;
                &::-webkit-input-placeholder {
                    color: #bfbfbf;
                    font-size: 14px;
                }
            }
            .button {
                -webkit-appearance: none;
                height: 4em;
                border-radius: 3px;
                height: 40px;
                padding: 0 15px;
                border: 0;
                margin-left: 10px;
                margin-right: 20px;
                background-color: #ffba00;
                color: #fff;
                &:disabled {
                    background: #dcdcdc;
                }
            }
        }
    }
}
</style>
