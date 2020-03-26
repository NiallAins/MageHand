<template>
  <div id="page_comb">
    <div class="hit-points">
      <div>
        <h4> Hit Points </h4>
        <h2> {{ userData.hp }} / {{ userData.maxHp }} </h2>
      </div>
      <touchButton @press="userData.hp-= (userData.hp > 0 ? 1 : 0)"> - </touchButton>
      <touchButton
        @press="
          userData.hp += (userData.hp < userData.maxHp ? 1 : 0)
          deathSaves = 0;
          deathFails = 0;
        "
      > + </touchButton>
    </div>
    <div :class="{ 'death-throws': true, 'open': userData.hp === 0 }">
      <div>
        <h3> Death Saves </h3>
        <h3> Death Fails </h3>
      </div>
      <div>
        <button
          v-for="i in [1, 2, 3]"
          :class="['slot', 'succ', { 'on': deathSaves >= i }]"
          @click="deathSaves += (deathSaves < i ? 1 : -1)"
        ></button>
        <br/>
        <button
          v-for="i in [1, 2, 3]"
          :class="['slot', 'fail', { 'on': deathFails >= i }]"
          @click="deathFails += (deathFails < i ? 1 : -1)"
        ></button>
      </div>
    </div>
    <div class="float-parent">
      <div class="stat-box">
        <div class="armour-class">
          <h4> Armour </h4>
          <h3> {{ ac }} </h3>
        </div>
      </div>
      <div class="stat-box">
        <div class="init">
          <h4> Initiative Roll </h4>
          <h3> {{ rollInit }} </h3>
          <span class="mod" v-if="baseInit !== 0"> {{ baseInit | addSign }} </span>
          <touchButton @press="setRollInit(-1)"> - </touchButton>
          <touchButton @press="setRollInit(1)"> + </touchButton>
        </div>
      </div>
      <div class="stat-box">
        <div>
          <h4> Speed </h4>
          <h3> {{ userData.speed }} </h3>
        </div>
      </div>
    </div>
    
    <div class="tabs float-parent">
      <div class="tab-border"></div>
      <div
        v-for="tab in tabs"
        :class="{ 'tab': true, 'open': currentTab === tab }"
        @click="currentTab = tab"
      >
        <h3> {{ tab }} </h3>
      </div>
    </div>
    <div class="scroll-container">
      <div :class="['scroll-container-child', { 'death-throws-open': userData.hp === 0 }]">
        <div
          v-if="equipData[currentTab].length === 0"
          class="missing-text"
        >
          You have no available {{ currentTab }}.
        </div>
        <itemRow
          v-for="item in equipData[currentTab]"
          :item="item"
          :zeroQuantity="true"
          @moreclick="currentItem = $event"
          @changeQuantity="setItemQuantity(item, item.quantity + $event)"
        ></itemRow>
      </div>
    </div>

    <itemInfo
      :type="(currentTab === 'weapons' || currentTab === 'armour') ? 'equipment' : currentTab"
      :itemindex="currentItem"
      @close="currentItem = ''"
    ></itemInfo>

    <div :class="['spell-slots', { 'open': spellSlotsOpen, 'editing': spellSlotsEdit }]">
      <button class="close" @click="spellSlotsOpen = false; spellSlotsEdit = false;">
        <i class="icon-close"></i>
      </button>
      <table>
        <tr>
          <td></td>
          <td> Level </td>
          <td colspan="4" class="text-left"> Available Slots </td>
          <td></td>
        </tr>
        <tr
          v-for="(slot, level) in userData.spellSlots"
          :class="{ 'closed': !spellSlotsEdit && slot[0] === 0 }"
        >
          <td>
            <div>
              <button
                :class="{ 'inactive': slot[0] === 0 }"
                @click="setSpellSlot(level, false, true)"
              > - </button>
            </div>
          </td>
          <td><div> {{ level + 1 }} </div></td>
          <td v-for="i in [1, 2, 3, 4]">
            <div>
              <button
                v-if="slot[0] >= i"
                :class="{ 'slot': true, 'on': slot[1] >= i }"
                @click="setSpellSlot(level, slot[1] < i)"
              ></button>
            </div>
          </td>
          <td>
            <div>
              <button
                :class="{ 'inactive': slot[0] === 4 }"
                @click="slot[0] < 4 ? setSpellSlot(level, true, true) : ''"
              > + </button>
            </div>
          </td>
        </tr>
      </table>
      <div class="toggle-edit-container">
        <div class="pull-left">
          <button class="clear-slots" @click="clearSlots()"> Clear </button>
        </div>
        <div class="pull-right">
          <button
            :class="['toggle-edit', { 'active': spellSlotsEdit }]"
            @click="spellSlotsEdit = !spellSlotsEdit"
          >
            <i class="icon-edit"></i>
          </button>
        </div>
      </div>
    </div>
    <div
      :class="['spell-slots-bg', { 'open': spellSlotsOpen }]"
      @click="spellSlotsOpen = false; spellSlotsEdit = false;"
    ></div>

    <div class="spell-slots-toggle" v-if="currentTab === 'spells'">
      <button @click="spellSlotsOpen = true"> Show Spell Slots </button>
    </div>
  </div>
