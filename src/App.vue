<template>
  <div>
    <div class="install-prompt">
      <h1> Mage Hand </h1>
      <img src="./assets/icon-image.png" />
      Character sheet and stats tracker for D&D 5th Edition
      <br/><br/>
      Mage Hand is designed to run as a native app on mobile, click below to download
      <br/>
      <button @click="showPrompt()"> Install Mage Hand </button>
    </div>
    <main>
      <Prof v-if="currentView === 'prof'"></Prof>
      <Stat v-if="currentView === 'stat'"></Stat>
      <Sear v-if="currentView === 'sear'"></Sear>
      <Comb v-if="currentView === 'comb'"></Comb>
      <Note v-if="currentView === 'note'"></Note>

      <section class="modal-help" v-if="showHelp">
        <div class="modal-bg" @click="showHelp = false"></div>
        <div class="modal-container">
          <button>
            <i class="icon-close" @click="showHelp = false"></i>
          </button>
          <header>
            <h1> Mage Hand </h1>
            <p>
              Character sheet and stats tracker for D&D 5th Edition
            </p>
          </header>
          <table>
            <tr @click="showHelp = false; currentView = 'prof'">
              <td><i class="icon-prof"></i></td>
              <td>
                <h3> Profile </h3>
                <p> Add charcter details and description </p>
              </td>
            </tr>
            <tr @click="showHelp = false; currentView = 'sear'">
              <td><i class="icon-sear"></i></td>
              <td>
                <h3> Search </h3>
                <p> Add, prepare and equip items and spells </p>
              </td>
            </tr>
            <tr @click="showHelp = false; currentView = 'comb'">
              <td><i class="icon-comb"></i></td>
              <td>
                <h3> Combat </h3>
                <p> Track stats, spells and health for combat </p>
              </td>
            </tr>
            <tr @click="showHelp = false; currentView = 'stat'">
              <td><i class="icon-stat"></i></td>
              <td>
                <h3> Stats </h3>
                <p> Track character stats, skills and proficiencies </p>
              </td>
            </tr>
            <tr @click="showHelp = false; currentView = 'note'">
              <td><i class="icon-note"></i></td>
              <td> <h3>Notes</h3> </td>
            </tr>
          </table>
          <p><a href="https://github.com/NiallAins/MageHand"> View project details... </a></p>
        </div>
      </section>

      <nav :class="{ 'open': navOpen }">
        <div
          v-for="(label, name) in navItems"
          :class="['nav-item', name]"
          @mouseup="currentView = name; navOpen = false"
          @touchend="currentView = name; navOpen = false; $event.preventDefault();"
        >
          <i :class="'icon-' + name"></i>
        </div>
        <div
          class="menu-caret"
          @mousedown="navOpen = !navOpen"
          @touchstart="navOpen = !navOpen; $event.preventDefault();"
        >
          <i class="icon-menu-caret"></i>
        </div>
        <div
          class="help-icon"
          @click="showHelp = true; navOpen = false;"
        > ? </div>
      </nav>
      <div
        :class="{
          'nav-bg': true,
          'open': navOpen,
        }"
        @click="navOpen = false"
      ></div>
    </main>
  </div>
</template>

<script>
  import Vue from 'vue';
  import UserData from './userData';
  import Prof from './views/Prof';
  import Stat from './views/Stat';
  import Sear from './views/Sear';
  import Comb from './views/Comb';
  import Note from './views/Note';

  export default {
    name: 'app',
    components: {
      Prof, Stat, Sear, Comb, Note
    },
    data: function() {
      return {
        currentView: 'prof',
        showHelp: true,
        navOpen: false,
        navItems: {
          'prof': 'Profile',
          'sear': 'Search',
          'stat': 'Stats',
          'comb': 'Combat',
          'note': 'Notes'  
        }
      }
    },
    created: function() {
      UserData.loadData();
    },
    methods: {
      showPrompt: function() {
        if (Vue.deferredPrompt) {
          Vue.deferredPrompt.prompt();
        } else {
          console.error('No browser install prompt available');
        }
      }
    }
  };
</script>

