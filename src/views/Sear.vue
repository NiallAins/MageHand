<template>
  <div id="page_sear">
    <div class="tabs">
      <div class="tab-container">
        <div
          v-for="tab in tabs"
          :class="{ 'open': listType === tab }"
          @click="
            listType = tab;
            acValue = '';
            acUpdate();
          "
        >
          <h3> {{ tab === 'equipment' ? 'items' : tab }} </h3>
        </div>
      </div>
    </div>
    <div class="autocomplete">
      <input 
        type="text"
        v-model="acValue"
        @input="acUpdate"
        :placeholder="'Search for ' + listType + '...'"
      >
      <span
        v-if="acValue !== ''"
        class="clear-search"
        @click="acValue = ''; acUpdate();"
      > × </span>
      <div class="autocomplete-container">
        <ul
          class="autocomplete-list"
          v-if="acList.length > 0"
        >
          <li
            v-for="item in acList"
            @click="
              currentItem = (item.url || item);
              acValue = '';
              acUpdate();"
          >
            {{ (item.name || item).replace(/-/g, ' ') }}
          </li>
        </ul>
      </div>
    </div>
    <div
      :class="['modal-bg', { 'open': acList.length > 0 }]"
      @click="acValue = ''; acUpdate();"
    ></div>

    <div class="scroll-container">
      <div class="scroll-container-child">
        <itemRow
          v-for="item in userData[listType]"
          :item="item"
          :editmode="true"
          @moreclick="currentItem = $event"
          @toggleProf="
            toggleParam($event, 'prof');
            setToast('Proficiency ' + (item.prof ? 'Added' : 'Removed'));
          "
          @toggleEquip="
            toggleParam($event, 'equip');
            setToast('Item ' + (item.equip ? 'Equiped' : 'Unequiped'));
          "
          @togglePrep="
            toggleParam($event, 'prep');
            setToast(item.prep ? 'Spell Prepared' : 'Removed from Prepared');
          "
          @removeItem="removeItem($event)"
          @changeQuantity="setItemQuantity(item, item.quantity + $event)"
          @quantityHold="quantityModalItem = $event"
        ></itemRow>
      </div>
    </div>

    <div
      :class="['modal-bg quantity-bg', { 'open': quantityModalItem }]"
      @click="quantityModalItem = null"
    ></div>
    <div
      :class="['quantity-modal', { 'open': quantityModalItem }]"
      v-if="quantityModalItem"
    >
      <button @click="quantityModalItem = null">
        <i class="icon-close"></i>
      </button>
      <h3> {{ quantityModalItem.index.replace(/-/g, ' ') }} </h3>
      <p> Set quantity: </p>
      <input
        type="number"
        min="1"
        :value="quantityModalItem.quantity"
        @blur="setItemQuantity(quantityModalItem, $event.target.value)"
      />
    </div>
  
    <div :class="['toast', { 'open': toastContent }]">
      {{ toastContent }}
    </div>

    <itemInfo
      :type="listType"
      :itemindex="currentItem"
      :addbutton="true"
      @close="currentItem = ''"
    ></itemInfo>
  </div>
</template>

