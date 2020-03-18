<template>
  <div class="dropdown">
    <div
      :class="['dropdown-bg', { 'open': open }]"
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
      <li
        v-if="!noCustom"
        class="option-custom"
        @click="
          custom = true;
          value = '';
          $refs.inpEl.focus();
          open = false;
        "
      >
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
      top: 0;
      z-index: 9;
      width: 100%;
      
      #page_prof .type & {
        width: 100%;
        margin: 0;
      }
      
      &.open {
        bottom: 0;
      }
    }
      
    input {
      width: calc(100% - 18px);
      text-overflow: ellipsis;
    }
    
    .options {
      position: absolute;
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
      max-height: 320px;
      overflow: auto;
      
      li {
        height: 0;
        padding: 0 $w-pad;
        overflow: hidden;
        font-size: $f-size-bg;
        line-height: $f-height-bg;
        transition: height 0.2s;
        
        &:hover {
          background-color: $c-bg-light;
        }
        
        &.option-custom {
          font-style: italic;
        }
      }

      &.open {
        border-width: 0px 1px 1px 1px;

        li {
          height: 34px;
        }
      }
    }
  }
</style>