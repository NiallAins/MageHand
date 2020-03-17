<template>
  <div id="page_stat" :class="{'editing': editing }">
    <div
      class="stat-box"
      v-for="(stat, i) in stats"
    >
      <div>
        <touchButton v-if="editing" @press="setStat(i, false)"> - </touchButton>
        <touchButton v-if="editing" @press="setStat(i, true)"> + </touchButton>
        <h4> {{ stat }} </h4>
        <h4 :class="{ 'font-lg': editing }"> {{ userData.stats[i] }} </h4>
        <h3 class="mod" v-if="!editing">
          {{ userData.mods[i] | addSign }}
        </h3>
        <span
          :class="['prof', { 'editing': editing, 'on': userData.savingThrow.includes(i) }]"
          @click="toggleProf(i, true)"
        >
          <span v-if="editing" class="st"> Saving <br/> Throw Prof </span>
          <span v-else> {{ userData.prof | addSign }} </span>
        </span>
      </div>
    </div>

    <div class="skill-edit-text">
      Tap skills to toggle proficiency:
    </div>

    <div class="skill-list">
      <div
        v-for="(stat, skill) in skillList"
        :class="{'prof': userData.profSkills.includes(skill) }"
        @click="toggleProf(skill)"
      >
        <div :class="['value', { 'editing': editing }]">
          {{
            stat +
            (userData.profSkills.includes(skill) ? userData.prof : 0) | addSign
          }}
        </div>
        <div :class="{ 'title': true, 'small-text': skill === 'animal handling' || skill === 'slight of hand' }">
          {{ skill }}
        </div>
      </div>
    </div>
    
    <div class="stat-box bottom-box font-sm">
      <div>
        <touchButton v-if="editing" @press="userData.prof--"> - </touchButton>
        <touchButton v-if="editing" @press="userData.prof++"> + </touchButton>
        <h4> Prof Bonus </h4>
        <h3 :class="{ 'font-sm': editing }"> {{ userData.prof }} </h3>
      </div>
    </div>
    <div class="stat-box bottom-box">
      <div>
        <touchButton v-if="editing" @press="userData.speed--"> - </touchButton>
        <touchButton v-if="editing" @press="userData.speed++"> + </touchButton>
        <h4> Speed </h4>
        <h3 :class="{ 'font-sm': editing }"> {{ userData.speed }} </h3>
      </div>
    </div>
    <div class="stat-box bottom-box font-sm">
      <div>
        <touchButton v-if="editing" @press="userData.maxHp--"> - </touchButton>
        <touchButton v-if="editing" @press="userData.maxHp++"> + </touchButton>
        <h4> Max <br/> Health</h4>
        <h3 :class="{ 'font-sm': editing }"> {{ userData.maxHp }} </h3>
      </div>
    </div>
    <button
      :class="['toggle-edit', { 'editing': editing }]"
      @click="toggleEdit()"
    >
      <i class="icon-edit"></i>
    </button>
  </div>
</template>

