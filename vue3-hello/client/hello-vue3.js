const { createApp, ref } = Vue;

function init(){

  createApp({
    data(){
      return {
        message: ref('greeting at '+new Date().toISOString()),
        itemList: ref([
          { id: 101, itemCode: 'P010XD', itemName: 'Banana' },
          { id: 102, itemCode: 'P013GT Plus', itemName: 'Mango' },
          { id: 103, itemCode: 'P056XQ', itemName: 'Apple' },
        ]),
        draftItem: ref({
          itemCode: '',
          itemName: '',
        }),
        nextId: ref(104),
      };
    },
    methods: {
      reverseItemList(){
        this.message = 'time is now '+new Date().toISOString();
        this.itemList = this.itemList.reverse();
      },
      onCreateProductPressed(item){
        console.log('to be created:', item);
        var copy = {
          id: this.nextId++,
        };
        Object.assign(copy, item);
        this.itemList.push(copy);
        this.draftItem.itemCode = '';
        this.draftItem.itemName = '';
      },
    }
  }).mount('#my-app');
  
}
