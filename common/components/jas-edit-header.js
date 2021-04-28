/**
 * @author gf 2020.05.25
 * @description 可编辑的头部组件--未完成
 * @params 
 * @event search
 * @event reset
 * @event clear
 * @slot default 更多筛选的内容
 */

Vue.component('jas-edit-header', {
  props: {
    title: {
      default: '标题'
    },
  },
  data: function () {
    return {
      isfocus: false,
      isEdit: false,
      pop: false,
      panelStyle: {},
    }
  },
  computed: {},
  template: [

    '<div>',
    '  <mt-header v-if="!isEdit" :title="title">',
    '    <mt-button icon="back" @click.native="closePage" slot="left"></mt-button>',
    '    <div slot="right">',
    '      <mt-button style="padding: 0 6px;" @click.native="isEdit = !isEdit">',
    '        <i class="fa fa-pencil-square-o" aria-hidden="true" slot="icon"></i>',
    '      </mt-button>',
    '      <mt-button style="padding: 0 6px;" @click.native="clickRight">',
    '        <i class="fa fa-plus" aria-hidden="true" slot="icon"></i>',
    '      </mt-button>',
    '    </div>',
    '  </mt-header>',
    '  <mt-header v-else :title="title">',
    '    <div slot="left">',
    '      <mt-button @click.native="isEdit = !isEdit">取消</mt-button>',
    '    </div>',
    '    <div slot="right">',
    '      <mt-button @click.native="checkall">全选</mt-button>',
    '    </div>',
    '  </mt-header>',
    '</div>',

  ].join(''),
  methods: {
    checkall: function () {
      this.$emit('checkall')
    },
  }
});