/**
 * @author gf 2018.08.08
 * @description 通用组件
 * @list 
 * 1. jas-header 头部组件
 * 1. jas-group-header 头部组件
 * 1. jas-button-footer footer组件1
 * 1. jas-more-button-footer footer组件2
 * 1. jas-base-checkbox 复选框组件
 * 1. jas-select-field 下拉选组件
 * 1. jas-detail-field 字段详情组件
 * 1. jas-detail-field-simple 字段详情简易组件
 * 
 * 1. jas-detail-field-group 字段详情组组件
 * 
 */

/* ------指令------------------------------------------------------------------------- */
/**
 * @author gf 2018.08.10
 * @description 设定需要撑满剩余空间的div高度
 */
Vue.directive('setheight', function (el) {
  var otherHeight = 0;
  setTimeout(function () {
    var arr = el.parentElement.children;

    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item !== el) {
        otherHeight += item.clientHeight;
      }
    }
    // var otherHeightpx = otherHeight + 'px';
    el.style.height = 'calc(100% - ' + otherHeight + 'px)';
    el.style.overflow = 'auto';
  }, 0);
});

Vue.directive('required', {
  bind: function (el, binding) {
    if (!binding.value) return;
    var html = '<span class="required" style="line-height:1.2;color:red;">*</span>';
    $(el).find('.mint-cell-title').eq(0).append(html);

  },
  update: function (el, binding) {
    if (binding.value != binding.oldValue) {
      if (binding.oldValue && !binding.value) {
        //进行删除
        $(el).find('.mint-cell-title').find(".required").remove();
      }
      if (!binding.oldValue && binding.value) {
        var html = '<span  class="required" style="line-height:1.2;color:red;">*</span>';
        $(el).find('.mint-cell-title').eq(0).append(html);
      }

    }
  }
});

Vue.directive('fieldicon', {
  bind: function (el, binding) {
    if (!binding.value) return;
    if (binding.value === 'date') {
      var html = '<i class="fa fa-calendar" style="color:#666;padding: 6px 0 6px 6px;" aria-hidden="true"></i>';
      $(el).find('.mint-cell-wrapper').eq(0).append(html);
    }
    if (binding.value === 'barcode') {
      var html = '<i class="fa fa-barcode" style="color:#666;padding: 6px 0 6px 6px;" aria-hidden="true"></i>';
      $(el).find('.mint-cell-wrapper').eq(0).append(html);
    }
  }
});


/* ------组件------------------------------------------------------------------------- */



/**
 * @author gf 2020.05.21
 * @description 分组标题
 */
Vue.component('jas-group-header', {
  props: {
    title: {},
  },
  data: function () {
    return {}
  },
  template: [
    '<div class="  bgfff mt10" style="display: flex;flex-direction: row;line-height: 36px;">',
    '<div class="pl10 pr10 link_color1_clr">',
    '  <i class="fa fa-bookmark fs20" aria-hidden="true"></i>',
    '</div>',
    '<div class="fs16 line1 grey1_clr" style="flex: 1;">',
    '  {{title}}',
    '</div>',
    '<div class="pl10 pr10 clearfix">',
    '</div>',
    '</div>',
  ].join(''),
  methods: {}
});


/**
 * @author gf 2020.05.21
 * @description 分组标题
 */
Vue.component('jas-detail-header', {
  props: {
    title: {},
    noline: {}
  },
  data: function () {
    return {}
  },
  template: [
    '<div class="bgfff  pt8 pb8"  :class="noline?\'\':\'bottomLine\'" style="display:flex;align-items:center;">',
    '  <div class="theme_color1" style="width:4px;height:12px;margin-right:6px;">',
    // '    <i class="theme_color1_clr fa fa-arrows fs12" aria-hidden="true"></i>',
    '  </div>',
    '  <div class="f1 grey1_clr">{{title}}</div>',
    '</div>',
  ].join(''),
  methods: {}
});




/**
 * @author gf 2020.05.28
 * @description 多选框组件
 */
Vue.component('jas-base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: {
      default: false,
      type: Boolean,
    },
    label: {},
  },
  data: function () {
    return {

    }
  },
  template: [
    '<label class="mint-checklist-label" style="padding:0px  ">',
    '  <span class="mint-checkbox" style="display:inline-block">',
    '    <input type="checkbox" class="mint-checkbox-input" :checked="checked" @change="$emit(\'change\', $event.target.checked)">',
    '    <span class="mint-checkbox-core"></span>',
    '    <span class="mint-checkbox-label">{{label}}</span>',
    '  </span>',
    '</label>',
  ].join(''),
  methods: {}
});


/**
 * @author gf 2018.08.09
 * @description 上啦刷新，下拉加载,自带请求
 */
Vue.component('jas-scroll-list-box', {
  props: {
    url: {},
    params: {},
    value: {}, // v-model
  },
  data: function () {
    return {
      pageNo: 1,
      pageSize: 10,
      allLoaded: false,
    }
  },
  template: [
    '<mt-loadmore ref="loadmore" :top-method="refresh" :auto-fill="false" :bottom-method="loadBottom":bottom-all-loaded="allLoaded">',
    '  <slot></slot>',
    '</mt-loadmore>',
  ].join(''),
  created: function () {},
  mounted: function () {},
  methods: {
    refresh: function () {
      var that = this;
      this.pageNo = 1;
      this.allLoaded = false;
      this._requestMedianStake();
    },
    loadBottom: function () {
      if (this.allLoaded) {
        return;
      }
      this._requestMedianStake();
    },
    _requestMedianStake: function () {
      var that = this;
      var obj = jasTools.base.extend({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }, this.params);
      jasTools.ajax.post(this.url, obj, function (data) {
        if (data.rows.length > 0) {
          if (that.pageNo === 1) {
            that.listData = data.rows;
            that.$emit('input', data.rows);
          } else {
            that.$emit('input', that.value.concat(data.rows));
          }
          that.pageNo++;
        } else {
          that.allLoaded = true;
          that.$toast('没有更多数据');
        }
        that.$refs.loadmore.onTopLoaded();
        that.$refs.loadmore.onBottomLoaded();
      }, function () {
        that.$refs.loadmore.onTopLoaded();
        that.$refs.loadmore.onBottomLoaded();
      });
    },
  }
});

