<template>
  <div
    :class="{
      'item-info': true,
      'open': fadeIn ? true : false,
      'spell-info': type === 'spells',
      'feats-info': type === 'features',
      'equip-info': type === 'equipment'
    }"
  >
    <div class="modal">
      <div v-if="info">
        <h3 :class="{ 'font-sm': info.name.length > 18 }">
          {{ info.name }}
          <i
            class="icon-close"
            @click="$emit('close'); fadeIn = false"
          ></i>
        </h3>

        <div class="scroll-container">
          <div class="scroll-container-child">
            <ul v-if="type === 'spells'">
              <li v-if="info.school">
                {{ info.level === 0 ? 'Cantrip of' : 'Level ' + info.level + ' Spell' }}
                {{ info.school.name }}
              </li>
              <li v-if="!info.school">
                {{ info.level }}
              </li>
              <li v-if="info.components"> Uses {{ info.components.map(c => spellComponents[c]).join(', ') }} </li>
              <li v-if="info.range === 'Self'"> Affects self </li>
              <li v-if="info.range"> Range of <span class="l-case">{{ info.range }}</span> </li>
              <li v-if="info.casting_time">
                Takes <span class="l-case">{{ info.casting_time }}</span>,
                <span v-if="info.duration === 'Instantaneous'"> affects instantaneously </span>
                <span v-else class="l-case"> lasts {{ info.duration }} </span>
              </li>
              <li v-if="info.ritual"> Ritual </li>
              <li v-if="info.concentration"> Concentration </li>
              <li v-if="info.material"> Requires <span class="l-case">{{ info.material }}</span> </li>
            </ul>

            <ul v-if="type === 'equipment'">
              <li>
                {{ info[equipCategories[info.equipment_category]] }}
                <span v-if="info.type === 'Armor' || info.equipment_category === 'Armor'">
                  Armor
                </span>
                <span v-if="info.type === 'Weapon' || info.equipment_category === 'Weapon'">
                  {{ info.weapon_range || '' }} Weapon
                </span>
              </li>

              <div v-if="info.type === 'Weapon' || info.equipment_category === 'Weapon'">
                <li>
                  {{ info.attack || (info.damage.damage_dice + ' ' + info.damage.damage_type.name) }}
                </li>
                <li v-if="info.range">
                  Range of
                  {{ info.range.normal }}
                  ft{{ info.range.long ? ', ' + info.range.long + ' ft long' : '' }}
                </li>
                <li v-if="info.throw_range">
                  Throws
                  {{ info.throw_range.normal }}
                  ft{{ info.throw_range.long ? ', ' + info.throw_range.long + ' ft long' : '' }}
                </li>
                <li v-if="info.properties && info.properties.length > 0">
                  {{ info.properties.map(i => i.name).join(', ') }}
                </li>
              </div>

              <div v-if="info.type === 'Armour' || info.equipment_category === 'Armor'">
                <li v-if="info.armor_class">
                  AC {{ info.armor_class.base }}{{ info.armor_class.dex_bonus ? ' + Dex' : '' }}
                  <span v-if="info.armor_class.max_bonus">
                    (max bonus {{ info.armor_class.max_bonus }})
                  </span>
                </li>
                <li v-if="info.ac">
                  AC {{ info.ac }}
                </li>
                <li v-if="info.str_minimum"> Min Str {{ info.str_minimum }} </li>
                <li v-if="info.stelth_disadvantage"> Stealth Disadvantage </li>
              </div>

              <li v-if="info.speed"> Speed of {{ info.speed.quantity }} {{ info.speed.unit }} </li>
              <li v-if="info.capacity"> {{ info.capacity }} capacity</li>

              <li class="item-pad"> 
                <span v-if="info.weight"> {{ info.weight }} lb,</span>
                <span v-if="info.cost">
                  {{ info.cost.quantity }}
                  {{ costUnits[info.cost.unit] || info.cost.unit }}
                </span>
              </li>

              <li class="gear-list" v-if="info.gear_category === 'Equipment Pack'">
                Contents:
                <ul>
                  <li v-for="i in info.contents">
                    {{ i.item_url.replace('/api/equipment/', '').replace(/-/g, ' ') }}
                    <span v-if="i.quantity > 1" class="times"> &times;</span>{{ i.quantity > 1 ? i.quantity : '' }}
                  </li>
                </ul>
              </li>
            </ul>

            <ul v-if="type === 'features' && info.level">
              <li> Level {{ info.level }} {{ info.class.name }} </li>
            </ul>

            <p v-for="para in info.desc" v-html="para"></p>
            <p v-for="para in info.higher_level" v-html="para"></p>
          </div>
        </div>

        <div
          class="add-btn"
          v-if="addbutton && canAdd"
        >
          <button @click="
            addItem();
            $emit('close');
            fadeIn = false
          ">
            Add {{ info.gear_category === 'Equipment Pack' ? 'Contents' : '' }}
          </button>
        </div>
      </div>

      <div v-if="!info">
        <h4 class="loader">loading...</h4>
      </div>
    </div>
  </div>
