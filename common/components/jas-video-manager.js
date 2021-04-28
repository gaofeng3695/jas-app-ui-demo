/**
 * @author gf 2020.06.18
 * @description 视频管理组件
 * @params 
 * @event 
 * @slot 
 */

Vue.component('jas-video-manager', {
  props: {
    initfiles: {
      default: function () {
        return [];
      }
    },
    colnumber: {
      type: Number,
      default: 4
    },
    label: {
      default: '视频管理'
    },
    max: {
      default: 20
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
      files: [],
      sheetVisible: false,
      actions: [{
        name: '拍摄',
        method: function () {
          that.takeVideo()
        }
      }, {
        name: '从相册选择',
        method: function () {
          that.selectVideo()
        }
      }],
    }
  },
  computed: {
    calcWidthStyle: function () {
      var col = this.colnumber > 4 ? 5 : this.colnumber;
      return {
        width: Math.floor(10000 / col) / 100 + '%'
      }
    },
  },
  created: function () {
    this.files = [].concat(this.initfiles)
  },
  template: [
    '<div class="bgfff">',
    '  <mt-field class="no_border" style="min-height: 32px;background: #fff;" :disabled="true" v-required="!isview&&required"',
    '    :label="label">',
    '    <span v-if="!isview" class="grey4_clr">{{files.length}}/{{max}}</span>',
    '  </mt-field>',
    '  <div style="padding: 5px;margin-top:-10px;">',
    '    <div class="of-h">',
    '      <div v-if="!isview" v-show="files.length < max" :style="calcWidthStyle" style="float: left; padding: 5px;">',
    '        <div class="border-1px" @click="sheetVisible = !sheetVisible"',
    '          style=" width: 100%;height: 100%;position: relative;">',
    '          <div style="padding: 66%;"></div>',
    '          <div class="flex-center grey7_clr " style="width: 100%;height:100%;position: absolute;top: 0;">',
    '            <i class="fa fa-plus fs20" aria-hidden="true"></i>',
    '          </div>',
    '        </div>',
    '      </div>',
    '      <mt-actionsheet :actions="actions" v-model="sheetVisible"> </mt-actionsheet>',
    '      <div v-for="item,index in files" :style="calcWidthStyle" style="position: relative;float: left;padding: 5px;">',
    '        <div v-if="!isview" style="padding:8px 8px 0 0;position: absolute;top:0px;right: 0px;z-index:9;"',
    '          class="mint-field-clear" @click="deleteItem(item)">',
    '          <i class="mintui mintui-field-error"></i>',
    '        </div>',
    '        <div class="border-1px" @click="seeDetail(item)"',
    '          style=" width: 100%;height: 100%;position: relative;" :style="styleBgImg(item)">',
    '          <div style="padding: 66%;"></div>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>',
  ].join(''),
  methods: {
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
    seeDetail: function (file) {
      var that = this;
      if (!file.oid) { //是否是本地上传的数据
        file.src && uexVideo.open(file.src);
      }
    },
    styleBgImg: function (item) {
      var obj = {
        backgroundImage: '', //url(' + sUrl + ')
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      };
      if (item.oid && !item.src) {
        var src = [
          jasTools.ajax.serverURL,
          // 'DAQProject/attachment/download.do?oid=',
          'DAQProject/attachment/app/getImageBySize.do?oid=',
          item.oid,
          '&token=',
          localStorage.getItem("token") || '44b4b165-838f-456c-b0fa-75be3bf8fc38'
        ].join('');
        item.src = src;
        obj.backgroundImage = 'url(' + src + ')';
      } else {
        obj.backgroundImage = 'url(' + bgsrc + ')';
      }
      // sUrl = sUrl || '/storage/emulated/0/widgetone/apps/001/photo/scan20180906155703.jpg';
      return obj;
    },

    takeVideo: function () {
      var that = this;
      var params = {
        maxDuration: 60, //视频录制最大时间,单位s(秒)
        qualityType: 1, //视频分辨率类型,取值为0,1,2,默认为0.0:1920x1080, 1:1280x720, 2:640x480
        bitRateType: 1, //视频录制时采样率类型,取值为0, 1, 2, 默认为0, 0: 高采样率, 1: 中采样率, 2: 低采样率
        fileType: "mp4", //输出的视频文件格式,默认为mp4.Android 平台上支持的的视频文件格式有:mp4、3gp; IOS支持的压缩视频文件格式有:mp4,mov
      }
      uexVideo.record(JSON.stringify(params));
      uexVideo.onRecordFinish = function (info) {
        var data = JSON.parse(info);
        if (data.result == 1) { //1取消选择   0录制成功
          return;
        }
        var obj = {
          type: "video",
          src: data.path,
        }
        that.files.push(obj);
      };
    },
    selectVideo: function () {
      var that = this;
      uexVideo.videoPicker();
      uexVideo.onVideoPickerClosed = function (data) { //视频选择后的回调
        if (data.isCancelled) { //取消选择
          return;
        }
        var data = data.data;
        var obj = {
          type: "video",
          src: data[0].src,
        }
        that.files.push(obj);
      };

    },



  }
});


var bgsrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAEECAIAAADiZ+yyAAAACXBIWXMAAAsTAAALEwEAmpwYAAALmmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA3LTA5VDE1OjEzOjIzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNy0wOVQxNjoyMzoxMyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNy0wOVQxNjoyMzoxMyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiMjY2ZTAyZC1kMGY4LWEzNDUtYmU0Mi00YmQ0NjJmZTZkNjMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmMDJmMzYzYi01NDg1LWMzNDktOTZmMS00N2U4MGFhNjk0ZTEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4OTJmYTNmOC02ZjA3LWI4NDgtOWQ2ZS1hYjExZDBjYjBjOGQiPiA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8cmRmOkJhZz4gPHJkZjpsaT40Mjc5MTU1RUI0REI1NzM1MTEzRjVBQUNFNEVCMEFENTwvcmRmOmxpPiA8cmRmOmxpPjRGNTNGMzBFNDI1NThEOTZFRTQ3OEI3NDhDRTE1Mjk5PC9yZGY6bGk+IDxyZGY6bGk+NUEyOEE0MTI3NjI4QTlBMDI2Qjc5ODI1MDgwNkUxMjg8L3JkZjpsaT4gPHJkZjpsaT42RkYwQTlGQkIxNTBEMjUyNTVGMzc4M0ZDOTRDN0M4NzwvcmRmOmxpPiA8cmRmOmxpPjg2NDQzODEwMjFENDg5NTE1NTU0ODg3MjM5OTVGOTJFPC9yZGY6bGk+IDxyZGY6bGk+OEIzREQyMzMxQjg0MTcwN0VBMDZEQjM2OEM5MTZEOTE8L3JkZjpsaT4gPHJkZjpsaT5EOEIyRUQwREVBMEQyRDQzMzIzNzU0OTk5QjkwRUFCQzwvcmRmOmxpPiA8cmRmOmxpPkU4NzQ4QjZFODMxRUM1NUNDOUVEQjY4NUE2RUJDMzIzPC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDowNjU2MDEzMzQ1NTlFQTExODQxNUVFQ0I4RTA0MEYxNjwvcmRmOmxpPiA8cmRmOmxpPnhtcC5kaWQ6MzQ4MDBlNTktMmIxOC1mYTQxLWExMjEtYTZiM2NhYzFiZWE1PC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDozQzlCODQ2QkI5NjhFQTExQTJDMUJDRDgwQzY2MDQwNjwvcmRmOmxpPiA8cmRmOmxpPnhtcC5kaWQ6NEI4M0REMzkzNjY4RUExMUI2OEJEQTE0NTAyQ0FENjQ8L3JkZjpsaT4gPHJkZjpsaT54bXAuZGlkOjRDODNERDM5MzY2OEVBMTFCNjhCREExNDUwMkNBRDY0PC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDo1OUY1RkJBODQ1NkFFQTExOEFDNDhCREM1NkI1NzBDRDwvcmRmOmxpPiA8cmRmOmxpPnhtcC5kaWQ6OGM3YWM3NzktMDE4Zi1hMzRmLWJiYTItYzVlNjcwMTczMmM1PC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDo5MDlEQjBEMjM4NjhFQTExQjY4QkRBMTQ1MDJDQUQ2NDwvcmRmOmxpPiA8cmRmOmxpPnhtcC5kaWQ6OTY3RTY5M0UzNzY4RUExMUI2OEJEQTE0NTAyQ0FENjQ8L3JkZjpsaT4gPHJkZjpsaT54bXAuZGlkOkJGNjkzMzA4QTE2MUVBMTE5RUY3REMxMjhDMDc2RkNGPC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDpGNTZDRDgxRTIyNUNFQTExOTY1M0FBNDNCMDkzQ0M1NDwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg5MmZhM2Y4LTZmMDctYjg0OC05ZDZlLWFiMTFkMGNiMGM4ZCIgc3RFdnQ6d2hlbj0iMjAyMC0wNy0wOVQxNToxMzoyMyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUwOWQ5MTRiLWE3MzYtNTg0Yi1hMTM5LTc3NGIxOWFkNzRlOSIgc3RFdnQ6d2hlbj0iMjAyMC0wNy0wOVQxNToxNjo1NiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIw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'