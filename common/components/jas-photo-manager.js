/**
 * @author gf 2020.06.18
 * @description 图片管理组件
 * @params 
 * @event 
 * @slot 
 */

Vue.component('jas-photo-manager', {
  props: {
    initfiles: {
      default: function () {
        return [];
      }
    },
    colnumber: {
      type: Number,
      default: 5
    },
    label: {
      default: '图片管理'
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
  computed: {
    calcWidthStyle: function () {
      var col = this.colnumber > 5 ? 6 : this.colnumber;
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
    '          <div style="padding: 50%;"></div>',
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
    '          <div style="padding: 50%;"></div>',
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
    seeDetail: function (item) {
      var that = this;
      var aSrc = this.files.map(function (item) {
        return item.src
      });
      var index = aSrc.indexOf(item.src);
      uexImage.openBrowser({
        enableGrid: true,
        displayActionButton: true,
        startIndex: index,
        enableGrid: false,
        data: aSrc,
      });
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
        obj.backgroundImage = 'url(' + item.src + ')';
      }
      // sUrl = sUrl || '/storage/emulated/0/widgetone/apps/001/photo/scan20180906155703.jpg';
      return obj;
    },

    takePhoto: function () {
      var that = this;
      uexCamera.openInternal(0, 75, function (picPath) {
        var arr = picPath.split('/');
        that.files.push({
          fileName: arr[arr.length - 1],
          src: picPath,
        });
      });
    },
    selectPhoto: function () {
      var that = this;
      uexImage.openPicker({
        min: 1,
        max: that.max - that.files.length,
        quality: 0.5,
        detailedInfo: false
      }, function (error, info) {
        info.data && info.data.forEach(function (picPath) {
          var arr = picPath.split('/');
          that.files.push({
            fileName: arr[arr.length - 1],
            src: picPath,
          });
        });
      });
    },



  }
});