/**
 * @author gf 2020.06.02
 * @description 页面卡片的按钮栏，带主要按钮，次要按钮，及更多按钮
 * @event clickbtn
 */
Vue.component('jas-more-button-row', {
  props: {
    mainbuttons: {
      type: Array,
      default: function () {
        return [];
      }
    },
    otherbuttons: {
      type: Array,
      default: function () {
        return [];
      }
    },
    morebuttons: {
      type: Array,
      default: function () {
        return [];
      }
    },
  },
  data: function () {
    return {
      pop: false
    }
  },
  template: [
    '<div style="display: flex;align-items: center;" class="pt10 pr10">',
    '  <div v-if="morebuttons.length>0" style="height: 24px;position: relative;">',
    '    <div v-show="pop"  class="bgfff"',
    '      style="min-width: 90px; position: absolute;border: 1px solid #ececec;border-radius:4px;top:100%;padding: 6px 14px;box-shadow: 2px 2px 4px 0px #ececec;">',
    '      <div style="height: 28px;" v-for="item in morebuttons"><button @click="clickbtn(item);pop=!pop" style="width:100%;height: 100%;" class="fs14 grey3_clr">{{item}}</button></div>',
    '    </div>',
    '    <button @click="pop=!pop" style="width:100%;height: 100%;" class="fs14 grey3_clr">更多</button>',
    '  </div>',
    '  <div style="flex: 1;text-align: right;">',
    '    <mt-button @click="clickbtn(item)" v-for="item in otherbuttons" type="default" size="small" class="ml8" style="height:26px;font-size: 14px;">{{item}}</mt-button>',
    '    <mt-button @click="clickbtn(item)" v-for="item in mainbuttons" type="primary" size="small" class="ml8" style="height:26px;font-size: 14px;">{{item}}</mt-button>',
    '  </div>',
    '</div>',
  ].join(''),
  methods: {
    clickbtn: function (name) {
      var that = this;
      this.$emit('clickbtn', name);
    }
  }
});

/**
 * @author gf 2020.05.28
 * @description 页面footer，带主要按钮，次要按钮，及更多按钮
 * @event clickbtn
 */
Vue.component('jas-more-button-footer', {
  props: {
    mainbuttons: {
      type: Array,
      default: function () {
        return [];
      }
    },
    otherbuttons: {
      type: Array,
      default: function () {
        return [];
      }
    },
    morebuttons: {
      type: Array,
      default: function () {
        return [];
      }
    },
    buttonsColor: {
      type: Array,
      default: function () {
        return [];
      }
    },
  },
  data: function () {
    return {
      sheetVisible: false
    }
  },
  computed: {
    actions: function () {
      var that = this;
      var arr = this.morebuttons.map(function (item) {
        return {
          name: item,
          method: function () {
            that.clickMoreBtn(item)
          },
        }
      });
      return arr;
    }
  },
  template: [
    '<div>',
    '<div class="jas-button-footer " style="align-items: center;">',
    '	<div style="width:60px;height:34px;" v-if="morebuttons.length>0" >',
    '   <button @click="gomore" style="width:100%;height: 100%;" class="fs16 grey3_clr" >更多</button>',
    '	</div>',
    '	<div class="jas-footer-item" v-for="item,index in otherbuttons">',
    '		<mt-button type="default" @click.native="clickbtn(item)" :style="bgStyle(buttonsColor[index])" size="small" style="width:100%;">{{item}}</mt-button>',
    '	</div>',
    '	<div class="jas-footer-item" v-for="item,index in mainbuttons">',
    '		<mt-button type="primary" @click.native="clickbtn(item)" :style="bgStyle(buttonsColor[index])" size="small" style="width:100%;">{{item}}</mt-button>',
    '	</div>',
    '</div>',
    '<mt-actionsheet v-if="morebuttons.length>0" :actions="actions" v-model="sheetVisible"> </mt-actionsheet>',
    '</div>',
  ].join(''),
  methods: {
    bgStyle: function (clr) {
      return clr ? {
        backgroundColor: clr
      } : {};
    },
    clickbtn: function (name) {
      var that = this;
      this.$emit('clickbtn', name);
    },
    clickMoreBtn: function (name) {
      var that = this;
      this.$emit('clickbtn', name);
    },
    gomore: function () {
      this.sheetVisible = true;
    }
  }
});


/**
 * @author gf 2018.08.09
 * @description 页面footer，带按钮
 */
Vue.component('jas-button-footer', {
  props: {
    isReturn: {},
    buttons: {
      type: Array
    },
    buttonsColor: {
      type: Array,
      default: function () {
        return [];
      }
    },
  },
  data: function () {
    return {}
  },
  template: [
    '<div class="jas-button-footer" v-if="isReturn || buttons">',
    '	<div class="jas-footer-item" v-if="isReturn">',
    '		<mt-button type="primary" @click.native="closePage" size="small" style="width:100%;">返回</mt-button>',
    '	</div>',
    '	<div class="jas-footer-item" v-for="item,index in buttons">',
    '		<mt-button type="primary" @click.native="clickbtn(item)" :style="bgStyle(buttonsColor[index])" size="small" style="width:100%;">{{item}}</mt-button>',
    '	</div>',
    '</div>',
  ].join(''),
  methods: {
    bgStyle: function (clr) {
      return clr ? {
        backgroundColor: clr
      } : {};
    },
    clickbtn: function (name) {
      var that = this;
      this.$emit('click', name);
    },
    closePage: function () {
      window.appcan && appcan.window.close();
    }
  }
});

/**
 * @author gf 2018.08.10
 * @description 页面头部，带左右按钮
 */