</template>

<script>
  import UserData from '../userData';

  export default {
    name: 'itemInfo',
    props: [
      'type',
      'itemindex',
      'addbutton'
    ],
    data : function() {
      return {
        info: null,
        fadeIn: false,
        canAdd: true
      }
    },
    created: function() {
      this.spellComponents = {
        'V': 'voice',
        'S': 'hand gesture',
        'M': 'materials'
      };
      this.equipCategories = {
        'Weapon': 'weapon_category',
        'Armor': 'armor_category',
        'Tools': 'tool_category',
        'Mounts and Vehicles': 'vehicle_category',
        'Adventuring Gear': 'gear_category'
      };
      this.costUnits = {
        'gp': 'gold',
        'sp': 'silver',
        'cp': 'copper',
        'pp': 'platinum',
        'ep': 'electrum'
      };
      this.extraItems = [
        {
          "name": "gold piece",
          "index": "gold-piece",
          "equipment_category": "currency",
          "cost": {
            "quantity": 1,
            "unit": "gp"
          },
          "weight": "1/50",
          "desc": ["A gold coin. The standard unit of measure for wealth."]
        },
        {
          "name": "silver piece",
          "index": "silver-piece",
          "equipment_category": "currency",
          "cost": {
            "quantity": 1,
            "unit": "sp"
          },
          "weight": "1/50",
          "desc": ["A silver coin. Ten silver is worth one gold."]
        },
        {
          "name": "copper piece",
          "index": "copper-piece",
          "equipment_category": "currency",
          "cost": {
            "quantity": 1,
            "unit": "cp"
          },
          "weight": "1/50",
          "desc": ["A copper coin. Ten copper is worth one silver, one hundred is worth one gold."]
        },
        {
          "name": "platinum piece",
          "index": "platinum-piece",
          "equipment_category": "currency",
          "cost": {
            "quantity": 10,
            "unit": "gp"
          },
          "weight": "1/50",
          "desc": ["A rare platinum coin. Originating from fallen empires and lost kingdoms, they sometimes arouse suspicion and skepticism when used in transactions."]
        },
        {
          "name": "electrum piece",
          "index": "electrum-piece",
          "equipment_category": "currency",
          "cost": {
            "quantity": 5,
            "unit": "sp"
          },
          "weight": "1/50",
          "desc": ["A rare electrum coin. Originating from fallen empires and lost kingdoms, they sometimes arouse suspicion and skepticism when used in transactions."]
        }
      ];
    },
    watch: {
      itemindex: function() {
        this.getData();
      }
    },
    methods: {
      getData: function() {
        if (this.itemindex) {
          this.info = null;
          this.fadeIn = true;
          let possibleCustomItem = UserData.data[this.type].find(i => i.index === this.itemindex);
          if (possibleCustomItem && possibleCustomItem.custom) {
            this.info = possibleCustomItem;
            this.canAdd = false;
          } else {
            let extraItemIndex = this.extraItems.findIndex(i => i.index === this.itemindex);
            if (extraItemIndex > -1) {
              this.info = this.extraItems[extraItemIndex];
              this.canAdd = UserData.data[this.type].findIndex(i => i.index === this.info.index) === -1;
            } else {
              let ajax = new XMLHttpRequest(),
                  url = `https://www.dnd5eapi.co/api/${this.type}/${this.itemindex}`;
              ajax.onload = () => {
                if (ajax.status >= 200 && ajax.status < 300) {
                  this.info = JSON.parse(ajax.responseText);
                  this.canAdd = UserData.data[this.type].findIndex(i => i.index === this.info.index) === -1;
                }
              };
              ajax.open('GET', url);
              ajax.send();
            }
          }
        } else {
          this.info = null;
        }
      },
      addItem: function(item, quantity = 1) {
        if (!item && this.info.gear_category === 'Equipment Pack') {
          this.info.contents.forEach(packItem => {
            let ajax = new XMLHttpRequest(),
                url = 'https://www.dnd5eapi.co' + packItem.item_url;
            ajax.onload = () => {
              if (ajax.status >= 200 && ajax.status < 300) {
                this.addItem(JSON.parse(ajax.responseText), packItem.quantity);
              }
            }
            ajax.open('GET', url);
            ajax.send();
          });
        } else {
          if (!item) {
            item = this.info;
          }
          if (UserData.data[this.type].findIndex(i => i.index === item.index) > -1) {
            return;
          }
          let newItem = {
            index: item.index
          };
          if (this.type === 'equipment') {
            newItem.type = 'Item';
            if (item.gear_category === 'Ammunition') {
              newItem.type = 'Ammunition';
            } else if (item.damage) {
              newItem.type = 'Weapon';
            } else if (item.armor_class) {
              newItem.type = 'Armour';
            }
            newItem.equip = false;
            newItem.prof = false;
            if (item.damage) {
              newItem.attack = item.damage.damage_dice + ' ' + item.damage.damage_type.name;
            } else if (item.armor_class) {
              newItem.ac = item.armor_class.base;
            } else {
              newItem.quantity = parseInt(quantity);
            }
          } else if (this.type === 'spells') {
            newItem.prep = false;
            newItem.level = item.level;
          }
          UserData.setItem(this.type, newItem);
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '../vars.scss';

  .item-info {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -$z-modal;
    padding: $w-pad;
    background: $c-mod-bg;
    opacity: 0;
    transition:
      opacity $l-ani-mod,
      z-index 0s ease $l-ani-mod;
    
    &.open {
      opacity: 1;
      z-index: $z-modal;
      transition:
        opacity $l-ani-mod;
    }
    
    .modal {
      position: relative;
      overflow: auto;
      height: calc(100vh - #{$w-pad * 2} - 110px);
      min-width: $w-min - 60;
      max-width: $w-max;
      padding: 70px 10px 40px;
      border: 1px solid $c-border;
      border-radius: $br-mod 0;
      margin: 0 auto;
      background: $c-bg;
      
      h3 {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 1px; 
        padding: 15px 45px 6px 9px;
        border-radius: $br-mod;
        line-height: 28px;
        background: $c-bg;

        &.font-sm {
          font-size: 18px;
          line-height: 20px;
          padding-top:  10px;
        }

        .icon-close {
          position: absolute;
          top: 0px;
          right: 0px;
          z-index: 1;
          font-size: 30px;
          font-weight: bold;
          cursor: pointer;
        } 
      }

      .gear-list {
        padding-top: 15px;

        ul {
          list-style: dotted;
          padding-left: 20px;

          li {
            text-transform: capitalize;
          }
        }
      }

      .scroll-container {
        position: absolute;
        top: 52px;
        bottom: 52px;
        left: $w-pad;
        right: $w-pad;

        .scroll-container-child {
          height: calc(100% - 40px);
          margin-right: 2px;
        }
      }
    }
    
    .loader {
      position: absolute;
      left: calc(50% - 20px);
      top: 100px;
    }
    
    .add-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 5px 0 10px;
      background: $c-bg;
      text-align: center;
      
      button {
        width: 80%;
        line-height: 35px;
        border: 1px solid $c-border;
        border-radius: $br-el;
        font-size: $f-size-md;
        
        &:active {
          background: $c-border;
        }
      }
    }
  }
</style>