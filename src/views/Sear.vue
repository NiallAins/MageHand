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
        @click="acValue = ''; acUpdate()"
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

    <div class="scroll-container">
      <div class="scroll-container-child">
        <itemRow
          v-for="item in userData[listType]"
          :item="item"
          :editmode="true"
          @moreclick="currentItem = $event"
          @toggleProf="toggleParam($event, 'prof')"
          @toggleEquip="toggleParam($event, 'equip')"
          @togglePrep="toggleParam($event, 'prep')"
          @removeItem="removeItem($event)"
        ></itemRow>
      </div>
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
              len < 6 &&
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
        background: #111;
        
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
      border: solid $c-border;
      border-width: 0px 1px 1px 1px;
      overflow: hidden;
      background: $c-bg;
      text-transform: capitalize;
      
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

  .scroll-container-child {
    padding-bottom: 50px;
    height: calc(100vh - 240px);

    .item-row {
      width: calc(100% + 10px);
    }
  }
</style>