Vue.component('jas-header', {
  props: {
    title: {},
    isReturn: {
      default: true
    },
    leftIcon: {},
    rightIcon: {},
  },
  data: function () {
    return {}
  },
  template: [
    '<mt-header :title="title">',
    '	 <mt-button v-if="isReturn && !leftIcon" icon="back" @click.native="closePage" slot="left"></mt-button>',
    '  <mt-button v-if="leftIcon" @click.native="clickLeftBtn" slot="left">',
    '    <i :class="leftIcon" aria-hidden="true" slot="icon"></i>',
    '  </mt-button>',
    '	 <mt-button v-if="rightIcon" @click.native="clickRightBtn" slot="right">',
    '    <i :class="rightIcon" aria-hidden="true" slot="icon"></i>',
    '  </mt-button>',
    '</mt-header>',
  ].join(''),
  methods: {
    clickLeftBtn: function () {
      this.$emit('clickleft');
    },
    clickRightBtn: function () {
      this.$emit('clickright');
    },
    closePage: function () {
      window.appcan && appcan.window.close();
    }
  }
});

/**
 * @author gf 2018.08.13
 * @description 内容组，带组标题
 */
Vue.component('jas-group', {
  props: {
    title: {},
    btnName: {},
  },
  data: function () {
    return {}
  },
  template: [
    '<div class="jas-group" style="margin: 0 0 10px;background: #fff">',
    '  <div v-if="title" class="jas-group-title" style="padding:4px 10px;">',
    '    <i style="font-size:12px;border-left:3px solid #26a2ff;padding-left: 4px;"></i>',
    '    <span >{{title}}</span>',
    '    <span v-if="btnName" style="color:#999;font-size:12px;float:right;" @click="clickBtn">',
    '       {{btnName}}',
    '    </span>',
    '  </div>',
    '  <slot></slot>',
    '</div>',
  ].join(''),
  methods: {
    clickBtn: function () {
      this.$emit('clickbtn')
    }
  }
});


/**
 * @author gf 2020.06.04
 * @description 项目字段详情简易
 */
Vue.component('jas-detail-field-simple', {
  props: {
    label: {},
    value: {},
  },
  data: function () {
    return {}
  },
  template: [
    '<div class="dp-f lh16 grey2_clr">',
    '  <div style="word-break: keep-all;">{{label}}</div>',
    '  <div>：</div>',
    '  <div class="f1">{{value}}</div>',
    '</div>',
  ].join(''),
  methods: {}
});

/**
 * @author gf 2018.08.13
 * @description 项目字段详情
 */
Vue.component('jas-detail-field', {
  props: {
    label: {},
    value: {},
  },
  data: function () {
    return {}
  },
  template: [
    '<a class="mint-cell mint-field" style="min-height: 44px;">',
    '  <div class="mint-cell-left"></div>',
    '  <div class="mint-cell-wrapper">',
    '    <div class="mint-cell-title" style="padding:8px 0;">',
    '      <span class="mint-cell-text" style="line-height:1.2;">{{label}}</span>',
    '    </div>',
    '    <div  @click="ckickItem" class="mint-cell-value" style=" padding:4px 0 0 10px;line-height:1.4;">{{value}}</div>',
    '    <slot @click="ckickItem" ></slot>',
    '  </div>',
    '  <div class="mint-cell-right"></div>',
    '</a>',
  ].join(''),
  methods: {
    ckickItem: function () {
      this.$emit('click');
    }
  }
});


/**
 * @author gf 2020.06.04
 * @description 项目字段详情组简易版
 */
Vue.component('jas-detail-field-group-simple', {
  props: {
    fields: {
      type: Array
    },
    form: {
      type: Object
    },
    fieldsConfig: {
      type: Object //label
    },
  },
  data: function () {
    return {}
  },
  template: [
    '<div>',
    '  <template v-for="item in fields" >',
    '    <jas-detail-field-simple :label="fieldsConfig[item].label" :value="form[item]" :key="fieldsConfig[item].label" ></jas-detail-field-simple>',
    '  </template>',
    '</div>',
  ].join(''),
  methods: {}
});


/**
 * @author gf 2018.08.13
 * @description 项目字段详情组
 */
Vue.component('jas-detail-field-group', {
  props: {
    fields: {
      type: Array
    },
    form: {
      type: Object
    },
    fieldsConfig: {
      type: Object
    },
  },
  data: function () {
    return {}
  },
  template: [
    '<div class="jas-detail-field-group">',
    '  <template v-for="item in fields" >',
    '    <jas-detail-field :label="fieldsConfig[item].label" :value="form[item]" :key="fieldsConfig[item].label" ></jas-detail-field>',
    '  </template>',
    '</div>',
  ].join(''),
  methods: {}
});



/**
 * @author gf 2018.08.13
 * @description 项目字段详情
 */
