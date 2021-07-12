const name_user = document.querySelector('input[name="user_name"]');
const faceID = document.querySelector('input[name="faceID"]')
window.fbAsyncInit = function() {
    FB.init({
      appId      : '811125736273086',
      cookie     : true,
      xfbml      : true,
      version    : 'v11.0'
    });
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
   
  
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
  function statusChangeCallback(response) {  
    if(response.status==='connected') {
      const facebookID = response.authResponse.userID;
      FB.api(
        '/me',
        'GET',
        {"fields":"id,name"},
        function(response) {
            name_user.value = response.name;
            faceID.value = response.id;
        }
      );
    }else {
      Alert('Please login with your facebook');
    }              // The current login status of the person.
  }
 