<script>
  import Vue from 'vue';
  import UserData from '../userData';
  import touchButton from '../components/touchButton';

  export default {
    name: 'Stat',
    components: {
      touchButton
    },
    data: function() {
      return {
        userData: {},
        editing: false,
        skillList: {}
      }
    },
    created: function() {
      this.userData = UserData.data;
      this.stats = [
        'str',
        'dex',
        'con',
        'int',
        'wis',
        'cha'
      ];
      this.deriveValues();
    },
    methods: {
      deriveValues: function() {
        this.userData.mods = this.userData.stats.map(stat => Math.floor((stat - 10) / 2));
        this.skillList = {
          'acrobatics': this.userData.mods[1],
          'animal handling': this.userData.mods[4],
          'arcana': this.userData.mods[3],
          'athletics': this.userData.mods[0],
          'deception': this.userData.mods[5],
          'intimidation': this.userData.mods[5],
          'investigation': this.userData.mods[3],
          'history': this.userData.mods[3],
          'insight': this.userData.mods[4],
          'medicine': this.userData.mods[4],
          'nature': this.userData.mods[3],
          'perception': this.userData.mods[4],
          'performance': this.userData.mods[5],
          'persuasion': this.userData.mods[5],
          'religion': this.userData.mods[3],
          'slight of hand': this.userData.mods[1],
          'stealth': this.userData.mods[1],
          'survival': this.userData.mods[4],
        };
      },
      toggleEdit: function() {
        this.editing = !this.editing;
        if (!this.editing) {
          this.deriveValues();
          UserData.set({
            'skills': this.userData.skills,
            'stats': this.userData.stats,
            'savingThrow': this.userData.savingThrow,
            'profSkills': this.userData.profSkills,
            'speed': this.userData.speed,
            'prof': this.userData.prof,
            'maxHp': this.userData.maxHp
          });
        }
      },
      toggleProf: function(skill, savingThrow = false) {
        if (this.editing) {
          let param = savingThrow ? 'savingThrow' : 'profSkills';
          let i = this.userData[param].indexOf(skill);
          if (i === -1) {
            this.userData[param].push(skill);
          } else {
            this.userData[param].splice(i, 1);
          }
        }
      },
      setStat: function(stat, increase) {
        let value = this.userData.stats[stat] + (increase ? 1 : -1);
        Vue.set(this.userData.stats, stat, value);
      }
    },
    filters: {
      addSign: function(num) {
        return (num < 0 ? num.toString() : '+' + num);
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '../vars.scss';

  $c-prim: $c-stat;
  $c-sec: lighten($c-prim, 20%);
  $l-ani: 0.7s;

  #page_stat {
    @media (max-width: 390px) {
      font-size: 15px;
    }

    &.editing {
      .stat-box {
        padding-bottom: 40px;

        &.bottom-box {
          padding-bottom: 100px;
        }
      }

      .skill-edit-text {
        height: 24px;
        padding: 10px;
      }

      .skill-list div {
        margin-bottom: 6px;
      }
    }
  }

  .stat-box {
    float: left;
    width: 33%;
    height: 80px;
    padding-bottom: 25px;
    text-align: center;
    transition: padding-bottom $l-ani;

    .touch-button {
      position: absolute;
      top: 22px;
      border: 1px solid $c-border;
      border-radius: 100%;
      width: 30px;
      line-height: 30px;
      font-size: 20px;
      background: $c-bg;
      
      &:nth-child(1) {
        left: -15px;
      }
      &:nth-child(2) {
        right: -15px;
      }
    }

    &.bottom-box {
      padding-top: 15px;

      div {
        height: 65px;
        border-bottom-right-radius: 20px; 
        border-bottom-left-radius: 20px;
      }

      &.font-sm h4 {
        font-size: 13px;
        line-height: 14px;
      }

      .font-sm {
        font-size: 18px;
      }

      .touch-button {
        top: 40px;
      }
    }
    
    div {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 60px;
      padding-top: 6px;
      border: 1px solid $c-border;
      border-radius: 4px;
      text-align: center;
      
      h2, h3, h4 {
        line-height: 1.3;

        &.font-lg {
          font-size: 20px;
        }
      }
      
      .mod {
        display: inline-block;
        width: 40px;
        height: 38px;
        padding-right: 4px;
        border: 1px solid $c-border;
        border-radius: 100%;
        margin-top: 2px;
        line-height: 38px;
        background: $c-bg;
      }
      
      .prof {
        opacity: 0;
        position: absolute;
        right: -10px;
        bottom: -24px;
        z-index: 1;
        width: 23px;
        height: 23px;
        border: 1px solid $c-border;
        border-radius: 12px;
        text-align: center;
        color: $c-bg;
        background: $c-bg;
        overflow: hidden;
        transition:
          width $l-ani,
          height $l-ani,
          opacity $l-ani,
          bottom $l-ani;

        &.editing {
          opacity: 1;
          bottom: -30px;
          width: 78px;
          height: 27px;
          padding-top: 2px;
          border-radius: 3px 12px 3px 3px;
          background: $c-bg;
        }

        &.on {
          opacity: 1;
          color: $c-font;
          border-color: $c-prim;
          background: $c-prim;
        }

        .st {
          position : absolute;
          left: 0;
          width: 78px;
          font-size: 13px;
          line-height: 13px;
          color: $c-font;
          white-space: nowrap;
        }
      }
    }
    
    ul {
      float: left;
      width: 50%;
      list-style: dotted;
      text-transform: capitalize;
    }
  }

  .skill-edit-text {
    clear: both;
    padding-left: 10px;
    height: 0;
    overflow: hidden;
    transition:
      height $l-ani,
      padding $l-ani;
  }

  .skill-list {
    margin: 0 auto;
    
    &>div {
      float: left;
      width: 50%;
      transition: margin-bottom $l-ani;

      div {
        float: left;
        line-height: 1.7;

        &.title {
          text-transform: capitalize;
          padding-left: 14px;
          width: calc(100% - 55px);
          
          @media (max-width: 390px) {
            &.small-text {
              padding-top: 4px;
              font-size: 12px;
            }
          }
        }

        &.value {
          width: 20px;
          line-height: 24px;
          padding-right: 8px;
          border: 1px solid $c-bg;
          border-radius: 100% 0 0 100%;
          margin-bottom: 3px;
          text-align: right;

          &.editing {
            border-color: $c-border;
          }
        }
      }

      &.prof {
        .value {
          background-color: $c-prim;
        }
      }
    }
  }

  .toggle-edit.editing {
    background: $c-prim;
    border-color: $c-prim;
  }
</style>
