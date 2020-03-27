<template>
  <div class="item-row">
    <i class="icon-more" @click="$emit('moreclick', item.index)"></i>
    <h4 :class="{
      'sm-width': item.ac || item.attack || item.quantity || item.quantity === 0,
      'md-width': typeof item.level !== 'undefined',
      'disable': item.quantity === 0
    }">
      <span class="name">{{ item.index.replace(/-/g, ' ') }}</span>
      <span class="quantity" v-if="item.quantity > 1">
        <span class="times"> &times;</span>{{ item.quantity }}
      </span>
    </h4>
    <p v-if="!editmode && (item.attack || item.ac || item.ammo || typeof item.level !== 'undefined')">
      {{ item.attack }}
      {{ item.ac ? 'AC ' + item.ac : '' }}
      {{ item.level === 0 ? 'Cantrip' : '' }}
      {{ item.level > 0 ? 'Lvl '+ item.level : '' }}
      <span
        v-if="item.bonus || (item.prof && item.type === 'Weapon')"
        class="prof-bonus"
      >
        +{{ item.bonus || prof }}
      </span>
    </p>
    <div class="i-container">
      <i
        class="icon-close sm"
        v-if="editmode"
        @click="$emit('removeItem', item.index)"
      ></i>
      <i
        :class="['icon-prep xs', { 'active': item.prep }]"
        v-if="editmode && (item.level || item.level === 0)"
        @click="$emit('togglePrep', item.index)"
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
        class="icon-inc xs"
        v-if="item.quantity || item.quantity === 0"
        @click="$emit('changeQuantity', 1)"
        @mousedown="setTouchTimer()"
        @mouseup="stopTouchTimer()"
        @mouseleave="stopTouchTimer()"
        @touchstart="setTouchTimer()"
        @touchend="stopTouchTimer()"
      ></i>
      <i
        :class="['icon-dec xs', { 'disable': item.quantity === 0 || (item.quantity === 1 && !zeroQuantity)}]"
        v-if="item.quantity || item.quantity === 0"
        @click="$emit('changeQuantity', -1)"
        @mousedown="setTouchTimer()"
        @mouseup="stopTouchTimer()"
        @mouseleave="stopTouchTimer()"
        @touchstart="setTouchTimer()"
        @touchend="stopTouchTimer()"
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
      'zeroQuantity'
    ],
    data: function() {
      return {
        touchTimer: null
      }
    },
    created: function() {
      this.prof = UserData.data.prof;
    },
    methods: {
      setTouchTimer: function() {
        this.touchTimer = setTimeout(() => this.$emit('quantityHold', this.item), 500);
      },
      stopTouchTimer: function() {
        clearTimeout(this.touchTimer);
      }
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
      width: 135px;
      line-height: 48px;
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-transform: capitalize;
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

      &.disable {
        opacity: 0.5;
        text-indent: 5px;

        .name{
          position: relative;
          &:after {
            content: '';
            position: absolute;
            top: 50%;
            right: -5px;
            left: -5px;
            border-bottom: 1px solid $c-font;
          }
        }
      }
    }

    .empty {
      padding-left: 5px;
      font-size: 10px;
      letter-spacing: 2px;
      font-family: $f-prim;
    }

    .quantity {
      line-height: 24px;
      font-family: $f-prim;
    }

    p {
      text-align: right;
    }

    i {
      cursor: pointer;
      float: left;

      &.active {
        background: $c-sear;
      }
    }

    .i-container {
      float: right;

      i {
        float: right;
        margin: -10px;

        &.disable {
          opacity: 0.5;
          pointer-events: none;
        }
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