<script>
  import UserData from '../userData';
  import searchData from '../searchData';
  import itemRow from '../components/itemRow';
  import itemInfo from '../components/itemInfo';

  export default {
    name: 'Sear',
    components: {
      itemRow,
      itemInfo
    },
    data: function() {
      return {
        acList: [],
        acValue: '',
        listType: 'spells',
        currentItem: '',
        quantityModalItem: null,
        toastContent: '',
        toastTimeout: null,
        tabs: ['spells', 'features', 'equipment']
      }
    },
    created: function() {
      this.userData = UserData.data;
      this.lists = {
        'spells': searchData.spells,
        'features': searchData.features,
        'equipment': searchData.equipment
      }
    },
    methods: {
      acUpdate: function() {
        let matchValue = this.acValue.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
            matchLength = matchValue.length;
        if (matchLength > 0) {
          let len = 0;
          this.acList = this.lists[this.listType].filter(item => {
            if (
              (item.name || item)
                .split('-')
                .some(i => i.substr(0, matchLength) === matchValue)
            ) {
              len++;
              return true;
            }
          });
        } else {
          this.acList = [];
        }
      },
      removeItem: function(itemIndex) {
        UserData.setItem(this.listType, itemIndex, true);
      },
      toggleParam: function(itemIndex, param) {
        UserData.toggleItemParam(this.listType, itemIndex, param);
      },
      setItemQuantity: function(item, value) {
        value = parseInt(value);
        item.quantity = (value > 0 ? value : 1);
        UserData.toggleItemParam('equipment', item.index, 'quantity', value);
      },
      setToast: function(msg) {
        this.toastContent = msg;
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => this.toastContent = '', 1600);
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '../vars.scss';

  $c-prim: $c-sear;

  .tabs {
    position: absolute;
    z-index: $z-dropdown;
    left: 0;
    right: 0;
    padding: 0 $w-pad;
    border-bottom: 1px solid $c-border;

    .tab-container {
      max-width: $w-max;
      margin: 0 auto;
    
      div {
        width: calc(33% - 2px);
        float: left;
        border: 1px solid $c-border;
        border-radius: $br-el $br-el 0 0;
        margin: 0 -1px -1px 0;
        text-indent: 10%;
        background: $c-bg-tab;
        
        &.open {
          border-bottom-color: $c-bg;
          background: $c-bg;
        }
        
        h3 {
          font-size: 18px;
          line-height: 40px;
        }
      }
    }
  }

  .autocomplete {
    position: relative;
    padding-top: 70px;
    
    input, .autocomplete {
      width: calc(100% - #{($w-pad * 2) + 1});
    }

    input[type=text]:focus {
      outline: 2px solid $c-prim;
    }
    
    .clear-search {
      position: absolute;
      top: 77px;
      right: 10px;
      z-index: 1;
      font-size: 25px;
      cursor: pointer;
    }
    
    .autocomplete-list {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: $z-dropdown;
      max-height: 192px;
      border: solid $c-border;
      border-width: 0px 1px 1px 1px;
      overflow: auto;
      background: $c-bg;
      text-transform: capitalize;
      @include scrollbar;
      
      li {
        padding: 5px $w-pad;
        font-size: $f-size-bg;
        line-height: 20px;
        
        &:hover {
          background-color: $c-bg-light;
        }
      }
    }
  }

  .toast {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: $z-dropdown;
    width: 180px;
    height: 22px;
    line-height: 22px;
    padding: 5px 20px;
    border-radius: $br-el;
    text-align: center;
    opacity: 0;
    transition:
      opacity $l-ani-dd,
      bottom 0s ease $l-ani-dd;
    box-shadow: 0 4px 8px 2px $c-mod-bg;

    &.open {
      bottom: 50px;
      opacity: 0.9;
      transition:
        opacity $l-ani-dd,
        bottom $l-ani-dd;
    }
  }

  .quantity-modal {
    position: fixed;
    top: 50%;
    left: calc(50% - 136px);
    z-index: $z-modal;
    transform: translateY(-50%);
    width: 250px;
    padding: 10px;
    border: 1px solid $c-border;
    border-radius: $br-mod 0;
    background: $c-bg;
    opacity: 0;

    &.open {
      transition: opacity $l-ani-mod;
      opacity: 1;
    }

    button {
      position: absolute;
      top: 6px ;
      right: 0px;
      text-align: left;
      border: none;
    }

    h3 {
      padding: 0 45px 0 10px;
      line-height: 42px;
      font-size: 18px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p {
      text-align: center;
      margin: 0;
    }

    input {
      display: block;
      width: 50px;
      padding: 10px;
      border: 1px solid $c-border;
      margin: 10px auto;
      color: $c-font;
      font-size: 18px;
      font-family: $f-prim;
      text-align: right;
      background: $c-bg;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      -moz-appearance: textfield;

      &:focus {
        outline: 2px solid $c-prim;
      }
    }
  }

  .modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: $z-dropdown - 1;
    height: 0;

    &.quantity-bg {
      background: $c-mod-bg;
      opacity: 0;
    }

    &.open {
      height: 100vh;
      opacity: 1;
      transition: opacity $l-ani-mod;
    }
  }

  .scroll-container-child {
    padding-bottom: 50px;
    height: calc(100vh - 240px);

    .item-row {
      width: calc(100% + 10px);
    }
  }
</style>