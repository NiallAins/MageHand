<template>
  <div class="item-row">
    <i class="icon-more" @click="$emit('moreclick', item.index)"></i>
    <h4 :class="{
      'sm-width': item.ac || item.attack || typeof item.quantity !== 'undefined' || (editmode && typeof item.level !== 'undefined'),
      'md-width': !editmode &&  typeof item.level !== 'undefined',
      'disable': item.quantity === 0
    }">
      <span :class="['name', { 'quantity-space': item.quantity > 1 }]">
        {{ item.index.replace(/-/g, ' ') }}
        <span class="quantity" v-if="item.quantity > 1">
          <span class="times"> &times;</span>{{ item.quantity }}
        </span>
      </span>
    </h4>
    <p v-if="!editmode && (item.attack || item.ac || item.ammo || typeof item.level !== 'undefined')">
      {{ item.attack }}
      {{ item.ac ? 'AC ' + item.ac : '' }}
      {{ item.level === 0 ? 'Cantrip' : '' }}
      {{ item.level > 0 ? 'Lvl '+ item.level : '' }}
      <span
        class="prof-bonus"
        v-if="item.bonus || (item.prof && item.type === 'Weapon')"
      >+{{ item.bonus || prof }}</span>
      <span class="dis-adv" v-if="item.type === 'Armour' && !item.prof">Dis</span>
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
      <span class="spell-level" v-if="editmode && typeof item.level !== 'undefined'">
        {{ item.level ? 'Lvl ' + item.level : 'Cant.' }}
      </span>
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
        tabindex="0"
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
        tabindex="0"
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
      height: 48px;

      &.sm-width {
        width: calc(100% - 185px);
      }

      &.md-width {
        width: calc(100% - 140px);

        &+p {
          width: 90px;
        }
      }

      .name.quantity-space {
        position: relative;
        display: inline-block;
        max-width: calc(100% - 36px);
        padding-right: 38px;
        overflow: hidden;
        text-overflow: ellipsis;

        .quantity {
          position: absolute;
          top: 12px;
          right: 0px;
        }
      }

      &.disable {
        opacity: 0.5;
        text-indent: 5px;

        .name {
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

      &.icon-dec:focus,
      &.icon-inc:focus {
        outline: none;
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

      .spell-level {
        display: inline-block;
        width: 43px;
        line-height: 48px;
        text-align: center;
        font-size: 13px;
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

    .dis-adv {
      vertical-align: 1px;
      padding: 3px 5px;
      border-radius: 8px;
      margin-left: 6px;
      font-size: 14px;
      background: $c-stat;
    }
  }
</style>