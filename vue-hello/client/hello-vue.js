var vm = {
  data: {
    message: 'greeting at '+new Date().toISOString(),
    itemList: [
      { id: 101, itemCode: 'P010XD', itemName: 'Banana' },
      { id: 102, itemCode: 'P013GT Plus', itemName: 'Mango' },
      { id: 103, itemCode: 'P056XQ', itemName: 'Apple' },
    ],
    draftItem: {
      itemCode: '',
      itemName: '',
    },
    nextId: 104,
  },
  methods: {
    reverseItemList: function(){
      this.message = 'time is now '+new Date().toISOString();
      this.itemList = this.itemList.reverse();
    },
    onCreateProductPressed: function(item){
      console.log('to be created:', item);
      var copy = {
        id: this.nextId++,
      };
      Object.assign(copy, item);
      this.itemList.push(copy);
      this.draftItem.itemCode = '';
      this.draftItem.itemName = '';
    },
  },
  watch: {
    message: function(newVal){
      console.log('message changed to ', newVal);
    },
    "draftItem.itemCode": function(code){
      console.log('itemCode changed to ', code);
    }
  }
};

function init(){
  new Vue({
    el: '#my-app',
    data: vm.data,
    methods: vm.methods,
    watch: vm.watch,
  });
}
