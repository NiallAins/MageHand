<template>
  <div id="page_prof" :class="{ 'readonly': !editing }">
    <div class="row">
      <input
        class="name"
        type="text"
        v-model="userData.name"
        :style="{ 'font-size': userData.name.length < 15 ? '26px' : (userData.name.length < 24 ? '20px' : '16px' ) }"
      >
      <div class="level">
        <h3>Lvl</h3>
        <input type="number" v-model="userData.level">
      </div>
    </div>
    <div class="row type">
      <dropdown
        v-model="userData.race"
        :options="[
          'Dragonborn',
          'Dwarf',
          'Hill Dwarf',
          'Elf',
          'High Elf',
          'Half-Elf',
          'Gnome',
          'Rock Gnome',
          'Half-Orc',
          'Halfling',
          'Lightfoot Halfling', 
          'Human',
          'Tiefling'
        ]"
        placeholder="Race..."
      ></dropdown>
      <dropdown
        v-if="editing || userData.subclass"
        v-model="userData.subclass"
        :options="[
          'Berserker',
          'Champion',
          'Devotion',
          'Draconic',
          'Evocation',
          'Fiend',
          'Hunter',
          'Land',
          'Life',
          'Lore',
          'Open Hand',
          'Thief'
        ]"
        placeholder="Subclass..."
      ></dropdown>
      <dropdown
        v-model="userData.class"
        :options="[
          'Barbarian',
          'Bard',
          'Cleric',
          'Druid',
          'Fighter',
          'Monk',
          'Paladin',
          'Ranger',
          'Rogue',
          'Sorcerer',
          'Warlock',
          'Wizard'
        ]"
        placeholder="Class..."
      ></dropdown>
      <dropdown
        v-model="userData.align"
        :options="[
          'Lawful Good',
          'Neutral Good',
          'Chaotic Good',
          'Lawful Neutral',
          'True Neutral',
          'Chaotic Neutral',
          'Lawful Evil',
          'Neutral Evil',
          'Chaotic Evil'
        ]"
        :noCustom="true"
        placeholder="Alignment..."
      ></dropdown>
      <dropdown
        v-if="editing || userData.bg"
        v-model="userData.bg"
        :options="[
          'Acolyte',
          'Charlatan',
          'Criminal',
          'Spy',
          'Entertainer',
          'Gladiator',
          'Folk Hero',
          'Guild Artisan',
          'Guild Merchant',
          'Hermit',
          'Noble',
          'Knight',
          'Outlander',
          'Sage',
          'Arcana ',
          'Sailor',
          'Pirate',
          'Soldier',
          'Urchin'
        ]"
        placeholder="Background..."
      ></dropdown>
    </div>
    <textbox
      v-model="userData.traits"
      placeholder="Traits, skills & languages..."
      :readonly="!editing"
    ></textbox>
    <textbox
      v-model="userData.desc"
      placeholder="Character description..."
      :readonly="!editing"
    ></textbox>
    <button
      :class="['toggle-edit', { 'editing': editing }]"
      @click="toggleEdit()"
    >
      <i class="icon-edit"></i>
    </button>
  </div>
</template>

<script>
  import UserData from '../userData';
  import textbox from '../components/textbox';
  import dropdown from '../components/dropdown';

  export default {
    name: 'Prof',
    components: {
      textbox,
      dropdown
    },
    data: function() {
      return {
        userData: {},
        editing: false
      }
    },
    created: function() {
      this.userData = UserData.data;
    },
    methods: {
      toggleEdit: function() {
        this.editing = !this.editing;
        if (!this.editing) {
          UserData.set({
            'name': this.userData.name,
            'level': this.userData.level,
            'race': this.userData.race,
            'class': this.userData.class,
            'subclass': this.userData.subclass,
            'bg': this.userData.bg,
            'align': this.userData.align,
            'traits': this.userData.traits,
            'desc': this.userData.desc
          });
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '../vars.scss';

  #page_prof {
    $c-prim: $c-prof;

    .row>div,
    .row>input {
      float: left;
    }

    &.readonly input,
    &.readonly .level input {
      border: none;
      pointer-events: none;
    }
    
    .name {
      margin-top: 10px;
      width: calc(100% - 90px);
      padding: 5px;
      font-size: 28px;
      font-family: $f-head;
    }
    
    .level {
      position: relative;
      z-index: 1;
      width: 60px;
      height: 60px;
      padding: 8px 4px 0;
      margin-left: 8px;
      text-align: center;
      
      h3 {
        font-size: 18px;
        line-height: 20px;
        color: $c-bg;
      }
      
      input {
        width: 50px;
        padding: 17px 0 0;
        border: 1px solid $c-border;
        margin: -25px 0 0 0;
        text-align: center;
        font-family: $f-head;
        font-size: 30px;
        background: none;
      }
      
      &:before {
        content: '';
        position: absolute;
        left: 5px;
        right: 5px;
        top: 5px;
        bottom: 5px;
        z-index: -1;
        border-radius: 5px;
        background: $c-prim;
        transform: rotate(45deg);
      }
    }
    
    .type {
      margin: 0 -5px;

      div {
        width: calc(50% - 10px);
        margin: 5px;
      }
    }
    
    .textbox {
      float: left;
      clear: both;
      margin-top: 14px;
      min-height: 4em;
    }

    .toggle-edit {
      position: fixed;
      bottom: 10px;
      right: 15px;
      height: 60px;
      width: 60px;
      padding: 0;
      border-radius: 50%;
      background-color: $c-bg;
      border: 1px solid $c-border;

      &.editing {
        background: $c-prim;
        border-color: $c-prim;
      }
    }

    input {
      text-overflow: ellipsis;
    }

    .dropdown input {  
      text-transform: capitalize;
    }
  }
</style>
