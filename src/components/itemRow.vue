<template>
  <div class="item-row">
    <i class="icon-more" @click="$emit('moreclick', item.index)"></i>
    <h4 :class="{
      'sm-width': item.ac || item.attack,
      'md-width': typeof item.level !== 'undefined'
    }">
      {{ item.index.replace(/-/g, ' ') }}
    </h4>
    <p v-if="!editmode && (item.attack || item.ac || typeof item.level !== 'undefined')">
      {{ item.attack }}
      {{ item.ac ? 'AC ' + item.ac : '' }}
      {{ item.level === 0 ? 'Cantrip' : '' }}
      {{ item.level > 0 ? 'Lvl '+ item.level : '' }}
      <span v-if="item.prof" class="prof-bonus"> +{{ prof }} </span>
    </p>
    <div class="i-container">
      <i
        class="icon-close sm"
        v-if="editmode"
        @click="$emit('removeItem', item.index)"
      ></i>
      <i
        :class="['icon-equip xs', { 'active': item.equip }]"
        v-if="editmode && (item.ac || item.attack)"
        @click="$emit('toggleEquip', item.index)"
      ></i>
      <i
        :class="['icon-pb xs', { 'active': item.prof }]"
        v-if="editmode && (item.ac || item.attack)"
        @click="$emit('toggleProf', item.index)"
      ></i>
      <i
        :class="['icon-prep xs', { 'active': item.prep }]"
        v-if="editmode && typeof item.level === 'number'"
        @click="$emit('togglePrep', item.index)"
      ></i>
    </div>
  </div>
</template>

<script>
  import UserData from '../userData';
  
  export default {
    name: 'itemRow',
    props: [
      'item',
      'editmode',
    ],
    created: function() {
      this.prof = UserData.data.prof;
    }
  }
</script>

<style scoped lang="scss">
  @import '../vars';

  .item-row {
    overflow: hidden;
    margin: 0 -10px;

    h4, p {
      float: left;
      line-height: 48px;
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 135px;
    }

    h4 {
      width: calc(100% - 100px);

      &.sm-width {
        width: calc(100% - 185px);
      }

      &.md-width {
        width: calc(100% - 140px);

        &+p {
          width: 90px;
        }
      }
    }

    p {
      text-align: right;
    }

    i {
      cursor: pointer;
      float: left;
    }

    i.active {
      background: $c-sear;
    }

    .i-container {
      float: right;

      i {
        float: right;
        margin: -10px;
      }
    }

    .prof-bonus {
      vertical-align: 1px;
      padding: 3px 5px;
      border-radius: 100%;
      margin-left: 6px;
      font-size: 14px;
      background: $c-comb;
    }
  }
</style>