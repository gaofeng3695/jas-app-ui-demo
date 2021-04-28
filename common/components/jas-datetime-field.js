/**
 * @author gf 2020.07.14
 * @description 时间日期选择表单项
 */
Vue.component('jas-datetime-field', {
  props: {
    type: { // date datetime 
      default: 'date'
    }, // date time datetime
    field: {},
    label: {},
    valueFormat: {}, //年 yyyy，月 MM，日 dd，小时 HH，分 mm，秒 ss 'yyyy-MM-dd HH:mm:ss'
    labelfield: {},
    value: {},
    placeholder: {},
    disabled: {},
    startDate: {}, // 开始日期
    endDate: {}, // 结束日期
  },
  data: function () {
    return {
      popupVisible: false,
      _valueFormat: 'yyyy-MM-dd HH:mm:ss',
    }
  },
  created: function () {
    if (this.valueFormat) {
      this._valueFormat = this.valueFormat;
    } else {
      this._valueFormat = this.type == 'date' ? 'yyyy-MM-dd' : this._valueFormat;
      this._valueFormat = ['datetime', 'time'].indexOf(this.type) > -1 ? 'yyyy-MM-dd HH:mm:ss' : this._valueFormat;
    }
  },
  computed: {
    _value: {
      get: function () {
        var that = this;
        return this.value
      },
      set: function (newval) {
        var that = this;
        // if (this.type != 'time') {
        //   var val = this.formatDate(newval, this._valueFormat);
        // } else {
        //   var val = newval;
        // }
        // that.$emit('input', val);
        // that.$emit('change', val);

      }
    },

  },
  template: [
    '<div>',
    '<a class="mint-cell mint-field" style="">',
    '  <div class="mint-cell-left"></div>',
    '  <div class="mint-cell-wrapper">',
    '    <div class="mint-cell-title" style="padding:8px 0;">',
    '      <span class="mint-cell-text" style="line-height:1.2;">{{label}}</span>',
    '    </div>',
    '    <div @click="showOptions" class="mint-cell-value" style=" padding:4px 0 0 10px;line-height:1.4;" >',
    '<div style="width:100%;":style="isDisabled()">',
    '      <span >{{value}}</span>',
    '      <span  v-show="!value" style="color: rgb(192, 192, 192)">{{placeholder || ( \'请选择\'+ label)}}</span>',
    '</div>',
    '    </div>',
    '    <span v-show="!disabled" style="color:#888;" @click="showOptions">',
    '      <i class="fa fa-angle-down" aria-hidden="true"></i>',
    '    </span>',
    '  </div>',
    '  <div class="mint-cell-right"></div>',
    '</a>',

    '<mt-datetime-picker ref="picker" :start-date="startDate" :end-date="endDate" v-model="_value" :type="type" @confirm="handleConfirm"></mt-datetime-picker>',

    '</div>'
  ].join(''),
  methods: {
    clearValue: function () {
      this._value = null;
    },
    handleConfirm: function (newval) {
      var that = this;
      if (this.type != 'time' && typeof newval != 'string') {
        var val = this.formatDate(newval, this._valueFormat);
      } else {
        var val = newval;
      }
      that.$emit('input', val);
      that.$emit('change', val);
    },
    showOptions: function () {
      if (this.disabled) return;
      this.$refs.picker.open();
      this.$emit('optionshowed');
    },
    isDisabled: function () {
      var that = this;
      if (that.disabled && (that.labelfield != "projectName" && that.labelfield != "project_name")) {
        return {
          background: 'rgb(235, 235, 228)',
        }
      }
      return {};
    },
    formatDate: function (oDate, sFormat) { // 入参：date对象，格式化格式
      /*
       * 例子：
       * formatDate(new Date(),"yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423
       * formatDate(new Date(),"yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18
       * formatDate(new Date(),"yyyyMMddHHmmssS")      ==> 20060702080904423
       */
      var o = {
        "M+": oDate.getMonth() + 1, //月份
        "d+": oDate.getDate(), //日
        "H+": oDate.getHours(), //小时
        "m+": oDate.getMinutes(), //分
        "s+": oDate.getSeconds(), //秒
        "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
        "S": oDate.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(sFormat)) sFormat = sFormat.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(sFormat)) sFormat = sFormat.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return sFormat;
    }
  }
});