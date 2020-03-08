<template>
  <div id="page_stat">
    <div
      class="stat-box"
      v-for="(stat, i) in stats"
    >
      <div>
        <span
          class="prof"
          v-if="userData.savingThrow.includes(i)"
        >
          {{ (userData.mods[i] + userData.prof) | addSign }}
        </span>
        <h4> {{ stat }} </h4>
        <h4> {{ userData.stats[i] }} </h4>
        <h3 class="mod">
          {{ userData.mods[i] | addSign }}
        </h3>
      </div>
    </div>
    <div class="skill-list">
      <div
        v-for="(stat, skill, i) in skillList"
        :class="{ 'prof': userData.profSkills.includes(skill) }"
      >
        <div class="value">
          {{
            userData.mods[stat] +
            (userData.profSkills.includes(skill) ? userData.prof : 0) | addSign
          }}
        </div>
        <div :class="{ 'title': true, 'small-text': skill === 'animal handling' }">
          {{ skill }}
        </div>
      </div>
    </div>
    
    <div class="bottom-box">
      <div>
        <h4> Initiative </h4>
        <h3> {{ userData.mods[1] }} </h3>
      </div>
    </div>
    <div class="bottom-box">
      <div>
        <h4>Speed</h4>
        <h3> {{ userData.speed }} </h3>
      </div>
    </div>
  </div>
</template>

<script>
  import UserData from '../userData';

  export default {
    name: 'Stat',
    data: function() {
      return {
        userData: {}
      }
    },
    created: function() {
      this.userData = UserData.data;
      this.userData.mods = this.userData.stats.map(stat => Math.floor((stat - 10) / 2));

      // Const data
      this.stats = [
        'str',
        'dex',
        'con',
        'int',
        'wis',
        'cha'
      ];

      this.skillList = {
        'acrobatics': 1,
        'animal handling': 4,
        'arcana': 3,
        'athletics': 0,
        'deception': 5,
        'intimidation': 5,
        'investigation': 3,
        'history': 3,
        'insight': 4,
        'medicine': 4,
        'nature': 3,
        'perception': 4,
        'performance': 5,
        'persuasion': 5,
        'religion': 3,
        'slight of hand': 1,
        'stelth': 1,
        'survival': 4,
      };
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


  .stat-box {
    float: left;
    width: 33%;
    height: 80px;
    padding-bottom: 25px;
    text-align: center;
    
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
        position: absolute;
        right: -10px;
        bottom: -24px;
        z-index: 1;
        width: 25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        border-radius: 100%;
        background: $c-prim;
      }
    }
    
    ul {
      float: left;
      width: 50%;
      list-style: dotted;
      text-transform: capitalize;
    }
  }

  .skill-list {
    margin: 0 auto;
    
    &>div {
      float: left;
      width: 50%;

      &.prof {
        .value {
          background-color: $c-prim;
          border-radius: 100% 0 0 100%;
        }
      }

      div {
        float: left;
        line-height: 1.7;

        &.title {
          text-transform: capitalize;
          padding-left: 20px;
          width: calc(100% - 55px);
          
          @media (max-width: 390px) {
            &.small-text {
              padding-top: 4px;
              font-size: 13px;
            }
          }
        }

        &.value {
          width: 25px;
          padding-right: 10px;
          text-align: right;
        }
      }
    }
  }

  .bottom-box {
    float: left;
    width: 50%;
    margin-top: 20px;
    text-align: center;
    
    div {
      display: inline-block;
      width: 80px;
      padding: 12px 0;
      border: 1px solid $c-border;
      border-radius: 3px 3px 24px 24px;
      
      h4, h3 {
        line-height: 1.4;
      }
    }
  }
</style>
