<template>
  <div id="page_notes">
    <div :class="[ 'page-container', { 'openNote': currentNote !== -1 }]">
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
            class="icon-expand"
            @click="toggleNote(i)"
          ></i>
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
      <div :class="['modal-delete', { 'open': modalOpen }]">
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
      },
      toggleNote: function(noteNum) {
        this.currentNote = (this.currentNote === noteNum ? -1 : noteNum);
        if (this.currentNote === -1) {
          UserData.set('notes', this.notes);
        }
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
  }

  input:focus,
  textarea:focus {
    outline: 2px solid $c-prim;
    outline-offset: -3px;
  }

  .page-container{
    padding-bottom: 50px;
    
    &.openNote .note-container:not(.open) {
      height: 0;
    }
  }

  .note-container.new-note {
    button {
      padding: 0 20px;
      border: 1px solid $c-border;
      border-radius: $br-el;
      margin-top: 5px;
      line-height: 38px;

      &:active {
        border: 2px solid $c-prim;
        padding: 0 19px;
        line-height: 36px;
      }
    }
  }

  .note-container {
    height: 67px;
    transition: height $l-ani-mod;
    overflow: hidden;
    
    &.open {
      height: calc(100vh - 100px);

      i.icon-expand {
        transform:
          scale(0.75)
          rotate(180deg);
      }
    }
    
    .note-header {
      position: relative;
      padding-left: 60px;
      background: $c-bg-light;

      input {
        line-height: 64px;
        background: none;
        border: none;
        width: calc(100% - 80px);
        text-overflow: ellipsis;
      }

      i {
        position: absolute;
        cursor: pointer;
        
        &.icon-expand {
          top: 7px;
          left: 4px;
          transition: transform $l-ani-mod;
        }
        
        &.icon-close {
          top: 9px;
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
      border-radius: 0 0 $br-el $br-el;
      transition:
        height $l-ani-mod,
        border-width 0s linear $l-ani-mod;
    }
    
    &.open .note-content {
      height: calc(100vh - 164px);
      border: 1px solid $c-border;
      border-top-width: 0;
      transition: height $l-ani-mod;
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
      opacity $l-ani-mod,
      z-index 0s linear $l-ani-mod;
    
    &.open {
      z-index: 10;
      opacity: 1;
      transition: opacity $l-ani-mod;
    }
    
    .modal-content {
      position: absolute;
      left: calc(50% - 146px);
      top: 150px;
      z-index: 20;
      width: 290px;
      padding: 20px 0px;
      border: 1px solid $c-border;
      border-radius: $br-mod 0;
      text-align: center;
      background: $c-bg;
      
      h3 {
        padding-bottom: 10px;
      }
      
      button {
        padding: 10px 30px;
        border: 1px solid $c-border;
        border-radius: $br-el;
        margin: 10px;

        &:active {
          border: 2px solid $c-prim;
          padding: 9px 29px;
        }
      }
    }
    
    .modal-bg {
      position: absolute;
      z-index: 10;
      width: 100%;
      height: 100%;
      background: $c-mod-bg;
    }
  }
</style>
