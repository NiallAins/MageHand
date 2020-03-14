<template>
  <div class="dropdown">
    <div
      :class="{ 'dropdown-bg': true, 'open': open }"
      @click="open = false"
    ></div> 
    <label v-if="label" :bind="label"></label>
    <input
      ref="inpEl"
      type="text"
      v-model="value"
      :readonly="!custom || noCustom"
      :placeholder="placeholder"
      :class="{ 'focused': open }"
      @click="open = true"
      @input="$emit('input', value)"
    >
    <ul :class="{ 'options': true, 'open': open }">
      <li @click="
        custom = true;
        value = '';
        $refs.inpEl.focus();
        open = false;
      ">
        Custom...
      </li>
      <li
        v-for="o in options"
        @click="
          value = o;
          custom = false;
          open = false;
          $emit('input', value);
        "
      >
        {{ o }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'dropdown',
    props: [
      'value',
      'options',
      'label',
      'noCustom',
      'placeholder'
    ],
    data: function() {
      return {
        open: false,
        custom: false
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '../vars.scss';

  .dropdown {
    position: relative;
    
    .dropdown-bg {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      z-index: 9;
      
      &.open {
        bottom: 0;
      }
    }
      
    input {
      width: calc(100% - 16px);
      text-overflow: ellipsis;
    }
    
    .options {
      position: absolute;
      height: 0;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 10;
      padding: 0;
      border: solid $c-border;
      border-width: 0px;
      overflow: hidden;
      background: $c-bg;
      text-transform: capitalize;
    
      &.open {
        height: auto;
        border-width: 0px 1px 1px 1px;
      }
      
      li {
        padding: 0 $w-pad;
        font-size: $f-size-bg;
        line-height: $f-height-bg;
        
        &:hover {
          background-color: $c-bg-light;
        }
        
        &:first-child {
          font-style: italic;
        }
      }
    }
  }
</style>