<style lang="scss">
  @import 'global.scss';
  
  $w-nav-item: 64px;

  @media (max-width: $w-max) and (display-mode: browser) {
    main {
      display: none;
    }
  }

  @media (min-width: $w-max), (display-mode: standalone), (display-mode: fullscreen) {
    .install-prompt {
      display: none;
    }
  }

  .install-prompt {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-125px, -55%);
    width: 250px;
    text-align: center;

    img {
      display: block;
      margin: 0 auto 10px;
    }

    button {
      border: 1px solid $c-border;
      border-radius: $br-el;
      padding: 10px 20px;
      margin-top: 30px;
      font-size: 20px;
    }
  }

  .modal-help {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: $z-modal;
    padding: $w-pad;

    .modal-bg {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: $c-mod-bg;
    }
    
    .modal-container {
      position: relative;
      width: calc(100% - 30px);
      max-width: #{$w-max - 30px - (2 * ($w-pad + 1))};
      height: calc(100vh - #{30px + (2 * ($w-pad + 1))});
      padding: 15px;
      border: 1px solid $c-border;
      border-radius: $br-mod 0;
      margin: 0 auto;
      background: $c-bg;
    }
    
    button {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 50px;
      height: 50px;
      padding: 0;
      border: none;
      text-align: left;
    }

    header {
      padding: 20px 0 10px;

      h1, p {
        text-align: center;
        line-height: 1.2;
        padding-bottom: 5px;
      }
    }

    a {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      text-align: center;
      width: 100%;
      text-decoration: none;
      color: $c-font;
      font-size: 14px;
    }

    tr {
      cursor: pointer;
    }

    tr:nth-child(1) i {
      background-color: $c-prof;
    }
    tr:nth-child(2) i {
      background-color: $c-sear;
    }
    tr:nth-child(3) i {
      background-color: $c-comb;
    }
    tr:nth-child(4) i {
      background-color: $c-stat;

      &:after {
        color: $c-stat; 
      }
    }
    tr:nth-child(5) i {
      background-color: $c-note;
    }

    td {
      padding: 10px;
    }

    h3 {
      font-size: 20px;
      line-height: 1.5;
    }

    p {
      margin: 0;
      line-height: 1.3;
    }
  }

  @keyframes pause-pointer-events {
    0% { pointer-events: none; }
    99% { pointer-events: none; }
    100% { pointer-events: all; }
  }

  nav {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: $z-nav;
    background: #444;
    width: $w-nav-item;
    height: $w-nav-item;
    border-radius: 0 100% 0 0;
    line-height: $w-nav-item;
    text-align: center;
    transition:
      width $l-ani-mod,
      height $l-ani-mod,
      border-radius $l-ani-mod,
      bottom $l-ani-mod;

    .menu-caret {
      position: absolute;
      bottom: -7px;
      left: -2px;
      cursor: pointer;
      transition:
        transform $l-ani-mod,
        bottom $l-ani-mod,
        left $l-ani-mod;
    }

    .help-icon {
      position: absolute;
      width: 64px;
      height: 64px;
      border-radius: 100%;
      font-size: 28px;
      text-align: center;
      line-height: 64px;
      font-family: $f-head;
      color: #9f9f9f;
      opacity: 0;
      background: #303030;
      pointer-events: none;
      user-select: none;
    }

    .nav-item {
      position: absolute;
      width: $w-nav-item;
      height: $w-nav-item;
      border-radius: 100%;
      opacity: 0;
      pointer-events: none;
      overflow: hidden;
      cursor: pointer;

      &:nth-child(1) {
        top: 15%;
        right: 73%;
      }
      &:nth-child(2) {
        top: 37%;
        right: 40%;
      }
      &:nth-child(3) {
        top: 70%;
        right: 15%;

        i:after {
          color: $c-stat;
        }
      }
      &:nth-child(4) {
        top: 43%;
        right: 73%;
      }
      &:nth-child(5) {
        top: 70%;
        right: 44%;
      }
      &.prof { background: $c-prof; }
      &.stat { background: $c-stat; }
      &.sear { background: $c-sear; }
      &.comb { background: $c-comb; }
      &.note { background: $c-note; }
    }

    &.open {
      width: 300px;
      height: 300px;

      .menu-caret {
        bottom: 16px;
        left: 20px;
        transform: rotate(180deg);
      }

      .nav-item {
        opacity: 1;
        pointer-events: all;
        transition: opacity #{$l-ani-mod - 0.05} ease 0.05s;
        animation: pause-pointer-events $l-ani-mod 1;
      }

      .help-icon {
        opacity: 1;
        pointer-events: all;
        transition:
          top $l-ani-mod,
          opacity $l-ani-mod;
        animation: pause-pointer-events $l-ani-mod 1;
      }
    }

    @media (min-width: 400px) {
      .help-icon {
        bottom: 24px;
        right: 0;
      }

      &.open .help-icon {
        right: -82px
      }
    }

    @media (max-width: 399px) {
      .help-icon {
        top: 0;
        left: 18px;
      }

      &.open .help-icon {
        top: -75px;
        right: -9px
      }
    }

    @media (min-width: $w-max) {
      left: calc(50vw - #{$w-max / 2});
      bottom: 10px;
      border-radius: 32px;

      .menu-caret {
        bottom: -2px;
        left: 5px;
      }

      &.open {
        bottom: 0;
        border-radius: 32px 100% 0 0;
      }
    }
  }

  .nav-bg {
    position: fixed;
    left: 0;
    right: 0;
    top: 100vh;
    bottom: 0;
    z-index: $z-nav - 1;
    background: $c-mod-bg;
    opacity: 0;
    transition: opacity $l-ani-mod;

    &.open {
      top: 0;
      opacity: 1;
    }
  }
</style>
