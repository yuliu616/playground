var vm = {
  data: {
    topMessage: {
      visible: true,
      isError: false,
      header: 'Welcome !',
      message: 'This is a simple demo of form filling.',
    },
    formData: {
      firstName: '',
      lastName: '',
    },
  },
  methods: {
    hideTopMessage: function(){
      this.topMessage.visible = false;
    },
    onCreationFormSubmitted: function(data){
      console.log('to be created:', data);
      axios.post('/api/1.1/random', data).then(res=>{
        console.log('good', res.data);
        this.showFeedback('good');
      }).catch(err=>{
        console.error('error when calling server.', err);
        this.showError(err);
      });
    },
    showFeedback(message){
      this.topMessage.visible = true;
      this.topMessage.isError = false;
      this.topMessage.header = 'Server Feedback';
      this.topMessage.message = message;
    },
    showError(err){
      this.topMessage.visible = true;
      this.topMessage.isError = true;
      this.topMessage.header = 'Oops';
      this.topMessage.message = err.message;
    },
  },
};

function init(){
  new Vue({
    el: '#my-app',
    data: vm.data,
    methods: vm.methods,
  });
}
