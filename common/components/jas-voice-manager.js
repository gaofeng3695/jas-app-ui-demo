/**
 * @author gf 2020.07.09
 * @description 语音管理组件
 * @params 
 * @event 
 * @slot 
 */

Vue.component('jas-voice-manager', {
  props: {
    initfiles: {
      default: function () {
        return [];
      }
    },
    label: {
      default: '语音管理'
    },
    maxTime: {
      default: 60
    },
    max: {
      default: 10
    },
    isview: {
      default: false
    },
    required: {
      default: true
    },
  },
  data: function () {
    var that = this
    return {
      nowTime: 0,
      isRecord: false,
      voiceUp: false,
      files: [],
      sheetVisible: false,
      actions: [{
        name: '拍照',
        method: function () {
          that.takePhoto()
        }
      }, {
        name: '从相册选择',
        method: function () {
          that.selectPhoto()
        }
      }],
    }
  },
  created: function () {
    var that = this;
    this.files = [].concat(this.initfiles);
    appcan.ready(function () {
      uexAudio.onPlayFinished = function () {
        __currentVoice && that.stopPlay(__currentVoice);
      };
    });
  },
  template: [
    '<div class="bgfff">',
    '  <mt-field class="no_border" style="min-height: 32px;background: #fff;" :disabled="true" v-required="!isview&&required"',
    '    :label="label">',
    '    <span v-if="!isview" class="grey4_clr">{{files.length}}/{{max}}</span>',
    '  </mt-field>',
    '  <div style="padding: 5px;margin-top:-10px;">',
    '    <div class="of-h">',

    '      <div v-if="!isview" v-show="files.length < max" style="padding: 5px 10px;">',
    '         <mt-button type="primary" v-if="!isRecord" @click="startRecord" size="large">点击开始录音</mt-button>',
    '         <mt-button type="primary"  v-else @click="endRecord" size="large">点击结束录音</mt-button>',
    '         <div v-if="isRecord">',
    '           <mt-progress :value="(nowTime)/maxTime*100">',
    '             <div slot="end"> <span class="pl10">{{ Math.ceil(maxTime - nowTime) }}s</span> </div>',
    '           </mt-progress>',
    '         </div>',
    '      </div>',

    '      <div v-for="item,index in files" class="" style="margin:0 10px; position: relative;height:44px;padding: 5px 30px 5px 0px;" :style="{\'padding-right\' : isview?\'0\':\'30px\'}">',
    '        <div v-if="!isview" style="padding:5px;position: absolute;top:10px;right: 0px;z-index:9;"',
    '          class="mint-field-clear " @click="deleteItem(item)">',
    '          <i class="mintui mintui-field-error"></i>',
    '        </div>',
    '        <div class="line1 border-1px" @click="clickVoiceItem(item)" style="display:flex;line-height:38px;width: 100%;height: 100%;position: relative;">',
    '           <div class="pl10" style="flex:1;">',
    '              <i v-show="!item.isplay" class="fs18 theme_color1_clr fa fa-play-circle-o"></i>',
    '              <i v-show="item.isplay && voiceUp" class="fs18 theme_color1_clr fa fa-volume-up"></i>',
    '              <i v-show="item.isplay && !voiceUp" class="fs18 theme_color1_clr fa fa-volume-down"></i>',
    '           </div>',
    '           <div v-show="item.fileTime" class="pl10 pr10 grey4_clr" style="">{{item.fileTime + \'s\'}}</div>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>',
  ].join(''),
  methods: {
    startRecord: function () {
      var that = this;
      this.isRecord = true;
      that.nowTime = 0;
      that.myTimer = setInterval(function () {
        // that.nowTime += 0.1
        that.nowTime += (50 / 1000)
        // console.log(that.nowTime)
        if (that.nowTime >= that.maxTime) {
          that.endRecord()
        }
      }, 50)
      this.createTime = jasTools.base.formatDate(new Date(), "yyyyMMddHHmmss");
      window.uexAudio && uexAudio.startBackgroundRecord(0, this.createTime);
    },
    endRecord: function () {
      var that = this;
      this.isRecord = false;
      clearInterval(that.myTimer)
      window.uexAudio && uexAudio.stopBackgroundRecord(function (filePath) {
        that.files.push({
          // "oid": JasbaseOperation.createuuid(), //文件oid 不是对应的表数据oid;
          "fileName": that.createTime, //文件名;
          "dataStatus": 'add',
          "src": filePath,
          "fileTime": Math.floor(that.nowTime * 100) / 100,
          "uploadStatus": '0',
          "isplay": false,
        });
      });

    },
    deleteItem: function (item) {
      var that = this;
      that.$messagebox({
        title: '提示',
        message: '确定执行此操作?',
        showCancelButton: true
      }).then(function (type) { //{ value, action }
        if (type == 'confirm') {
          if (item.oid) {
            if (that.filesToBeDelete) {
              that.filesToBeDelete.push(item.oid);
            } else {
              that.filesToBeDelete = [item.oid];
            }
          }
          var index = that.files.indexOf(item);
          that.files.splice(index, 1);
        }
      });
    },

    clickVoiceItem: function (item, index) {
      var that = this;
      if (item.isplay) {
        that.stopPlay(item);
      } else {
        that.startPlay(item);
      }
    },
    startPlay: function (item) {
      var that = this;
      that.files.forEach(function (item) {
        that.stopPlay(item);
      });
      window.uexAudio && uexAudio.open(item.src);
      window.uexAudio && uexAudio.play(0);
      __currentVoice = item;
      item.isplay = true;
      that.palytimer = setInterval(function () {
        that.voiceUp = !that.voiceUp;
      }, 300)
    },
    stopPlay: function (item) {
      var that = this;
      item.isplay = false;
      window.uexAudio && uexAudio.stop();
      that.palytimer && clearInterval(that.palytimer);
    },
    selectFile: function () {
      var that = this;
      window.uexFileMgr && uexFileMgr.multiExplorer("wgt://", function (err, path) {
        if (!err) {
          if (path && path.length > 0) {
            // 协议头  Android对应路径 (其中"/sdcard/"等 同于"/storage/emulated/0/")    iOS对应路径
            // res://   widget/wgtRes/                                                  widget/wgtRes
            // wgt://   /storage/emulated/0/widgetone/apps/ xxx(widgetAppId)/          /Documents/apps/xxx(widgetAppId)/
            // wgts://  /storage/emulated/0/widgetone/widgets/                         /Documents/widgets/
            // file:///sdcard/  /storage/emulated/0/                                    绝对路径
            for (var i = 0; i < path.length; i++) {
              var file = uexFileMgr.open({
                path: path[i],
                mode: 3
              });
              that.files.push({
                // "oid": JasbaseOperation.createuuid(), //文件oid 不是对应的表数据oid;
                "fileName": path[i].substring(path[i].lastIndexOf('/') + 1), //文件名;
                // "fileSize": uexFileMgr.getFileSize(file), //Byte
                "fileSize": Math.ceil(uexFileMgr.getFileSize(file) / 1024 / 1024 * 100) / 100, //KB计算出MB
                "fileDescription": '',
                "dataStatus": 'add',
                "fileLocalStatus": true,
                "src": path[i],
                "uploadStatus": '0',
              });
            }
            // appcan.logs("--附件--" + JSON.stringify(that.files))
          }
        } else {
          window.Vue && Vue.prototype.$toast('err' + err);
        }
      });

    },



  }
});