</template>

<script>
  import UserData from '../userData';
  import itemInfo from '../components/itemInfo';
  import itemRow from '../components/itemRow';
  import touchButton from '../components/touchButton';
  import Vue from 'vue';

  export default {
    name: 'Comb',
    components: {
      itemInfo,
      itemRow,
      touchButton
    },
    data: function() {
      return {
        baseInit: 0,
        rollInit: 20,
        deathSaves: 0,
        deathFails: 0,
        spellSlotsOpen: false,
        spellSlotsEdit: false,
        tabs: ['spells', 'features', 'weapons', 'armour'],
        currentTab: 'spells',
        equipData: { spells: [], features: [], weapons: [], armour: [] },
        currentItem: ''
      }
    },
    created: function() {
      this.userData = UserData.data;
      this.baseInit = Math.floor((this.userData.stats[1] - 10) / 2);

      this.equipData.spells = this.userData.spells.filter(s => s.prep);
      this.equipData.weapons = this.userData.equipment.filter(w => (w.equip && w.type === 'Weapon') || w.type === 'Ammunition');
      this.equipData.features = this.userData.features;
      this.equipData.armour = this.userData.equipment.filter(a => a.equip && a.type === 'Armour');

      this.ac = this.equipData.armour.reduce((tot, a) => tot += parseInt(a.ac), 0);
      this.ac += this.equipData.armour.some(a => a.prof) ? this.userData.prof : 0;
    },
    methods: {
      setRollInit: function(diff) {
        this.rollInit += diff;
        if (this.rollInit > 20) {
          this.rollInit -= 20;
        } else if (this.rollInit < 1) {
          this.rollInit += 20;
        }
      },
      setSpellSlot: function(level, increment, setAvailable = false) {
        let editType = setAvailable ? 0 : 1,
            newValue = this.userData.spellSlots[level][editType] + (increment ? 1 : -1);
        Vue.set(this.userData.spellSlots[level], editType, newValue);
        UserData.set('spellSlots', this.userData.spellSlots);
      },
      clearSlots: function() {
        Vue.set(this.userData, 'spellSlots', this.userData.spellSlots.map(s => [s[0], 0]));
        UserData.set('spellSlots', this.userData.spellSlots);
      },
      setItemQuantity: function(item, value) {
        value = parseInt(value);
        item.quantity = value >= 0 ? value : 0;
        UserData.toggleItemParam('equipment', item.index, 'quantity', value);
      }
    },
    filters: {
      addSign: function(num) {
        return (num < 0 ? num.toString() : '+' + num);
      }
    }
  };
</script>