Vue.component('jas-select-field', {
  props: {
    field: {},
    label: {},
    labelfield: {},
    value: {},
    isMulti: {},
    options: {},
    isSearch: {},
    placeholder: {},
    disabled: {},
  },
  data: function () {
    return {
      popupVisible: false,
    }
  },
  computed: {
    _value: {
      get: function () {
        var that = this;
        if (this.isMulti) {
          return this.value ? this.value.split(',') : [];
        } else {
          var val = this.value;
          if (this.value === '' || this.value === 0) {
            this.options && this.options.forEach(function (item) {
              if (item.value === that.value) {
                val = item;
              }
            });
          } else {
            if (this.value) {
              var isExist = false;
              var isTested = false;
              that.options && that.options.forEach(function (item) {
                isTested = true;
                if (item.value === val || item == val) {
                  isExist = true;
                }
              });
              if (isTested && !isExist) {
                val = null;
              }
            }
          }
          return val;
        }
      },
      set: function (newval) {
        var that = this;
        if (that.isMulti) {
          var arr = newval ? newval.join(',') : '';
          that.$emit('input', arr)
          that.$emit('change', arr);
        } else {
          that.popupVisible = false;

          if ($.isPlainObject(newval)) {
            that.$emit('input', 0)
          } else {
            that.$emit('input', newval)
          }
          that.$emit('change', newval);
        }
      }
    },
    labelvalue: function () {
      var labelvalue = '';
      var _value = this._value;
      var that = this;
      if (this.isMulti) {
        this.options && this.options.forEach(function (item) {
          _value.forEach(function (value) {
            if (item.value === value) {
              labelvalue += labelvalue ? ',' + item.label : item.label;
            }
          })
        });
      } else {
        this.options && this.options.forEach(function (item) {
          if (item.value === _value || item == _value) {
            labelvalue = item.label;
          }
        });
      }
      return labelvalue;
    }
  },
  template: [
    '<div>',

    '<div v-if="isSearch" style="width:100%;box-sizing:border-box;padding:0 10px 0 10px;">',
    '	<div @click="popupVisible=!popupVisible" style="width:100%;text-align: center;line-height:40px;height:40px;">',
    '		<span style="display:inline-block;max-width:calc(100% - 20px);word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{labelvalue}}</span>',
    '		<i style="line-height:40px;vertical-align: top;color:#999;" class="fa fa-caret-down" aria-hidden="true"></i>',
    '	</div>',
    '</div>',

    '<a  v-else class="mint-cell mint-field" style="">',
    '  <div class="mint-cell-left"></div>',
    '  <div class="mint-cell-wrapper">',
    '    <div class="mint-cell-title" style="padding:8px 0;">',
    '      <span class="mint-cell-text" style="line-height:1.2;">{{label}}</span>',
    '    </div>',
    '    <div @click="showOptions" class="mint-cell-value" style=" padding:4px 0 0 10px;line-height:1.4;" >',
    '<div style="width:100%;":style="isDisabled()">',
    '      <span >{{labelvalue}}</span>',
    '      <span  v-show="!labelvalue" style="color: rgb(192, 192, 192)">{{placeholder || ( \'请选择\'+ label)}}</span>',
    '</div>',
    '    </div>',
    '    <span v-show="!disabled" style="color:#888;" @click="showOptions">',
    '      <i class="fa fa-angle-down" aria-hidden="true"></i>',
    '    </span>',
    '  </div>',
    '  <div class="mint-cell-right"></div>',
    '</a>',

    '<mt-popup v-model="popupVisible" position="bottom">',
    '  <div style="width:100vw;">',
    '    <div style="width:100vw;height:44px;text-align:center;line-height:44px;border-bottom: 1px solid #d9d9d9">',
    '      <div v-if="!isSearch" style="float:left;font-size:12px;padding-left:10px;color:#26a2ff;" @click="popupVisible = !popupVisible">取消</div>   ',
    '      {{label}}',
    '      <div v-if="!isSearch" style="float:right;font-size:12px;padding-right:10px;color:#26a2ff;" @click="clearValue">清空</div>   ',
    '    </div>',
    '    <div style="width:100vw;max-height: 40vh;overflow: auto;">',
    '      <mt-checklist v-if="isMulti" style="margin-top: -9px;" v-model="_value" :options="options">',
    '      </mt-checklist>',
    '      <mt-radio v-else style="margin-top: -9px;" v-model="_value" :options="options">',
    '      </mt-radio>',
    '    </div>',
    '  </div>',
    '</mt-popup>',
    '</div>'
  ].join(''),
  methods: {
    clearValue: function () {
      this._value = null;
    },
    showOptions: function () {
      if (this.disabled) return;
      this.popupVisible = !this.popupVisible;
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
    }
  }
});



// /**
//  * @author gf 2018.08.27
//  * @description 项目字段详情
//  */
// Vue.component('jas-select-top-field', {
//   props: {
//     value: {},
//     options: {},
//     tip: {},
//   },
//   data: function () {
//     return {
//       popupVisible: false,
//     }
//   },
//   computed: {
//     _value: {
//       get: function () {
//         var val = this.value;
//         if (this.value === '') {
//           this.options.forEach(function (item) {
//             if (item.value === '') {
//               val = item;
//             }
//           });
//         }
//         return val;
//       },
//       set: function (newval) {
//         if ($.isPlainObject(newval)) {
//           this.$emit('input', '')
//         } else {
//           this.$emit('input', newval)
//         }
//       }
//     },
//     labelvalue: function () {
//       var labelvalue = '';
//       var _value = this._value;
//       this.options.forEach(function (item) {
//         if (item.value === _value || item == _value) {
//           labelvalue = item.label;
//         }
//       });
//       return labelvalue;
//     }
//   },
//   template: [
//     '<div style="width:100%;box-sizing:border-box;padding:0 10px 0 10px;">',
//     '	<div @click="popupVisible=!popupVisible" style="width:100%;text-align: center;line-height:40px;height:40px;">',
//     '		<span style="display:inline-block;max-width:calc(100% - 20px);word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{labelvalue}}</span>',
//     '		<i style="line-height:40px;vertical-align: top;color:#999;" class="fa fa-caret-down" aria-hidden="true"></i>',
//     '	</div>',

//     '<mt-popup v-model="popupVisible" position="bottom">',
//     '  <div style="width:100vw;">',
//     '    <div style="width:100vw;height:44px;text-align:center;line-height:44px;border-bottom: 1px solid #d9d9d9">',
//     '      {{tip||"请选择"}}',
//     '    </div>',
//     '    <div style="width:100vw;max-height: 40vh;overflow: auto;">',
//     '      <mt-radio style="margin-top: -9px;" v-model="_value" :options="options">',
//     '      </mt-radio>',
//     '    </div>',
//     '  </div>',
//     '</mt-popup>',
//     '</div>'
//   ].join(''),
//   methods: {

//   }
// });

/**
 * @author gf 2018.08.31
 * @description 表单项目组
 */
