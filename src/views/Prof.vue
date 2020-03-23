<template>
  <div id="page_prof" :class="{ 'readonly': !editing }">
    <div class="row">
      <input
        class="name"
        placeholder="Character Name..."
        type="text"
        v-model="userData.name"
        :style="{ 'font-size': userData.name.length < 15 ? '26px' : (userData.name.length < 24 ? '20px' : '16px') }"
      >
      <div class="level">
        <touchButton v-if="editing" @press="editing && userData.level > 1 ? userData.level-- : ''"> - </touchButton>
        <touchButton v-if="editing" @press="editing ? userData.level++ : ''"> + </touchButton>
        <h3>Lvl</h3>
        <h2> {{ userData.level }} </h2>
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
    <div class="text-border"><br/></div>
    <textbox
      v-if="userData.desc || editing"
      v-model="userData.desc"
      placeholder="Character description..."
      :readonly="!editing"
    ></textbox>
    <div class="text-border"></div>
    <textbox
      v-if="userData.traits || editing"
      v-model="userData.traits"
      placeholder="Traits, skills & languages..."
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
  import touchButton from '../components/touchButton';

  export default {
    name: 'Prof',
    components: {
      textbox,
      dropdown,
      touchButton
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

    &.readonly {
      input,
      .level input {
        border: none;
        pointer-events: none;
      }

      .textbox {
        border: none;
      }

      .text-border {
        float: left;
        width: 100%;
        border-bottom: 1px solid $c-bg-nav;
      }
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
        line-height: 26px;
      } 

      .touch-button {
        position: absolute;
        top: 25px;
        border: 1px solid $c-font;
        border-radius: 100%;
        width: 30px;
        line-height: 28px;
        font-size: 20px;
        font-family: $f-prim;
        background: $c-prim;

        &:nth-child(1) {
          left: -9px;
        }
        &:nth-child(2) {
          right: -9px;
        }
      }
      
      h2 {
        font-family: $f-head;
        font-size: 20px;
        line-height: 1.2;
      }
      
      &:before {
        content: '';
        position: absolute;
        left: 5px;
        right: 5px;
        top: 5px;
        bottom: 5px;
        z-index: -1;
        border-radius: $br-el;
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
      margin: 7px 0;
      min-height: 4em;
    }

    input {
      text-overflow: ellipsis;

      &:focus {
        outline: 2px solid $c-prim;
      }
    }

    .dropdown input {  
      text-transform: capitalize;

      &:focus {
        outline: 2px solid $c-prim;
      }
    }

    .toggle-edit.editing {
      background: $c-prim;
      border-color: $c-prim;
    }
  }
</style>
