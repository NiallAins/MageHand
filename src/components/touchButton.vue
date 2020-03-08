<template>
  <button
    class="touch-button"
    @mousedown="startPress()"
    @touchstart="startPress(); $event.preventDefault()"
    @mouseup="stopPress()"
    @mouseleave="stopPress()"
    @touchend="stopPress()"
  >
    <span style="pointer-events: none;">
      <slot></slot>
    </span>
  </button>
</template>

<script>
  export default {
    name: 'touchButton',
    data: function() {
      return {
        pressTimeout: 0
      }
    },
    methods: {
      startPress: function() {
        this.$emit('pressdown');
        this.pressing(true);
      },
      pressing: function(firstPress) {
        this.$emit('press');
        let cb = this.pressing.bind(this, false);
        this.pressTimeout = setTimeout(cb, firstPress ? 500 : 250);
      },
      stopPress: function() {
        clearTimeout(this.pressTimeout);
        this.$emit('pressup');
      },
    }
  }
</script>