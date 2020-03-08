const defaultUserData = '{"name":"Kevin Philips II","stats":[12,10,5,4,7,14],"savingThrow":[1,5],"profSkills":["animal handling","history","religion"],"prof":2,"speed":30,"hp":18,"maxHp":24,"level":3,"race":"half-orc","class":"cleric","align":"neutral good","info":"life domain","equipment":[{"index":"silvered sword","attack":"1d8 slashing","prof":true,"equip":true},{"index":"breast plate","ac":12,"prof":false,"equip":true}],"spells":[{"index":"Sacred Flame","level":"Cantrip","prep":true}],"features":[{"index":"Channel Divinty"}],"notes":[]}';

export default {
  data: {},
  permissionCheck: false,

  set: function(name, value) {
    this.data[name] = value;
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