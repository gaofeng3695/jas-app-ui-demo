/**
 * @author gf 2020.05.25
 * @description 搜索栏组件
 * @params 
 * @event search
 * @event reset
 * @event clear
 * @slot default 更多筛选的内容
 */

Vue.component('jas-more-searcher', {
  props: {
    value: {},
    placeholder: {
      default: '请输入搜索关键词'
    },
    ismore: { // 是否显示更多搜索
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      isfocus: false,
      isEdit: false,
      pop: false,
      panelStyle: {},
    }
  },
  computed: {
    _value: {
      get: function () {
        var val = this.value;
        return val;
      },
      set: function (newval) {
        var that = this;
        that.$emit('input', newval);
      }
    },

  },
  template: [
    '<div style="position: relative;">',
    '  <div class="bgfff bottomLine" style="display: flex;flex-direction: row;align-items: center;height: 44px;">',
    '    <div',
    '      style="flex: 1;display: flex;align-items: center;height: 36px;margin: 0 10px;padding:0 10px;background: #eeeeee;border-radius: 18px;">',
    '      <i class="grey5_clr mintui mintui-search"></i>',
    '      <div class="pl8 pr8" style="flex:1;">',
    '        <form action="javascript:;" id="searchFrom" @submit="searchList">',
    '          <input type="search" ref="myinput" class="mint-field-core" @focus="isfocus = true"',
    '            @blur="isfocus = false" :placeholder="placeholder" style="background: transparent;" v-model="_value">',
    '        </form>',
    '      </div>',
    '      <div class="mint-field-clear" v-show="isfocus" @click="clear"><i class="mintui mintui-field-error"></i>',
    '      </div>',
    '    </div>',
    '    <div v-if="ismore" class="pr10" @click="pop=!pop" style="line-height: 44px;">',
    '      <span>更多</span>',
    '      <i style="vertical-align: text-top;" class="fa fa-sort-desc fs12" aria-hidden="true"></i>',
    '    </div>',
    '  </div>',
    '  <div v-show="pop" class="bgfff" :style="panelStyle" style="z-index:9;width: 100%;position:absolute;left:0;top:44px;box-shadow: 0px 3px 6px -3px #cecece;">',
    '    <div style="max-height: 40vh;overflow: auto;">',
    '      <slot></slot> ',
    '    </div>',
    '    <div class="ta-c topLine" style="height: 44px;display: flex;">',
    '      <div class="grey10_bg" style="flex: 1;line-height: 44px;">',
    '        <button @click="reset" style="width:100%;height: 100%;" class="grey3_clr" >重置</button>',
    '      </div>',
    '      <div class="grey10_bg" style="flex: 1;line-height: 44px;">',
    '        <button @click="confirm" style="width:100%;height: 100%;" class="theme_color1_clr">确定</button>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>',
  ].join(''),
  methods: {
    clear: function () {
      this._value = '';
      this.$emit('clear');
    },
    reset: function () {
      this.$emit('reset');
    },
    confirm: function () {
      this.pop = false;
      this.$emit('search');
    },
    searchList: function () {
      this.$refs.myinput.blur();
      this.$emit('search')
    },
  }
});