Vue.component('jas-form-items-group', {
  props: {
    fieldsGroup: {
      type: Array,
    },
    fieldsConfig: {
      type: Object,
    },
    form: {
      type: Object,
    },
  },
  data: function () {
    return {
      allFields: [],
      fatherSelectList: [],
      childSelectList: [],
      isLocal: true,
    }
  },
  template: [
    '<div>',
    '  <jas-group v-for="group in fieldsGroup" :title="group.groupName">',
    '    <template v-for="field in group.fields">',
    '<template v-if="fieldsConfig[field].isSecond">',
    '<mt-field-two :form="form" :fields="[field,fieldsConfig[field].isSecond]":label="fieldsConfig[field].name" :fiedlsconfig="[fieldsConfig[field],fieldsConfig[fieldsConfig[field].isSecond]]"></mt-field-two>',
    '</template>',
    '<template v-else>',
    '      <template v-if="fieldsConfig[field].type===\'select\'">',
    '        <jas-select-field :labelfield="fieldsConfig[field].labelfield" :ref="field" v-model="form[field]" :disabled="fieldsConfig[field].disabled"  v-required="fieldsConfig[field].required" :label="fieldsConfig[field].name" ',
    '          :placeholder="fieldsConfig[field].placeholder" @optionshowed=optionshowed(field) @change=fatherSelectChanged(false,field) :options="fieldsConfig[field].options"></jas-select-field>',
    '      </template>',
    '      <template v-else-if="fieldsConfig[field].type===\'multiSelect\'">',
    '        <jas-select-field :labelfield="fieldsConfig[field].labelfield" :ref="field" v-model="form[field]" :disabled="fieldsConfig[field].disabled"  :is-multi="true" v-required="fieldsConfig[field].required" :label="fieldsConfig[field].name" ',
    '           :placeholder="fieldsConfig[field].placeholder" @optionshowed=optionshowed(field) :options="fieldsConfig[field].options"></jas-select-field>',
    '      </template>',
    '      <template v-else>',
    '        <mt-field v-model="form[field]" :type="fieldsConfig[field].type" :disabled="fieldsConfig[field].disabled" v-required="fieldsConfig[field].required" :label="fieldsConfig[field].name" ',
    '          :placeholder="fieldsConfig[field].placeholder || (\'请输入\'+fieldsConfig[field].name)" rows="4" v-fieldicon="fieldsConfig[field].type"></mt-field>',
    '      </template>',
    '</template>',
    '    </template>',
    '  </jas-group>',
    '</div>',
  ].join(''),
  watch: {
    fieldsGroup: function (newval) {
      var that = this;
      var arr = [];
      this.fieldsGroup.forEach(function (group) {
        arr = arr.concat(group.fields);
      });
      this.allFields = arr;
      if (arr.length > 0) {
        appcan.ready(function () {

          that.resetFieldsConfig(arr, that.fieldsConfig);
        });
      }
    }
  },
  mounted: function () {
    var that = this;
    var arr = [];
    this.fieldsGroup.forEach(function (group) {
      arr = arr.concat(group.fields);
    });
    this.allFields = arr;

    if (arr.length > 0) {
      appcan.ready(function () {
        that.resetFieldsConfig(arr, that.fieldsConfig);
      });
    }
  },
  methods: {
    getSelectLabelValues: function () {
      var that = this;
      var obj = {};
      this.allFields.forEach(function (item) {
        var ofield = that.fieldsConfig[item];
        // appcan.logs(ofield.labelfield)
        // appcan.logs(111111111111111111 + JSON.stringify(that.$refs[item]))
        // appcan.logs(item + that.$refs[item][0].labelvalue)
        if (ofield.labelfield) {
          // alert(JSON.stringify(that.$refs[item]))
          obj[ofield.labelfield] = that.$refs[item][0].labelvalue;
        }
      });
      return obj;
    },
    validate: function () {
      var that = this;
      var aTip = [];

      that.allFields.forEach(function (item) {
        if (!that.form[item] && that.fieldsConfig[item].required && that.form[item] !== 0) {
          aTip.push(that.fieldsConfig[item].name + '不能为空');
        }
      });

      if (aTip.length > 0) {
        window.Vue && Vue.prototype.$toast(aTip.join('，\r\n'));
        // window.Vue && Vue.prototype.$toast(('实打实地方是打发 \n 是打发是打发'));
        return false;
      } else {
        return true;
      }
    },
    triggerFatherSelectsChange: function (fatherSelectList) {
      var that = this;
      var SelectList = fatherSelectList || that.fatherSelectList;
      setTimeout(function () {
        SelectList.forEach(function (item) {
          // that.$refs[item][0].$emit('change', true)
          // that.fatherSelectChanged(true, item);
        });
      }, 0);
    },
    resetFieldsConfig: function (fields, fieldsConfig) {
      var that = this;
      var rulesObj = {};
      var fieldArr = [];
      var fieldNameArr = [];
      this.isInited = true;
      fields.forEach(function (field) {
        if (!fieldsConfig.hasOwnProperty(field)) {
          // console.log(field);
          return;
        }
        var config = fieldsConfig[field];
        /* 初始化赋值 */
        if (!config.options) {
          that.$set(config, 'options', []);
          that.$set(config, 'rules', []);
        }
        if (config.type === 'select' && config.childSelect && config.childSelect.length > 0) {
          that.childSelectList.push.apply(that.childSelectList, config.childSelect);
          that.fatherSelectList.push(field);
        }
        /* 请求阈值 */
        if (config.domainName && !config.isChildSelect) {
          (function (field, config) {
            if (that.isLocal) {
              localServer.sysDomain.get({
                domainName: config.domainName
              }, function (data) {
                if (data.status == 1) {
                  if (data.rows.length == 0) {
                    window.Vue && Vue.prototype.$toast("本地数据为空，请进行数据同步");
                  }
                  config.options = data.rows.map(function (item) {
                    return {
                      label: item.value,
                      value: item.key,
                    }
                  });

                } else {
                  window.Vue && Vue.prototype.$toast("本地数据出错，请同步本地数据");
                }
              });
            } else {
              that.requestDomainFromDomainTable(config.domainName, function (options) {
                config.options = options;
              });
            }
          })(field, config)
        }
        if (config.optionUrl) {
          (function (field, config) {
            var obj = {};
            if (config.requestParams) {
              obj = jasTools.base.extend(obj, config.requestParams);
            }
            if (that.isLocal) {
              localServer[config.optionTable].get(obj, function (data) {
                if (data.status == 1) {
                  if (data.rows.length == 0) {
                    window.Vue && Vue.prototype.$toast("本地数据为空，请进行数据同步");
                  } else {
                    config.options = data.rows.map(function (item) {
                      return {
                        label: item.value,
                        value: item.key,
                        option: item //主要用于存储 焊口编号其余信息
                      }
                    });
                  }
                } else {
                  window.Vue && Vue.prototype.$toast("本地数据出错，请同步本地数据");
                }
              });
            } else {
              jasTools.ajax.post("/" + config.optionUrl, obj, function (data) {
                config.options = data.rows.map(function (item) {
                  return {
                    label: item.value,
                    value: item.key,
                    option: item //主要用于存储 焊口编号其余信息
                  }
                });
              });
            }
          })(field, config)
        }
      });
    },
    optionshowed: function (currentField) {
      var fieldArr = this.allFields;
      var fieldsConfig = this.fieldsConfig;

      for (var field in fieldsConfig) {
        var fieldIndex = fieldArr.indexOf(field);
        if (fieldIndex > -1 && fieldsConfig.hasOwnProperty(field)) {
          if (fieldsConfig[field].childSelect && fieldsConfig[field].childSelect.indexOf(currentField) > -1) {
            if (!this.form[field]) {

              top.Vue.prototype.$toast('请先选择' + fieldsConfig[field].name);
            }
          }
        }
      }
    },
    fatherSelectChanged: function (isInit, fatherField) {
      var that = this;
      var fieldConfig = this.fieldsConfig[fatherField];
      var form = this.form;

      var setChildOptionsAndValue = function (childField, options) { // 入参下拉选项
        if (that.fieldsConfig[childField].options && that.fieldsConfig[childField].options.length > 0) {
          form[childField] = ''
        }
        //拷贝form值
        var obj = {};
        for (var key in form) {
          obj[key] = form[key];
        }
        if (childField == "bendingOid" && that.form.isUpdate && obj.bendingOid) {
          options.push({
            label: obj.bendingCode,
            value: obj.bendingOid,
          });
        }
        if (childField == "weldOid" && that.form.isUpdate && obj.weldOid) {
          delete that.form.isUpdate;
          options.push({
            label: obj.weldCode,
            value: obj.weldOid,
            option: {
              label: obj.weldCode,
              value: obj.weldOid,
              median_stake_code: obj.medianStakeCode,
              relative_mileage: obj.relativeMileage
            }
          });
        }

        that.fieldsConfig[childField].options = options;
        if (options.length === 1 && (!form.measureControlPointType && childField != "weldOid")) { //只有一个选项就自动复制
          form[childField] = options[0].value;
        }
        // that.$refs[childField][0].$emit('change', isInit);
      };

      var getAndSet = function (fatherField, fatherValue, childField, requestUrl, requestTable) {
        if (fatherValue) { //进行子级的查找 后台请求
          var obj = {
            "rows": 100,
            "page": 1,
          };
          var fieldConfig = that.fieldsConfig[childField];
          if (fieldConfig.requestParams) {
            var newParams = jasTools.base.extend({}, fieldConfig.requestParams);
            for (var key in newParams) {
              if (!newParams[key]) {
                newParams[key] = form[key]
              }
            }
            obj = jasTools.base.extend(obj, newParams);
          }

          obj[jasTools.base.switchToCamelCase(fatherField)] = fatherValue;

          if (that.isLocal) {
            if (requestUrl === 'domainName') {
              localServer.sysDomain.get({
                domainName: that.fieldsConfig[childField].domainName
              }, function (data) {
                if (data.status == 1) {
                  if (data.rows.length == 0) {
                    window.Vue && Vue.prototype.$toast(that.fieldsConfig[childField].name + "数据为空，请检查本地数据");
                  }
                  setChildOptionsAndValue(childField, data.rows.map(function (item) {
                    return {
                      label: item.value,
                      value: item.key,
                    }
                  }));
                } else {
                  setChildOptionsAndValue(childField, []);
                  window.Vue && Vue.prototype.$toast(that.fieldsConfig[childField].name + "数据为空，请检查本地数据");
                }
              });
            } else {
              //此时需要进行 桩号 相对偏移量的增加
              localServer[requestTable].get(obj, function (data) {
                if (data.status == 1) {
                  if (data.rows.length == 0) {
                    window.Vue && Vue.prototype.$toast(that.fieldsConfig[childField].name + "数据为空，请检查本地数据");
                  }
                  setChildOptionsAndValue(childField, data.rows.map(function (item) {
                    return {
                      label: item.value,
                      value: item.key,
                      option: item //主要用于存储 焊口编号其余信息
                    }
                  }));
                } else {
                  setChildOptionsAndValue(childField, []);
                  window.Vue && Vue.prototype.$toast(that.fieldsConfig[childField].name + "数据为空，请检查本地数据");
                }
              });
            }
          } else {
            jasTools.ajax.post("/" + requestUrl, obj, function (data) {
              setChildOptionsAndValue(childField, data.rows.map(function (item) {
                return {
                  label: item.value,
                  value: item.key,
                  option: item //主要用于存储 焊口编号其余信息
                }
              }))
            });
          }

        } else {
          setChildOptionsAndValue(childField, []);
        }
      };

      fieldConfig.childSelect && fieldConfig.childSelect.forEach(function (childField, index) {
        if (!fieldConfig.childUrl || fieldConfig.childUrl.length === 0) return;
        var url = fieldConfig.childUrl[index] || fieldConfig.childUrl[0];
        var table = fieldConfig.childTable[index] || fieldConfig.childTable[0];
        getAndSet(fatherField, form[fatherField], childField, url, table);
      });
      fieldConfig.childText && fieldConfig.childText.forEach(function (childField, index) {
        if (!fieldConfig.childTextFormat || fieldConfig.childTextFormat.length === 0) return;
        var format = fieldConfig.childTextFormat[index] || fieldConfig.childUrl[0];
        if (form[fatherField]) {
          fieldConfig.options.forEach(function (item) {
            if (item.value === form[fatherField]) {
              form[childField] = format(item);
            }
          });
        } else {
          form[childField] = '';
        }
      });

      //针对中线测量  进行唯一性的渲染改变
      if (fatherField == 'measureControlPointType') {
        var type = this.form.measureControlPointType;
        that.$emit('resetform', type);
      }
      //针对配置规则的 进行渲染
      that.changeRule(fatherField, fieldConfig);
    },
    changeRule: function (field, item) {
      var that = this;
      if (!item.autoFillField) {
        return;
      }
      if (this.form.measureControlPointType != "measure_control_point_type_code_001") {
        return;
      }
      var option = item.options.filter(function (s) {
        return s.value == that.form[field]
      });
      for (var key in item.autoFillField) {
        that.form[key] = option[0][item.autoFillField[key]];
      }
    },
    requestDomainFromDomainTable: function (domainName, cb) {
      var that = this;
      var url = "/jasframework/sysdoman/getDoman.do";
      jasTools.ajax.get(url, {
        "domainName": domainName
      }, function (data) {
        var aDomain = data.map(function (item) {
          return {
            value: item.codeId,
            label: item.codeName,
          }
        });
        cb && cb(aDomain);
      });
    },
    requestDomainFromBizTable: function (url, obj, cb) {
      var that = this;

      // var url = jasTools.base.rootPath + url;
      jasTools.ajax.post(url, obj, function (data) {

        cb && cb(data.rows);
      }, function () {
        cb && cb([]);
      });
    },
  },

});



