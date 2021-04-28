/**
 * @author gf 2020.07.16
 * @description 可收缩面板组件
 * @params 
 * @event 
 * @slot 
 */

Vue.component('jas-open-panel', {
  props: {
    value: {},
    title: {},
  },
  data: function () {
    var that = this
    return {}
  },
  computed: {
    _value: {
      get: function (val) {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val);
      },
    }
  },
  created: function () {

  },
  template: [
    '<div><div class="bgfff" style="display: flex;">',
    '  <div class="pl10 fs16" style="flex: 1;height: 48px;line-height: 48px;" @click="_value = !_value">{{title}}</div>',
    '  <div class="pr10 pl10" style="line-height: 48px;" @click="_value = !_value">',
    '    <i v-show="_value" class="pr10 grey5_clr fs18 fa fa-angle-up"></i>',
    '    <i v-show="!_value" class="pr10 grey5_clr fs18 fa fa-angle-down"></i>',
    '  </div>',
    '</div>',
    '<div class="bgfff" v-show="_value">',
    '  <slot></slot>',
    '</div></div>',

  ].join(''),

  methods: {

  }
});