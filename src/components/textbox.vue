<template>
  <div :class="['textbox', { 'focus': focus }]">
    <div v-if="placeholder && !value && !focus" class="placeholder">
      {{ placeholder }}
    </div>
    <div
      class="input"
      :contenteditable="!readonly"
      v-html="value"
      @focus="focus = true"
      @blur="$emit('input', $event.target.innerHTML); focus = false"
    ></div>
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

  
</style>