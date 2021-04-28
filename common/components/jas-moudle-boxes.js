/**
 * @author gf 2020.05.14
 * @description 类似于九宫格的模块操作面板，一般用于主页
 * @params moudles
 * @event clickitem
 */

Vue.component('jas-moudle-boxes', {
  props: {
    moudles: {
      type: Array,
      default: function () {
        return []; //{name,imgurl}
      }
    },
    colnumber: {
      type: Number,
      default: 5
    },
    borderRadius: {
      default: '50%'
    }
  },
  data: function () {
    return {}
  },
  computed: {
    calcWidthStyle: function () {
      var col = this.colnumber > 4 ? 5 : this.colnumber;
      return {
        width: Math.floor(10000 / col) / 100 + '%'
      }
      var n = this.moudles.length;
      var width = '20%';
      if (n > 4) {
        width = '20%';
      } else if (n > 0) {
        width = Math.floor(10000 / n) / 100 + '%';
      }
      console.log(width)
      return {
        width: width
      }
    },
  },
  template: [
    '<div class="bgfff of-h" style="padding: 6px 0;">',
    '<div :style="calcWidthStyle" style="float: left;padding: 6px 0 6px 0;" v-for="item in moudles" @click="clickmoudle(item)">',
    '  <div class="of-h" :style="{\'border-radius\': borderRadius}" style="margin: 2px auto;height: 44px;width: 44px;">',
    '    <div style="height: 100%;" :style="mybgstyle(item.imgurl)">',
    '    </div>',
    '  </div>',
    '  <div class="ta-c fs14 grey1_clr" style="line-height: 1.5;padding-top:4px;">{{item.name}}</div>',
    '</div>',
    '</div>',
  ].join(''),
  methods: {
    clickmoudle: function (item) {
      this.$emit('clickitem', item)
    },
    mybgstyle: function (url) {
      return {
        'background': 'url(' + url + ') no-repeat center center',
        'background-size': 'cover'
      }
    },
  }
});