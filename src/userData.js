const defaultUserData = '{"new":true,"name":"","stats":[10,10,10,10,10,10],"savingThrow":[],"spellSlots":[[2,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"profSkills":[],"prof":2,"speed":30,"hp":10,"maxHp":10,"level":1,"race":"","class":"","subclass":"","align":"","desc":"","traits":"","equipment":[],"spells":[],"features":[],"notes":[]}';

export default {
  data: {},
  permissionCheck: false,

  set: function(name, value) {
    if (typeof name === 'object') {
      for (let key in name) {
        this.data[key] = name[key];
      }
    } else {
      this.data[name] = value;
    }
    this.saveData();
  },

  setItem: function(type, item, remove = false) {
    if (remove) {
      let itemIndex = this.data[type].findIndex(i => i.index === item);
      if (itemIndex !== -1) {
        this.data[type].splice(itemIndex, 1);
      }
    } else {
      this.data[type].push(item);
      this.data[type].sort((a, b) => a.index - b.index);
      if (type === 'spells') {
        this.data[type].sort((a, b) => a.level - b.level);
      }
    }
    this.saveData();
  },

  toggleItemParam: function(type, itemIndex, param) {
    let item = this.data[type].find(i => i.index === itemIndex);
    item[param] = !item[param];
    this.saveData();
  },

  loadData: function() {
    let data = localStorage.getItem('userData');
    if (data) {
      this.data = JSON.parse(data);
    } else {
      this.data = JSON.parse(defaultUserData);
      this.saveData();
      console.log('No saved data, default data set');
    }
  },

  saveData: async function() {
    if (!this.permissionCheck) {
      let hasPerm = await navigator.storage.persisted();
      console.log('Persistant Storage ' + (hasPerm ? 'already granted' : 'not yet granted'));
      
      if (!hasPerm) {
        let setPerm = await navigator.storage.persist();
        console.log('Persistant Storage ' + (setPerm ? 'now granted' : 'refused'));
      }
      
      this.permissionCheck = true;
    }

    let data = JSON.stringify(this.data)
    localStorage.setItem('userData', data);
  }
}