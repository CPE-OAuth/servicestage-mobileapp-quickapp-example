/**
 * Copyright 2018 Huawei Technologies Co., Ltd. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * */
import fetch from '@system.fetch';
import router from '@system.router';
import prompt from '@system.prompt';
import storage from '@system.storage';



var server_URL="myHost";
var appID = "myAppId";

export default {
  getRestaurantsDetails(callback) {
  var dataList=[];
  fetch.fetch({
    url: server_URL+"/classes/Restaurants",
    header:{
      "X-Parse-Application-Id":appID
    },
    success: function (ret) {
    callback(JSON.parse(ret.data).results);
    
    }.bind(this),
    fail: function (data, code) {
      console.info('failed to get data');
    },
    complete: function () {
      console.info('complete')
    }
    })
   },
    getTopRatedDetails(callback) {
    var dataList=[];
    fetch.fetch({
      url: server_URL+"/classes/TopRated",
      header:{
        "X-Parse-Application-Id":appID
      },
      success: function (ret) {
      callback(JSON.parse(ret.data).results);
      
      }.bind(this),
      fail: function (data, code) {
        console.info('fail to get data');
      },
      complete: function () {
        console.info('complete')
      }
      })
    },
    getOffersDetails(callback) {
      var dataList=[];
      fetch.fetch({
        url: server_URL+"/classes/Offers",
        header:{
          "X-Parse-Application-Id":appID
        },
        success: function (ret) {
        callback(JSON.parse(ret.data).results);
        
        }.bind(this),
        fail: function (data, code) {
          console.info('failed to get data');
        },
        complete: function () {
          console.info('complete')
        }
        })
      },
   login(user,pass) {
    fetch.fetch({
      url: server_URL+"/login?username="+user+"&password="+pass,
      header:{
        "X-Parse-Application-Id":appID
      },
      success: function (ret) {
      if(ret.code == 200)
      {
      storage.set({
        key: 'sessionToken',
        value: JSON.parse(ret.data).sessionToken,
        success: function (data) {
          console.log('handling session success '+ data)
        },
        fail: function (data, code) {
          console.log(`handling session fail, code = ${code}`)
        }
      })
      router.push ({
        uri: '/Menu'
      })
    }else{
      console.debug("Login failed. "+ret.code+" Message: "+JSON.parse(ret.data).error);
      prompt.showDialog({
        title: 'Error',
        message: 'Login failed. '+ret.code+' Message: '+JSON.parse(ret.data).error,
        buttons: [
            {
                text: 'OK',
                color: '#0faeff'
            }
          ]
      })
      }
      }.bind(this),
      fail: function (data, code) {
        console.debug("login fail : "+data+" "+code);
        
      }
      })
    },
    signup(user,pass,email) {
      fetch.fetch({
        url: server_URL+"/users",
        header:{
          "X-Parse-Application-Id":appID
        },
        method: 'POST',
        data:{
          "username":user,
          "password":pass,
          "email":email
        },
        success: function (ret) {
        if(ret.code == 201)
        {
        console.debug("signup success "+JSON.parse(ret.data).sessionToken);
        prompt.showDialog({
          title: 'Signup',
          message: 'Signup success',
          buttons: [
            {
              text: 'Ok',
              color: '#33dd44'
            }
          ],
          success: function (data) {
            router.push ({
              uri: '/Login'
            })
    
          }
        })
        fetch.fetch({
          url: server_URL+"/logout",
          header:{
            "X-Parse-Application-Id":appID,
            "X-Parse-Session-Token":JSON.parse(ret.data).sessionToken
          },
          method: 'POST'
          })

      }else{
        console.debug("Login failed. "+ret.code+" Message: "+JSON.parse(ret.data).error);
        prompt.showDialog({
          title: 'Error',
          message: 'Login failed. '+ret.code+' Message: '+JSON.parse(ret.data).error,
          buttons: [
              {
                  text: 'OK',
                  color: '#0faeff'
              }
            ]
        })
        }
        }.bind(this),
        fail: function (data, code) {
          console.debug("login fail : "+data+" "+code);
          
        }
        })
      },
     logout() {
      storage.get({
        key: 'sessionToken',
        success: function (data) {
          console.log('handling session success'+ data)
          fetch.fetch({
            url: server_URL+"/logout",
            header:{
              "X-Parse-Application-Id":appID,
              "X-Parse-Session-Token":data
            },
            method: 'POST',
            success: function (ret) {
              router.push ({
                uri: '/Login'
              })
            }.bind(this),
            fail: function (data, code) {
              console.debug("logout fail : "+data+" "+code);
            }
            })
        },
        fail: function (data, code) {
          console.log(`handling fail, code = ${code}`)
        }
      })
      console.debug('logout done');
      }

}