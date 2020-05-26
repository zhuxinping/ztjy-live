<template>
    <div class="vod-container">
        <van-popup
                v-model="show"
                round
                position="bottom"
                :style="{ height: '30%' }"
        >
            <ul>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
                <li style="height: 50px;line-height: 50px;text-align: center;">12</li>
            </ul>
        </van-popup>

        <div v-if="vodlist.length>0">
            <div @click="toplay(item)" v-for="(item,index) in vodlist" :key="index" class="vodlist">
                <div class="vodlistpic">
                    <img v-if="playInfo.livebackground" :src='playInfo.livebackground+"?imageView2/5/w/672/h/432"' alt="">
                    <img v-else :src='defaultimg+"?imageView2/5/w/672/h/432"' alt="">
                    <p class="vodlisttime">{{item.time}}</p>
                </div>
                <div class="vodlistTitle">
                    <p>{{item.vodtitle}}</p>
                </div>
            </div>
        </div>
        <div v-if="vodlist.length == 0" class="empty">
            <img :src="nodataimg" alt="">
            <p>哎呀，没有可观看的内容</p>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            vodlist: {
                type: Array,
                default: function () {
                    return [
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        },
                        {
                            'vodtitle' : '121',
                            'time' : '2020-2-2'
                        }
                    ]
                }
            },
            playInfo: {
                type: Object,
                default: function () {
                    return { }
                }
            }
        },
        data () {
            return {
                show:true,
                nodatashow: false,
                nodataimg: require('@/assets/images/live/icon_qs1@3x.png'),
                defaultimg: require('@/assets/images/live/video_cover.png')
            }
        },
        methods: {
            toplay (item) {
                this.$emit('toplay', { watchType: 1, item: item })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .vod-container {
        font-size: 40px;
        padding: 40px;
        .vodlist {
            width: 100%;
            height: 194.6px;
            margin: 0 auto;
            margin-bottom: 40px;
            list-style: none;
        }
        .vodlistpic {
            float: left;
            width: 224px;
            height: 146px;
            position: relative;
            img {
                width: 224px;
                height: 146px;
                border-radius: 8px;
                background-size: 100% 100%;
            }
            .vodlisttime {
                display: block;
                margin-top: -24px;
                font-size: 20px;
                text-align: right;
                width: 100%;
                color: #ffF;
                background: url(../../../assets/images/live/bg_mb_jcnr@3x.png);
                background-size: 100% 100%;
                padding: 0 5px;
                box-sizing: border-box;
                position: absolute;
                bottom: 0;
                left: 0;
            }
        }
        .vodlistTitle {
            padding-left: 24px;
            height: 146px;
            width: 58%;
            font-size: 32px;
            align-items: center;
            display: -webkit-flex;
            p {
                display: table-cell;
                vertical-align: middle;
                width: 100%;
                float: left;
                color: #333;
                font-size: 32px;
            }
        }
    }
    .empty{
        text-align: center;
        padding: 100px 0;
        background: #fff;
    }
    .empty img{
        width: 501px;
        height: 291px;
    }
    .empty p{
        margin-top: 20px;
        font-size: 32px;
        color: #333333;
    }
</style>
