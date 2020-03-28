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

    <div class="btn-custom">
      <button @click="customModalOpen = true">
        Add Custom {{ tabSingle[listType] }}
      </button>
    </div>

    <div
      :class="['modal-bg dark-bg', { 'open': quantityModalItem }]"
      @click="quantityModalItem = null"
    ></div>
    <div
      :class="['quantity-modal', { 'open': quantityModalItem }]"
      v-if="quantityModalItem"
    >
      <button class="btn-close" @click="quantityModalItem = null">
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

    <div
      :class="['modal-bg dark-bg', { 'open': customModalOpen }]"
      @click="closeCustomModal()"
    ></div>
    <div :class="['custom-modal', { 'open': customModalOpen }]">
      <button class="btn-close" @click="closeCustomModal()">
        <i class="icon-close"></i>
      </button>
      <h3> Add Custom {{ tabSingle[listType] }} </h3>
      <input
        v-model="customObject.name"
        type="text"
        placeholder="Name..."
      />
      <dropdown
        v-if="listType === 'spells'"
        v-model="customObject.spell_level"
        placeholder="Spell Level..."
        :options="[
          'Cantrip',
          'Level 1',
          'Level 2',
          'Level 3',
          'Level 4',
          'Level 5',
          'Level 6',
          'Level 7',
          'Level 8',
          'Level 9'
        ]"
        :noCustom="true"
      ></dropdown>
      <div v-if="listType === 'equipment'">
        <dropdown
          v-model="customObject.equip_type"
          placeholder="Type..."
          :noCustom="true"
          :options="[
            'Weapon',
            'Ammunition',
            'Armour',
            'Item'
          ]"
        ></dropdown>
        <div class="damages" v-if="customObject.equip_type === 'Weapon'">
          <input
            type="text"
            v-model="customObject.damage_die"
            placeholder="Damge Dice..."
          />
          <dropdown
            v-model="customObject.damage_type"
            placeholder="Damage Type..."
            :options="[
              'acid',
              'bludgeoning',
              'cold',
              'fire',
              'force',
              'lightning',
              'necrotic',
              'piercing',
              'poison',
              'psychic',
              'radiant',
              'slashing',
              'thunder'
            ]"
          ></dropdown>
        </div>
        <div v-if="customObject.equip_type === 'Armour'">
          <input
            type="number"
            class="ac"
            v-model="customObject.ac"
            placeholder="AC..."
          />
          <div class="dex-bonus">
            <div class="checkbox">
              <input
                id="dex_bonus"
                type="checkbox"
                v-model="customObject.dex_bonus"
              />
              <label for="dex_bonus"> Dex Bonus </label>
            </div>
            <input
              type="number"
              v-if="customObject.dex_bonus"
              v-model="customObject.max_dex"
              placeholder="Max Bonus ?"
            />
          </div>
        </div>
      </div>
      <textbox
        v-model="customObject.desc"
        :placeholder="(customObject.equip_type || tabSingle[listType]) + ' Description...'"
      ></textbox>
      <div class="btn-container">
        <button @click="saveCustomItem()"> Save {{ tabSingle[listType] }} </button>
      </div>
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
  import dropdown from '../components/dropdown';
  import textbox from '../components/textbox';

  export default {
    name: 'Sear',
    components: {
      itemRow,
      itemInfo,
      dropdown,
      textbox
    },
    data: function() {
      return {
        acList: [],
        acValue: '',
        listType: 'spells',
        currentItem: '',
        quantityModalItem: null,
        customModalOpen: null,
        customObject: {
          name: '',
          desc: '',
          equip_type: '',
          damage_die: '',
          damge_type: '',
          ac: '',
          dex_bonus: false,
          max_dex: null,
          spell_level: ''
        },
        toastContent: '',
        toastTimeout: null,
      }
    },
    created: function() {
      this.userData = UserData.data;
      this.tabs = ['spells', 'features', 'equipment'];
      this.lists = {
        'spells': searchData.spells,
        'features': searchData.features,
        'equipment': searchData.equipment
      };
      this.tabSingle = {
        spells: 'Spell',
        features: 'Feature',
        equipment: 'Equipment'
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
      },
      saveCustomItem: function() {
        let customIndex = this.customObject.name.replace(/[^a-z0-9]/gi, '-');
        if (UserData.data[this.listType].findIndex(i => i.index === customIndex) !== -1) {
          this.setToast('Name Already in Use');
          return;
        }
        if (!this.customObject.name) {
          this.setToast('Missing Name');
          return;
        }
        if (this.listType === 'spells' && !this.customObject.spell_level) {
          this.setToast('Missing Spell Level');
          return;
        }
        if (this.listType === 'equipment') {
          if (!this.customObject.equip_type) {
            this.setToast('Missing Equipment Type');
            return;
          }
          if (this.customObject.equip_type === 'Weapon' && !this.customObject.damage_die) {
            this.setToast('Missing Damage');
            return;
          }
          if (this.customObject.equip_type === 'Armour' && !this.customObject.ac) {
            this.setToast('Missing Armour Class');
            return;
          }
        }

        let newItem = {
          custom: true,
          index: customIndex,
          name: this.customObject.name,
          desc: [this.customObject.desc]
        };
        if (this.listType === 'equipment') {
          newItem.type = this.customObject.equip_type;
          newItem.equip = false;
          newItem.prof = false;
          if (this.customObject.equip_type === 'Weapon') {
            newItem.attack = this.customObject.damage_die;
            if (this.customObject.damage_type) {
              newItem.attack += ' ' + this.customObject.damage_type;
            };
          } else if (this.customObject.equip_type === 'Armour') {
            newItem.ac = this.customObject.ac;
            if (this.customObject.dex_bonus) {
              newItem.dex_bonus = true;

              if (this.customObject.max_dex) {
                newItem.max_dex = this.customObject.max_dex;
              }
            }
          } else {
            newItem.quantity = 1;
          }
          if (this.customObject.equip_type === 'Ammunition') {
            newItem.ammo = true;
          }
        } else if (this.listType === 'spells') {
          newItem.prep = false;
          newItem.level = this.customObject.spell_level === 'Cantrip' ? 0 : this.customObject.spell_level.replace('Level ', '');
        }
        UserData.setItem(this.listType, newItem);
        this.closeCustomModal();
      },
      closeCustomModal: function() {
        this.customModalOpen = false;
        for (let prop in this.customObject) {
          this.customObject[prop] = '';
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '../vars.scss';

  $c-prim: $c-sear;

  #page_sear {
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

    .btn-custom {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 20px;
      z-index: $z-dropdown;
      text-align: center;

      button {
        width: 190px;
        padding: 8px;
        border: 1px solid $c-border;
        border-radius: $br-el;
        background: $c-bg;
        font-size: $f-size-md;
        
        &:active {
          padding: 7px;
          border: 2px solid $c-prim;
        }
      }
    }

    .toast {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: $z-modal + 1;
      width: 180px;
      height: 22px;
      line-height: 22px;
      padding: 5px 20px;
      border-radius: $br-el;
      border: 1px solid #fff1;
      text-align: center;
      background: $c-bg;
      opacity: 0;
      pointer-events: none;
      transition:
        opacity $l-ani-dd,
        bottom 0s ease $l-ani-dd;
      box-shadow: 0 4px 8px 2px $c-mod-bg;

      &.open {
        bottom: 80px;
        opacity: 1;
        transition:
          opacity $l-ani-dd,
          bottom $l-ani-dd;
      }
    }

    .quantity-modal,
    .custom-modal {
      position: fixed;
      z-index: $z-modal;
      padding: 10px;
      border: 1px solid $c-border;
      border-radius: $br-mod 0;
      background: $c-bg;
      opacity: 0;

      &.open {
        transition: opacity $l-ani-mod;
        opacity: 1;
      }

      .btn-close {
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

      input[type="number"] {
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

    .quantity-modal {
      top: -100vh;
      left: calc(50% - 136px);
      transform: translateY(-50%);
      width: 250px;

      &.open {
        top: 50%;
      }
    }

    .custom-modal {
      top: -100vh;
      height: calc(100vh - #{22 + (2 * $w-pad)});
      width: calc(100vw - #{22 + (2 * $w-pad)});
      max-width: #{$w-max - (2 * $w-pad)};

      h3 {
        margin-bottom: 20px;
      }

      &.open {
        top: $w-pad;
      }

      input:focus {
        outline: 2px solid $c-prim;
      }

      .textbox {
        clear: both;
        margin-top: 30px;

        &.focus {
          outline: 2px solid $c-prim;
          outline-offset: -3px;
        }
      }

      input,
      input[type="text"] {
        display: block;
        width: calc(100% - #{2 + ($w-pad * 2)});
        margin: 10px 0;
        font-size: 17px;
      }

      .damages {
        &>input {
          width: calc(50% - #{$w-pad + 15});
          min-width: 116px;
          margin: 0 10px 10px 0;
        }

        &>input,
        .dropdown {
          float: left;
          margin-top: 0;

          input[type="text"] {
            margin-top: 0;
            margin-bottom: 0;
          }
        }

        .dropdown {
          margin-bottom: 20px;
        }
      }

      .dropdown {
        width: calc(50% - 5px);
        min-width: 134px;

        input {
          text-transform: capitalize;
        }
      }

      input[type="number"].ac {
        width: calc(50% - #{$w-pad + 19});
        min-width: 116px;
        margin: 0;
        text-align: left;
        padding: 0 10px;
        line-height: 34px;
      }

      .dex-bonus {
        overflow: auto;

        input[type="number"] {
          float: left;
          text-align: left;
          line-height: 34px;
          padding: 0 10px;
          margin: 10px 0 0 15px;
          width: 110px;
        }

        .checkbox {
          float: left;
          margin: 10px 0;
          line-height: 34px;

          input {
            display: inline-block;
            width: 0;
            height: 0;
            margin: 0;
            padding: 0;
            visibility: hidden;
          }

          label {
            position: relative;
            top: 1px;
            padding: 0 38px 0 10px;
            user-select: none;

            &:before {
              content: '';
              position: absolute;
              top: -5px;
              right: -40px;
              width: 27px;
              height: 27px;
              border: 1px solid $c-border;
              border-radius: $br-el;
            }

            &:after {
              content: '';
              position: absolute;
              top: 0px;
              right: -35px;
              width: 19px;
              height: 19px;
              border-radius: $br-el;
            }
          }

          input:focus+label:before {
            outline: 2px solid $c-prim;
          }

          input:checked+label:after {
              background: $c-prim;
          }
        }
      }

      .btn-container {
        position: absolute;
        right: 20px;
        bottom: 0;
        left: 20px;
        padding: 20px 0;
        text-align: center;
        background: $c-bg;

        button {
          width: 200px;
          padding: 8px 10px;
          border: 1px solid $c-border;
          border-radius: $br-el;
          font-size: 16px;

          &:active {
            padding: 7px 9px;
            border: 2px solid $c-prim;
          }
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

      &.dark-bg {
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

        i.icon-dec:active:before {
          border-top-color: $c-prim;
        }
        i.icon-inc:active:before {
          border-bottom-color: $c-prim;
        }
      }
    }
  }
</style>