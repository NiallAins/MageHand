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
      <span
        class="close"
        @click="$emit('close'); fadeIn = false"
      >
        ×
      </span>

      <div v-if="info">
        <h3> {{ info.name }} </h3>

        <ul v-if="type === 'spells'">
          <li>
            {{ info.level === 0 ? 'Cantrip of' : 'Level ' + info.level }}
            {{ info.school.name }}
          </li>
          <li> Uses {{ info.components.map(c => spellComponents[c]).join(', ') }} </li>
          <li v-if="info.range === 'Self'"> Affects self </li>
          <li v-else> Range of <span class="l-case">{{ info.range }}</span> </li>
          <li>
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
            <span v-if="info.equipment_category === 'Armor'">
              Armor
            </span>
            <span v-if="info.equipment_category === 'Weapon'">
              {{ info.weapon_range }} Weapon
            </span>
          </li>

          <div v-if="info.equipment_category === 'Weapon'">
            <li>
              {{ info.damage.damage_dice }} {{ info.damage.damage_type.name }}
            </li>
            <li>
              Range of
              {{ info.range.normal }}
              ft{{ info.range.long ? ', ' + info.range.long + ' ft long' : '' }}
            </li>
            <li v-if="info.throw_range">
              Throws
              {{ info.throw_range.normal }}
              ft{{ info.throw_range.long ? ', ' + info.throw_range.long + ' ft long' : '' }}
            </li>
            <li v-if="info.properties.length > 0">
              {{ info.properties.map(i => i.name).join(', ') }}
            </li>
          </div>

          <div v-if="info.equipment_category === 'Armor'">
            <li>
              AC {{ info.armor_class.base }}{{ info.armor_class.dex_bonus ? ' + Dex' : '' }}
              <span v-if="info.armor_class.max_bonus">
                (max bonus {{ info.armor_class.max_bonus }})
              </span>
            </li>
            <li v-if="info.str_minimum"> Min Str {{ info.str_minimum }} </li>
            <li v-if="info.stelth_disadvantage"> Stelth Disadvantage </li>
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
        </ul>

        <ul v-if="type === 'features'">
          <li> Level {{ info.level }} {{ info.class.name }} </li>
        </ul>

        <p v-for="para in info.desc" v-html="para"></p>
        <p v-for="para in info.higher_level" v-html="para"></p>

        <span
          v-if="addbutton && canAdd"
          class="add"
          @click="addItem(); $emit('close'); fadeIn = false"
        >
          Add
        </span>
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
        'cp': 'copper'
      };
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
      },

      addItem: function() {
        let item = {
          index: this.info.index
        };
        if (this.type === 'equipment') {
          item.equip = false;
          item.prof = false;
          if (this.info.damage) {
            item.attack = this.info.damage.damageType_dice + ' ' + this.info.damage.damage_type.name;
          }
          if (this.info.armor_class) {
            item.ac = this.info.armor_class.base;
          }
        } else if (this.type === 'spells') {
          item.prep = false;
          item.level = this.info.level;
        }
        UserData.setItem(this.type, item);
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '../vars.scss';

  $w-mod-pad: 20px;

  .item-info {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -$z-modal;
    padding: $w-mod-pad;
    background: #0007;
    opacity: 0;
    transition:
      opacity 0.4s,
      z-index 0s ease 0.4s;
    
    &.open {
      opacity: 1;
      z-index: $z-modal;
      transition:
        opacity 0.4s;
    }
    
    .modal {
      overflow: auto;
      height: calc(100vh - #{$w-mod-pad * 2} - 80px);
      min-width: $w-min - 60;
      max-width: $w-max;
      padding: 70px 10px 40px;
      border: 1px solid $c-border;
      border-radius: 15px 0;
      margin: 0 auto;
      background: $c-bg;
      
      h3 {
        position: fixed;
        left: $w-mod-pad + 1;
        right: $w-mod-pad + 1;
        top: $w-mod-pad + 1;
        padding: 15px 45px 6px 9px;
        border-radius: 15px;
        line-height: 28px;
        background: $c-bg;
      }
    }
    
    .loader {
      position: absolute;
      left: calc(50% - 20px);
      top: 100px;
    }
    
    .close {
      position: fixed;
      top: 0px;
      right: 0px;
      z-index: 1;
      font-size: 30px;
      font-weight: bold;
      padding: 50px 40px 5px 5px;
    }
    
    .add {
      position: fixed;
      bottom: $w-mod-pad + 10;
      left: $w-mod-pad + 20;
      right: $w-mod-pad + 20;
      line-height: 35px;
      border: 1px solid $c-border;
      border-radius: 8px;
      text-align: center;
      font-size: 16px;
      background: $c-bg;
      
      &:active {
        background: $c-border;
      }
    }
  }
</style>