<style lang="scss">
  @import '../vars.scss';

  $c-prim: $c-comb;
  $c-success: $c-prim;
  $c-failure: $c-stat; 

  #page_comb {
    .hit-points {
      position: relative;
      width: 30%;
      margin: 0 auto 20px;
      
      div {
        position: relative;
        z-index: 1;
        height: 80px;
        border: solid $c-border;
        border-width: 1px 0;
        text-align: center;
        background: $c-bg;
      }
      
      &:before, &:after {
        content: '';
        position: absolute;
        z-index: 0;
        width: 56px;
        height: 56px;
        border: 1px solid $c-border;
        background: $c-bg;
      }
      &:before {
        top: 13px;
        left: -29px;
        transform: rotate(225deg);
      }
      &:after {
        top: 12px;
        right: -29px;
        transform: rotate(45deg);
      }
      
      h4 {
        line-height: 1;
        margin-top: 12px;
      }
      
      .touch-button {
        position: absolute;
        z-index: 2;
        top: 20px;
        width: 40px;
        line-height: 40px;
        background: $c-bg;
        border-radius: 100%;
        border: 1px solid $c-border;
        font-family: $f-head;
        font-size: 30px;
        
        &:nth-last-child(1) {
          right: -45px;
        }
        &:nth-last-child(2) {
          left: -45px;
        }
        
        &:focus {
          outline: none;
          line-height: 36px;
          border: 3px solid $c-prim;
        }
      }
    }

    .death-throws {
      overflow: hidden;
      width: 255px;
      height: 0;
      padding: 0 0 0 12px;
      margin: 0;
      border: 1px solid $c-border;
      border-radius: $br-el 0;
      margin: 0 auto;
      opacity: 0;
      transition: all $l-ani-reveal;
      
      &.open {
        height: 90px;
        padding: 10px 0 10px 12px;
        margin: 0 auto 20px;
        opacity: 1;
      }

      .slot {
        margin-left: 20px;
      }
      
      div {
        float: left;
        line-height: 44px;
        
        h3 {
          font-size: 22px;
        }
        
        &:first-child {
          text-align: right;
        }
      }
    }

    .death-throws .slot,
    .spell-slots .slot {
      display: inline-block;
      padding: 10px;
      border: 1px solid $c-border;
      border-radius: 100%;
      vertical-align: middle;

      &.succ.on {
        background: $c-success;
      }
      &.fail.on {
        background: $c-failure;
      }
      &.slot.on {
        background: $c-prim;
      }
    }

    .spell-slots {
      position: fixed;
      top: -100vh;
      z-index: $z-modal;
      transform: translateY(-50%);
      width: calc(100% - #{$w-pad * 2});
      max-width: #{$w-max - (2 * $w-pad)};
      max-height: calc(100vh - #{2 * $w-pad});
      height: auto;
      border: 1px solid $c-border;
      border-radius: $br-mod 0;
      background: $c-bg;
      opacity: 0;
      overflow: auto;
      @include scrollbar;

      .close {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 1;
        text-align: left;
        padding: 0;
        border: none;
      }

      .toggle-edit-container {
        width: calc(100% - 40px);
        padding: 0 20px 20px;
        overflow: hidden;

        div {
          width: 50%;
        }

        .pull-left {
          text-align: left;
          float: left;
        }

        .pull-right {
          float: right;
          text-align: right;
        }

        .clear-slots {
          padding: 0 16px;
          margin: 3px 0;
          line-height: 38px;
          border: 1px solid $c-border;
          border-radius: $br-el;
        }

        .toggle-edit {
          position: unset;
          right: unset;
          width: 48px;
          height: 48px;

          &.active {
            background: $c-prim;
          }

          i {
            margin: -9px 0 0 -9px;
            transform: scale(0.6);
          }
        }
      }

      &.open {
        top: 50%;
        opacity: 1;
        transition: opacity $l-ani-mod;
      }
      
      table {
        margin: 18px auto 0;
        padding-right: 10px;
        
        td {
          width: 18%;
          padding-top: 0;
          padding-bottom: 8px;
          line-height: 28px;
          text-align: center;
          transition: padding-bottom $l-ani-reveal;

          & > div {
            height: 32px;
            overflow: hidden;
            opacity: 1;
            transition:
              height $l-ani-reveal,
              opacity $l-ani-reveal;
          }

          &.text-left {
            text-align: left;
            text-indent: 8%;
          }

          &:first-child,
          &:last-child {
            position: relative;
            width: 5%;
            opacity: 0;
            pointer-events: none;
            transition: opacity $l-ani-reveal;

            button {
              height: 32px;
              width: 32px;
              border: 1px solid $c-border;
              border-radius: 100%;

              &.inactive {
                pointer-events: none;
                opacity: 0.4;
              }
            }
          }
          &:first-child {
            left: 8px;
          }
        }

        tr.closed td {
          padding-bottom: 0; 

          & > div {
            height: 0;
          }
        }
      }

      &.editing {
        td {
          padding-bottom: 20px;
        }

        td:first-child,
        td:last-child {
          opacity: 1;
          pointer-events: all;
        }

        .slot {
          pointer-events: none;
        }
      }
    }

    .spell-slots-bg {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: $z-modal - 1;
      height: 0;
      background: $c-mod-bg;
      opacity: 0;

      &.open {
        height: 100vh;
        opacity: 1;
        transition: opacity $l-ani-mod;
      }
    }

    .spell-slots-toggle {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: $z-nav - 1;
      width: calc(100% - #{$w-pad * 2});
      text-align: center;
      
      button {
        width: 180px;
        padding: 8px;
        border: 1px solid $c-border;
        border-radius: $br-el;
        background: $c-bg;
        font-size: $f-size-md;
      }
    }

    .stat-box {
      float: left;
      width: 33%;
      height: 80px;
      padding-bottom: 25px;
      text-align: center;
      
      div {
        display: inline-block;
        width: 75px;
        height: 80px;
        padding-top: 8px;
        border: 1px solid $c-border;
        border-radius: $br-el;
        
        @media (max-width: 360px) {
          width: 65px;
        }
      
        h3 {
          line-height: 1.2;
        }

        &.armour-class {
          border-radius: 0 0 50% 50%;
        }
        
        &.init {
          position: relative;
          width: 104px;
          border-radius: $br-el $br-el 20px 20px;
          
          .touch-button {
            position: absolute;
            bottom: -1px;
            width: 40px;
            height: 40px;
            padding-top: 5px;
            background: none;
            border: none;
            
            &:focus {
              outline: none;
              top: 52px;
              
              span {
                border: 3px solid $c-prim;
              }
            }
            
            span {
              display: inline-block;
              pointer-events: none;
              width: 33px;
              height: 33px;
              line-height: 33px;
              color: $c-font;
              font-size: 20px;
              background: $c-bg;
              border: 1px solid $c-border;
            }
            
            &:nth-last-child(1) {
              right: -4px;
              
              span {
                border-radius: 50% 50% 50% 0;
              }
            }
            &:nth-last-child(2) {
              left: -10px;
              
              span {
                border-radius: 50% 50% 0 50%;
              }
            }
          }
        }
        
        .mod {
          position: absolute;
          bottom: -15px;
          right: 36px;
          width: 30px;
          line-height: 30px;
          border-radius: 100%;
          text-align: center;
          color: $c-font;
          background: $c-prim;
        }
      }
    }

    .tabs {
      margin: 20px 0 10px;

      .tab-border {
        position: absolute;
        left: 0;
        right: 0;
        z-index: 0;
        border-bottom: 1px solid $c-border;
        margin-top: 40px;
      }

      .tab {
        width: calc(25% - 2px);
        float: left;
        border: 1px solid $c-border;
        border-radius: $br-el $br-el 0 0;
        margin: 0 -1px -1px 0;
        text-indent: 10%;
        background: $c-bg-tab;
        cursor: pointer;
        
        &.open {
          position: relative;
          z-index: 1;
          border-bottom-color: $c-bg;
          background: $c-bg;
        }
        
        h3 {
          font-size: 15px;
          line-height: 40px;
        }
      }
    }
    
    .scroll-container-child {
      height: calc(100vh - 410px);
      transition: height $l-ani-reveal;

      &.death-throws-open {
        height: calc(100vh - 540px);
      }

      .item-row {
        margin-right: 10px;
      }
    }

    .missing-text {
      padding-top: 10px;
      text-align: center;
    }

    .item-row .prof-bonus {
      background: $c-prim;
    }
  }
</style>
