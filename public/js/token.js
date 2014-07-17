(function(){

      $(document).ready(function(){
        try {
          (window.localStorage.getItem) 
        } catch(e){
          return; 
        }
        
        window.localStorage.setItem("usertoken", "#{token}");
        
        })

})