<template>
  <div>
    <Prof v-if="currentView === 'prof'"></Prof>
    <Stat v-if="currentView === 'stat'"></Stat>
    <Sear v-if="currentView === 'sear'"></Sear>
    <Comb v-if="currentView === 'comb'"></Comb>
    <Note v-if="currentView === 'note'"></Note>

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
    </nav>
    <div
      :class="{
        'nav-bg': true,
        'open': navOpen,
      }"
      @click="navOpen = false"
    ></div>
  </div>
</template>

<script>
  import Prof from './views/Prof';
  import Stat from './views/Stat';
  import Sear from './views/Sear';
  import Comb from './views/Comb';
  import Note from './views/Note';
  import UserData from './userData';

  export default {
    name: 'app',
    components: {
      Prof, Stat, Sear, Comb, Note
    },
    data: function() {
      return {
        currentView: 'prof',
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
      getIcon: function(icon) {
        return require.context('./assets/', false, /\.png$/)('./icon_' + icon + '.png');
      }
    }
  };
</script>

<style lang="scss">
  @import 'global.scss';
  
  $w-nav-item: 64px;
  $l-ani: 0.3s;

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
    background: #333;
    width: $w-nav-item;
    height: $w-nav-item;
    border-radius: 0 100% 0 0;
    line-height: $w-nav-item;
    text-align: center;
    transition: all $l-ani;

    .menu-caret {
      position: absolute;
      bottom: -7px;
      left: -2px;
      transition:
        transform $l-ani,
        bottom $l-ani,
        left $l-ani;
    }

    .nav-item {
      position: absolute;
      width: $w-nav-item;
      height: $w-nav-item;
      border-radius: 100%;
      opacity: 0;
      pointer-events: none;
      overflow: hidden;

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
        transition: opacity $l-ani;
        animation: pause-pointer-events $l-ani 1;
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
    background: #0008;
    opacity: 0;
    transition: opacity $l-ani;

    &.open {
      top: 0;
      opacity: 1;
    }
  }
</style>