/**
 * @author gf 2018.09.07
 * @description 附件的查看與編輯
 */
Vue.component('jas-file-group', {
  props: {
    isEdit: {}, //是否支持編輯
    max: {
      default: 5
    }, //最大文件數
  },
  data: function () {
    return {
      files: [],
    }
  },
  template: [
    '<jas-group title="附件信息">',
    '  <div>',
    '    <div v-if="isEdit" class="topLine" style="padding:6px 10px;overflow: hidden;">',
    '      <span style="line-height: 33px;font-size: 12px;color:#666;">最多上传{{max}}个附件</span>',
    '      <div style="float:right;overflow: hidden;">',
    '        <mt-button type="primary" size="small" :disabled="files.length>=max" @click.native="takePhoto">拍照</mt-button>',
    '        <mt-button style="margin-left:5px;" type="primary" size="small" :disabled="files.length>=max" @click.native="selectPhoto">选择图片</mt-button>',
    '      </div>',
    '    </div>',
    '    <div>',
    '      <template v-for="item in files">',
    '        <mt-cell-swipe v-if="isPhoto(item.fileName)"  :title="item.fileName" is-link @click.native="seeDetail(item)" ',
    '          :right="isEdit && [{content: \'刪除\',style: {background: \'red\',color: \'#fff\'},handler: function () {deleteItem(item)}}]">',
    '          <span>预览图片</span>',
    '          <div slot="icon" style="margin:4px;height:40px;width:40px;display: inline-block;vertical-align: middle;" :style="styleBgImg(item)"></div>',
    '        </mt-cell-swipe>',
    '        <mt-cell-swipe v-else  is-link :title="item.fileName" @click.native="downloadFile(item)"',
    '          :right="isEdit && [{content: \'刪除\',style: {background: \'red\',color: \'#fff\'},handler: function () {deleteItem(item)}}]">',
    '          <span v-show="!item.isDowbloaded&&!item.isDowbloading">下载附件</span>',
    '          <span v-show="item.isDowbloaded&&!item.isDowbloading">打开附件</span>',
    '          <mt-spinner v-show="item.isDowbloading" type="fading-circle"></mt-spinner>',
    '          <div slot="icon" style="margin:4px;height:40px;width:40px;display: inline-block;vertical-align: middle;text-align: center;">',
    '            <i class="fa fa-file-text-o" style="font-size:24px;color:#666;line-height: 40px;" aria-hidden="true"></i>',
    '          </div>',
    '        </mt-cell-swipe>',
    '      </template>',
    '      <div v-show="!files.length" style="padding:10px;"> 暂无附件 </div>',
    '    </div>',
    '  </div>',
    '</jas-group>',

  ].join(''),
  methods: {
    requestFile: function (bizId) {
      var that = this;
      var url = "/attachment/getInfo.do";
      jasTools.ajax.get(url, {
        businessType: 'file',
        businessId: bizId || '1f4dea6c-0ae2-487c-8151-4e52bc7a20a7',
      }, function (data) {
        that.files = data.rows.map(function (item) {
          item.isDowbloaded = false;
          item.isDowbloading = false;
          return item;
        });
        that.fileListlength = that.files.length;
      });
    },
    deleteItem: function (item) {
      if (item.oid) {
        if (this.filesToBeDelete) {
          this.filesToBeDelete.push(item.oid);
        } else {
          this.filesToBeDelete = [item.oid];
        }
      }
      var index = this.files.indexOf(item);
      this.files.splice(index, 1);
    },
    isPhoto: function (name) {
      return /\.jpg|\.png|\.gif|\.jpeg|\.bmp/.test(name + '');
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
    seeDetail: function (item) {
      var that = this;
      var photos = this.files.filter(function (item) {
        return that.isPhoto(item.fileName);
      });
      var aSrc = photos.map(function (item) {
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
    downloadFile: function (item) {
      var that = this;
      var url = jasTools.ajax.completeURL + '/attachment/download.do?oid=' + item.oid + '&token=' + localStorage.getItem("token");
      var localPath = "wgt://data/down/" + item.oid + item.fileName;
      if (item.isDowbloading) return;
      if (item.isDowbloaded) {
        uexDocumentReader.openDocumentReader(localPath) //打开
      } else {
        item.isDowbloading = true;
        item.isDowbloaded = false;
        appcan.file.exists({
          filePath: localPath,
          callback: function (err, data, dataType, optId) {
            if (err) return;
            if (data == 1) {
              setTimeout(function () {
                item.isDowbloading = false;
                item.isDowbloaded = true;
              }, 400);
              // uexDocumentReader.openDocumentReader(localPath) //打开
              // alert(JSON.stringify(that.files, 4, 4));
            } else {
              var downloader = uexDownloaderMgr.create();
              uexDownloaderMgr.setHeaders(downloader, '{"Content-type":"application/json;charset=utf-8"}');
              uexDownloaderMgr.download(downloader, url, localPath, 0, function (fileSize, percent, status) {
                switch (status) {
                  case 0:
                    item.isDowbloading = true;
                    item.isDowbloaded = false;
                    // window.Vue && Vue.prototype.$toast("文件大小:" + fileSize + "字节<br>下载进度:" + percent);
                    break;
                  case 1:
                    // window.Vue && Vue.prototype.$toast("下载完成");
                    setTimeout(function () {
                      item.isDowbloading = false;
                      item.isDowbloaded = true;
                    }, 400);
                    // uexDocumentReader.openDocumentReader(localPath) //打开成功了
                    break;
                  case 2:
                    item.isDowbloading = false;
                    item.isDowbloaded = false;
                    alert("下载失败");
                    break;
                }
              });
            }
          }
        });
      }
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
    _deleteFilesToServer: function (cb) {
      var that = this;
      if (!that.filesToBeDelete) {
        cb && cb();
        return;
      }
      jasTools.ajax.get("/attachment/delete.do", {
        oids: that.filesToBeDelete.join(',')
      }, function (data) {
        cb && cb();
      });
    },
    uploadFiles: function (sBizId) {
      var that = this;
      this._deleteFilesToServer(function () {
        var afileToSubmit = that.files.filter(function (item) {
          return !item.oid
        }).map(function (item) {
          return item.src
        });
        if (afileToSubmit.length > 0) {
          jasTools.ajax.uploadFiles(sBizId, {
            file: afileToSubmit
          }, function () {
            that.fileUploaded(1);
          }, function () {
            // winodw.Vue && Vue.prototype.$toast('网络连接失败，请检查您的网络');
            that.fileUploaded(0);
          });
        } else {
          that.fileUploaded(1);
        }
      });
    },
    fileUploaded: function (isSuccess) {
      this.$emit('success', isSuccess)
    }

  }
});












/**
 * @author dx 2018.08.13
 * @description 项目字段详情组
 */
Vue.component('jas-check-detail-field-group', {
  props: {
    fields: {
      type: Array
    },
    form: {
      type: Object
    },
  },
  data: function () {
    return {}
  },
  template: [
    '<div>',
    '  <template v-for="item in fields" >',
    '    <jas-detail-field :label="item.name" :value="form[item.field]" :key="item.name" ></jas-detail-field>',
    '  </template>',
    '</div>',
  ].join(''),
  methods: {}
});
/**
 * @author dx 2019.03.06
 * @description 表单输入 一个label后面跟随两个输入框
 */
Vue.component('mt-field-two', {
  props: {
    label: {
      type: String
    },
    fields: {
      type: Array
    },
    fiedlsconfig: {
      type: Array
    },
    form: {
      type: Object
    },
  },
  template: [
    '<a class="mint-cell mint-field"  v-required="fiedlsconfig[0].required">',
    '<div class="mint-cell-left"></div> ',
    '<div class="mint-cell-wrapper" >',
    '<div class="mint-cell-title"> ',
    '<span class="mint-cell-text">{{label}}</span>',
    '</div>',
    '<template v-for="item,index in fields">',
    '<div class="mint-cell-value" style="display:inline-block;width:30%">',
    '<input :placeholder="fiedlsconfig[index].placeholder" :type="fiedlsconfig[index].type" class="mint-field-core" v-model="form[item]">',
    '<div class="mint-field-clear" style="display: none;">',
    '<i class="mintui mintui-field-error"></i>',
    '</div>',
    '<span class="mint-field-state is-default"><i class="mintui mintui-field-default"></i></span>',
    '<div class="mint-field-other"></div></div>',
    '</template>',
    '</div> <div class="mint-cell-right"></div></a>'
  ].join(''),
});

/**
 * @author dx 2018.08.28
 * @description 复选框组件封装
 */
Vue.component('jas-checkbox', {
  props: {
    checked: {
      type: [Boolean],
      default: false,
    },
    itemdate: {
      default: {},
      type: [String, Object, Array]
    },
    isAll: {
      default: false,
      type: [Boolean]
    }
  },
  data: function () {
    return {

    }
  },
  computed: {
    isPadding: function () {
      if (this.isAll) {
        return {
          "paddingTop": "15px"
        }
      } else {
        return {
          "paddingTop": "25px"
        }
      }
    }
  },
  template: [
    '<div class="ub" style="width:100%">',
    '<label class="mint-checklist-label" style="padding:0px 10px 0px 0px ">',
    '<span class="mint-checkbox" style="display:inline-block" :style="isPadding">',
    '<input type="checkbox" class="mint-checkbox-input" :checked="checked" @click="clickItem">',
    '<span class="mint-checkbox-core"></span> <span style="padding-left:5px;" v-if="isAll">全选</span>',
    '</span>',
    '</label>',
    '<slot  name="options"> </slot>',
    '</div>'
  ].join(''),
  methods: {
    clickItem: function () {
      if (JSON.stringify(this.itemdate) == "{}") {
        this.$emit("clickitem", this.checked);
      } else {
        this.$emit("clickitem", this.itemdate);
      }
    }
  }
});