// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var Blank = angular.module('starter', ['ionic', 'ngCordova', 'ionic.utils'])

Blank.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


Blank.controller('imageController', function($scope, $cordovaCamera, $cordovaFile, $ionicLoading) {
    
    //localstorage

    /*Blank.run(function($localstorage) {

        $localstorage.set('name', 'Max');
        console.log($localstorage.get('name'));
        $localstorage.setObject('post', {
        name: 'Thoughts',
        text: 'Today was a good day'
    });

    var post = $localstorage.getObject('post');
    console.log(post);*/

    //Loading

    $scope.show = function() {
      $ionicLoading.show({
        content: 'Loading Data',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 200,
        showDelay: 500
      });
    };
    $scope.hide = function(){
      $ionicLoading.hide();
    };


    //Saveimage


    $scope.images = [];
    $scope.kuvat = [];
    //KIMI! Täs on tää millä sen pitäis lataa ne kuvat localstoragesta



    //Tein tällaisen loadImages funktion millä kelaan et sen pitäis näyttää ne tost aikasemmast JSONist... Tietenki tää sijoittelu tän kaa voi olla ihan metsäs

    $scope.loadImages = function() {

      var data = window.localStorage.getItem('images');

      var pictures = angular.fromJson(data);

      alert(pictures);
      
      $scope.kuvat.push(pictures);
      
    };
 
 
    $scope.addImage = function() {
      // 2

      $ionicLoading.show({template:'Loading...', duration:500});

      var options = {
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : Camera.PictureSourceType.PHOTOLIBRARY, //Camera.PictureSourceType.CAMERA
        allowEdit : false,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
      };

      $ionicLoading.show({template:'Loading...', duration:500});
      
      // 3
      $cordovaCamera.getPicture(options).then(function(imageData) {
     
        // 4
        onImageSuccess(imageData);
     
        function onImageSuccess(fileURI) {
          createFileEntry(fileURI);
        }
     
        function createFileEntry(fileURI) {
          window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
        }
     
        // 5
        function copyFile(fileEntry) {
          var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
          var newName = makeid() + name;
     
          window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
            fileEntry.copyTo(
              fileSystem2,
              newName,
              onCopySuccess,
              fail
            );
          },
          fail);
        }
        
        // 6
        function onCopySuccess(entry) {
          $scope.$apply(function () {
            $scope.images.push(entry.nativeURL);

            //Local

          //Kimi täs on tää millä se tallentaa sen images arrayn JSONiiin (localstorageen), tässäkin tää sijoitus voi olla päin helvettiä. Mietin et pitäiskö tää pistää
          //tonne onCopySuccess funktioon?

          window.localStorage.setItem('images', JSON.stringify($scope.images));

          alert($scope.images);

          });
        }
     
        function fail(error) {
          console.log("fail: " + error.code);
        }
     
        function makeid() {
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
     
          for (var i=0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          return text;
        }
     
      }, function(err) {
        console.log(err);
      });
    }

     
    $scope.urlForImage = function(imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return trueOrigin;

    }


});