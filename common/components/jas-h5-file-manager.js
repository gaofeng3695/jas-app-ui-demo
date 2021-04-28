/**
 * @author gf 2020.06.18
 * @description 文件管理组件
 * @params 
 * @event 
 * @slot 
 */

Vue.component('jas-h5-file-manager', {
  props: {
    initfiles: {
      default: function () {
        return [];
      }
    },
    label: {
      default: '附件管理'
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
      files: [],
    }
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

    '      <div v-if="!isview" v-show="files.length < max" style="height:50px;padding: 5px 10px;">',
    '        <div class="border-1px" @click="selectFile" style=" width: 100%;height: 100%;position: relative;">',
    '          <div class="flex-center grey7_clr " style="width: 100%;height:100%;position: absolute;top: 0;">',
    '            <i class="fa fa-plus fs20" aria-hidden="true"></i>',
    '          </div>',
    '        </div>',
    '        <input type="file" multiple v-show="false" ref="myinput" @change="filechanged($event)" />',
    '      </div>',


    '      <div v-for="item,index in files" class="bottomLine" style="margin:0 10px; position: relative;height:44px;padding: 5px 30px 5px 30px;">',
    '        <div v-if="!isview" style="padding:5px;position: absolute;top:10px;right: 0px;z-index:9;"',
    '          class="mint-field-clear" @click="deleteItem(item)">',
    '          <i class="mintui mintui-field-error"></i>',
    '        </div>',
    '        <div style="padding:5px;position: absolute;top:10px;left: 0px;z-index:9;">',
    '            <i class="fa fa-paperclip fs20 grey4_clr" aria-hidden="true"></i>',
    '        </div>',
    '        <div class="line1 " @click="seeDetail(item)" style="display:flex;line-height:38px;width: 100%;height: 100%;position: relative;">',
    '           <div class="line1" style="flex:1;word-break: break-all;">{{item.fileName}}</div>',
    '           <div v-show="item.fileSize" class="pl10 grey4_clr" style="">{{item.fileSize + \'MB\'}}</div>',
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
    seeDetail: function (fileitem, index) {
      this.$toast('预览文件')
    },
    filechanged: function (e) {
      var files = e.srcElement.files;
      if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var item = files[i];
          console.log(item)
          if (this.files.length == this.max) {
            break;
          };

          this.files.push({
            "fileName": item.name, //文件名;
            "fileSize": Math.ceil(item.size / 1024 / 1024 * 100) / 100, //KB计算出MB
            "fileDescription": '',
            "dataStatus": 'add',
            "fileLocalStatus": true,
            // "src": path[i],
            "file": item,
            "uploadStatus": '0',
          });
        }
      }
    },
    selectFile: function () {
      var that = this;
      $(this.$refs.myinput).trigger('click');
    },



  }
});