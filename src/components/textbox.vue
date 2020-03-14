<template>
  <div :class="['textbox', { 'focus': focus }]">
    <div v-if="placeholder && !value && !focus" class="placeholder">
      {{ placeholder }}
    </div>
    <div
      class="input"
      :contenteditable="!readonly"
      @focus="focus = true"
      @blur="$emit('input', $event.target.innerText); focus = false"
    >
      {{ value }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'textbox',
    props: [
      'placeholder',
      'value',
      'readonly'
    ],
    data: function() {
      return {
        focus: false
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