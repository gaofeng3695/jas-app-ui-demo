/**
 * @author gf 2020.08.03
 * @description 项目树级选择字段
 * @description 需要额外引入elementui的js、css
 * @params 
 * @event 
 * @slot 
 */

Vue.component('jas-tree-pick-field', {
  props: {
    value: {}, // 逗号分隔的oid的字符串
    field: {},
    label: {},
    maxvalue: {
      default: 10000
    },
    props: {
      default: function () {
        return {
          label: 'label',
          children: 'children'
        }
      }
    }, // 
    labelfield: {},
    isMulti: {},
    options: {},
    placeholder: {},
    disabled: {},
    nodeKey: {
      default: 'id'
    },
  },
  data: function () {
    return {
      popupVisible: false,
      labelvalue: '',
    }
  },
  watch: {
    value: function (val) {
      var that = this;
      if (val) {
        var keyslabel = this.$refs.tree.getCheckedNodes().map(function (item) {
          return item[that.props.label]
        });
        this.labelvalue = keyslabel.join(',');
      } else {
        this.labelvalue = '';
      }
    }
  },
  mounted: function () {
    var that = this;
    if (this.value) {
      var vals = (this.value + '').split(',');
      this.$refs.tree.setCheckedKeys(vals);
      var keyslabel = this.$refs.tree.getCheckedNodes().map(function (item) {
        return item[that.props.label]
      });
      this.labelvalue = keyslabel.join(',');
    }

  },
  template: [
    '<div class="jas-tree-pick-field">',
    '<a   class="mint-cell mint-field" style="">',
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
    '      <div style="float:left;font-size:12px;padding-left:10px;color:#26a2ff;" @click="clearValue">清空</div>   ',
    '      {{label}}',
    '      <div style="float:right;font-size:12px;padding-right:10px;color:#26a2ff;" @click="confirm">确认</div>   ',
    '    </div>',
    '    <div style="width:100vw;height: 50vh;overflow: auto;">',

    '      <el-tree ref="tree" :data="options" :props="props" :check-strictly="true" :check-on-click-node="true"  :expand-on-click-node="false" show-checkbox default-expand-all :node-key="nodeKey" highlight-current>',
    '      </el-tree>',

    '    </div>',
    '  </div>',
    '</mt-popup>',
    '</div>'
  ].join(''),
  methods: {
    confirm: function () {
      var that = this;
      var keys = this.$refs.tree.getCheckedKeys();
      if (keys.length > this.maxvalue) {
        this.$toast('选择数量不得超过 ' + this.maxvalue + ' 个')
        return;
      }
      this.$emit('input', keys.join(','));
      this.popupVisible = false;
    },
    clearValue: function () {
      this.$refs.tree.setCheckedKeys([]);
      this.confirm();
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