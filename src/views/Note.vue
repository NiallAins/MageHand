<template>
  <div id="page_notes">
    <div :class="{ 'page-container' : true, 'openNote': currentNote !== -1 }">
      <div class="note-container new-note">
        <button @click="addNote()"> + New Note </button>
      </div>
      <div
        v-for="(note, i) in notes"
        :class="{
          'note-container': true,
          'open': currentNote === i
        }"
      >
        <div class="note-header">
          <i
            class="icon-caret"
            @click="currentNote = (currentNote === i ? -1 : i)"
          > ^ </i>
          <input
            type="text"
            v-model="note.title"
            @click="currentNote = i"
            placeholder="Note Title..."
          >
          <i
            class="icon-close"
            @click="modalOpen = true; noteToDelete = i;"
          ></i>
        </div>
        <textarea
          class="note-content"
          v-model="note.content"
          placeholder="Note content...."
        ></textarea>
      </div>
      <div :class="{ 'modal-delete': true, 'open': modalOpen }">
        <div class="modal-content">
          <h3> Delete Note? </h3>
          <button @click="modalOpen = false"> Cancel </button>
          <button @click="deleteNote()"> Delete </button>
        </div>
        <div class="modal-bg" @click="modalOpen = false"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserData from '../userData';

  export default {
    name: 'Note',
    data: function() {
      return {
        currentNote: -1,
        modalOpen: false,
        notes: [] 
      }
    },
    created: function() {
      this.notes = UserData.data.notes;
    },
    methods: {
      addNote: function() {
        this.notes.push({
          title: '',
          content: ''
        });
      },
      deleteNote: function() {
        this.notes.splice(this.noteToDelete, 1);
        this.modalOpen = false;
        this.currentNote = -1;
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '../vars.scss';

  $c-prim: $c-note;

  textarea {
    background: none;
    width: 100%;
    box-sizing: border-box;
    display: block;
    color: $c-font;
    border: 1px solid $c-border;
    resize: none;
    font-size: $f-size-md;
    font-family: $f-prim;
    
    &:focus {
      outline: 1px solid $c-prim;
      outline-offset: -3px;
    }
  }

  .page-container.openNote .note-container:not(.open) {
    height: 0;
  }

  .note-container.new-note {
    button {
      border: 1px solid $c-border;
      border-radius: 5px;
      line-height: 40px;
      padding: 0 20px;
    }
  }

  .note-container {
    height: 67px;
    transition: height 0.3s;
    overflow: hidden;
    
    &.open {
      height: calc(100vh - 20px);
    }
    
    .note-header {
      position: relative;
      padding-left: 60px;
      background: #333;

      input {
        line-height: 64px;
        background: none;
        border: none;
        width: calc(100% - 80px);
        text-overflow: ellipsis;
      }

      i {
        position: absolute;
        top: 9px;
        
        &.icon-caret {
          left: 4px;
        }
        
        &.icon-close {
          right: 4px;
        }
      }
    }
    
    .note-content {
      height: 0;
      overflow: hidden;
      padding: 16px;
      border: 1px solid $c-border;
      border-width: 0px;
      border-radius: 0 0 5px 5px;
      transition:
        height 0.3s,
        border-width 0s linear 0.3s;
    }
    
    &.open .note-content {
      height: calc(100vh - 100px);
      border: 1px solid $c-border;
      border-top-width: 0;
      transition: height 0.3s;
    }
  }

  .modal-delete {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -10;
    opacity: 0;
    transition:
      opacity 0.4s,
      z-index 0s linear 0.4s;
    
    &.open {
      z-index: 10;
      opacity: 1;
      transition: opacity 0.4s;
    }
    
    .modal-content {
      position: absolute;
      left: calc(50% - 146px);
      top: 150px;
      z-index: 20;
      width: 290px;
      padding: 20px 0px;
      border: 1px solid $c-border;
      border-radius: 8px 0;
      text-align: center;
      background: $c-bg;
      
      h3 {
        padding-bottom: 10px;
      }
      
      button {
        border: 1px solid $c-border;
        padding: 10px 30px;
        margin: 10px;
      }
    }
    
    .modal-bg {
      position: absolute;
      z-index: 10;
      width: 100%;
      height: 100%;
      background: #0008;
    }
  }
</style>
