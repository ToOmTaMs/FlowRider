angular.module('abAPP.msg', [])

.controller('Msg2Ctrl', ['$scope', 'iAPI', 'abAPI', '$q', '$window', '$filter', '$timeout','APPconf', function ($scope,iAPI,abAPI,$q, $window, $filter, $timeout, APPconf) {
  iAPI.setPageTitle('x',"Manage Notification",'-');

  iAPI.MODEL['msg'] = [];
  $scope.refreshMsg = true;

  $scope.options = {
    allowOp: 'view,update,delete,add',
    dataAPI: 'local://msg',
    cols : [
      {label: 'Date', map: 'd_create' },
      {label: 'Subject', map: 'c_subject' },
      {label: 'Send type', map: 'c_type' },
      {label: 'Setting', map: 'c_setting' },
      {label: 'Send on', map: 'd_send' },
      {label: 'Sent', map: 'i_send' },
      {label: 'Read', map: 'i_read' },
    ],
    formFlds: [
      {map: 'c_subject'},
    ]
  };

  $scope.taToolbar = "[['ul','ol'],['bold','italics','underline'],['insertImage','insertLink','insertVideo'], ['html']]";

  $scope.msgTypeList = [
    {value: "text", name: "Message"},
    {value: "question", name: "Question"}
  ];

  $scope.questionTypeList = [
    {value: "text", name: "Text"},
    {value: "radio", name: "Radio"},
    {value: "checkbox", name: "Checkbox"},
    {value: "photo", name: "Photo"}
  ];

  $scope.sliderR_option = {
    min: 0,
    max: 0
  };

  $scope.sliderF_option = {
    min: 0,
    max: 0
  };

  $scope.sliderM_option = {
    min: 0,
    max: 0
  };

  $scope.sliderR = {
    min: 0,
    max: 0
  };

  $scope.sliderF = {
    min: 0,
    max: 0
  };

  $scope.sliderM = {
    min: 0,
    max: 0
  };

  $scope.init = function() {

    abAPI.get('msg//'+ APPconf.appId).then(function(data) {
      $scope.refreshMsg = false;
      iAPI.MODEL['msg'] = data.data;
      console.log("ร้อนโว้ย");
      console.log(iAPI.MODEL['msg']);
      $timeout(function() { $scope.refreshMsg = true; }, 10);
    });

    abAPI.get('user_stat',{}).then(function(data) {
      $scope.user_stat = data.data;
      $scope.total_user_stat = $scope.user_stat.result;

      $scope.sliderR_option.min = $scope.user_stat.config.last_seen.min*-1;
      $scope.sliderR_option.max = $scope.user_stat.config.last_seen.max*-1;

      $scope.sliderF_option.min = $scope.user_stat.config.seen_count.min;
      $scope.sliderF_option.max = $scope.user_stat.config.seen_count.max;

      $scope.sliderM_option.min = $scope.user_stat.config.spend.min;
      $scope.sliderM_option.max = $scope.user_stat.config.spend.max;

      console.log("user_stat");
      console.log(data);
    });
  }
  // default value for new row here
  $scope.options.beforeUpdRow = function(row) {
    if (!row.id) {
      sliderR.min = $scope.sliderR_option.min;
      sliderR.max = $scope.sliderR_option.max;

      sliderF.min = $scope.sliderF_option.min;
      sliderF.max = $scope.sliderF_option.max;

      sliderM.min = $scope.sliderM_option.min;
      sliderM.max = $scope.sliderM_option.max

      row.c_message = {steps:[]};
      row.c_type = 'SCHEDULE-SEND';
      $scope.addStep();
    }
    else {
      row.msg = {};
      if (row.c_type =='SCHEDULE-SEND') {
        console.log(row.c_setting);
        row.msg.d_date =moment(row.c_setting).format("YYYY-MM-DD");
        scope.row.msg.c_time =moment(row.c_setting).format("HH:mm");
        console.log(row.msg);
      }
    }
  }

  // validate here return false to stop proceeding
  $scope.options.beforePost = function() {
    var tmp = [];
    
    $scope.row.c_message = angular.toJson($scope.row.c_message);
    if ($scope.row.id) {
      url = 'msg/' + $scope.row.id;
      for (var i =0;i <$scope.row._curImg.length;i++) {
        if (!$scope.row._curImg[i]) tmp.push($scope.row._img_url[i]);
      }
    }
    else url ='msg';
    $scope.row.c_app_id = APPconf.appId;

    for (var i =0;i <$scope.row._curLibImg.length;i++) {
      if (!$scope.row._curLibImg[i]) tmp.push($scope.row._lib_img[i]);
    }

    if ($scope.obj.flowObj.files.length >0) {
      angular.forEach($scope.obj.flowObj.files, function(f) {
        tmp.push({'url': iAPI.fullImgUrl(f.name)});
      })
    }
    $scope.row.img_url = angular.toJson(tmp);
    $scope.row.target_filter = angular.toJson($scope.user_stat.config);

    if ($scope.row.c_type =='SCHEDULE-SEND') {
      if($scope.row.msg == "") {
        alert("invalid date");
        return false;
      }

      //$scope.row.c_setting = moment($scope.row.msg.d_date).format("YYYY-MM-DD") + " " + moment($scope.row.msg.d_time).format("HH:mm");
    }

    return true;
  }

  // steps
  $scope.addStep = function () {
    $scope.row.c_message.steps.push(
      { 'step':$scope.row.c_message.steps.length+1,
        'qType':$scope.questionTypeList[0].value,
        "choices":[],
        "msgType":"text",
        'active':'active'
    });
  }
  $scope.delStep = function (step) {
    var i = iAPI.arrayObjectIndexOfbyKey($scope.row.c_message.steps,step,'step');
    if (i !=-1) $scope.row.c_message.steps.splice(i,1);
  }

  $scope.addChoice = function (step) {    
    //var tmp = {id: ++$scope.questionChoiceCount, value: "Choice "+$scope.questionChoiceCount+" Value" ,text: "Choice "+$scope.questionChoiceCount+" Txt"};
    var count = $scope.row.c_message.steps[step].choices.length+1;
    $scope.row.c_message.steps[step].choices.push({
                id: count, 
                text: "Choice "+count+" Txt"
              });
  }
  $scope.removeChoice = function (step, choice) {
    var i = iAPI.arrayObjectIndexOfbyKey($scope.row.c_message.steps[step].choices,choice,'id');
    if (i !=-1) $scope.row.c_message.steps[step].choices.splice(i,1);
  }

  $scope.getUserStat = function() {    
    abAPI.get('user_stat/'+$scope.sliderR.min+'/'+$scope.sliderR.max+'/'+$scope.sliderF.min+'/'+$scope.sliderF.max+'/'+$scope.sliderM.min+'/'+$scope.sliderM.max,{}).then(function(data) {
      $scope.user_stat = data.data;
      console.log("user_stat");
      console.log(data);
    });
  }
  $scope.init();

}])

.controller('MsgCtrl', ['$scope', 'iAPI', 'abAPI', 'rgAdmAPI', '$q', '$window','$filter', 'APPconf', function ($scope,iAPI,abAPI,rgAdmAPI, $q, $window,$filter, APPconf) {
  console.log('MsgCtrl');
  console.log(APPconf);
  //if (angular.isUndefined($scope.currentApp)) $scope.iRedirect('app');
  $scope.currentApp = {};
  iAPI.setPageTitle('Msg.formCtrl','Manage Notification','-');

  $scope.row = null;  // if null ab-form will try to get record, this way we can provide init value here
  var q,url;
  $scope.flowOptions = angular.copy(iAPI.flowOptions);

  $scope.flowOptions.singleFile = false;
  $scope.obj = {};      // for flow object attach back to controller scope
  
  $scope.attached_img = [];

  //$scope.taToolbar = "[['ul','ol'],['bold','italics','underline'],['insertImage','insertLink','insertVideo']]";
  $scope.taToolbar = "[['ul','ol'],['bold','italics','underline'],['insertImage','insertLink','insertVideo'], ['html']]";

  $scope.pmFlds = [
    {title:'Email', model:'c_email'},
    {title:'Subject', model:'c_subject'},
    {title:'Message', model:'c_message'},
  ];

  $scope.msgTypeList = [
    {value: "text", name: "Message"},
    {value: "question", name: "Question"}
  ];

  $scope.questionTypeList = [
    {value: "text", name: "Text"},
    {value: "radio", name: "Radio"},
    {value: "checkbox", name: "Checkbox"},
    {value: "photo", name: "Photo"}
  ];

  /*$scope.defaultQuestionChoices = [
    {id:1, text:"Choice 1 Txt"},
    {id:2, text:"Choice 2 Txt"},
    {id:3, text:"Choice 3 Txt"}
  ];*/

  //$scope.questionChoices = [];
  //$scope.questionChoiceCount = 0;

  $scope.formOptions = {
    apiUrl: 'msg',
    rowId: $scope.$route.current.params.id,
    allowOp: 'view,update,delete,add',
    // backTo: 'adv.location',
  }
  // $scope.cols = [
  //   // {label: 'กลุ่มสถานที่', map: 'c_group', type:'number', disabled:true },
  //   {label: 'Template Name', map: 'name' },
  // ];

  $scope.myId = iAPI.ABuser.user_id;
  $scope.events = [
    { name:'signup', text: 'After Signup' },
    { name:'-1day', text: '1 day After Signup' },
    { name:'-2day', text: '2 day After Signup' },
    { name:'-3day', text: '3 day After Signup' },
    { name:'-4day', text: '4 day After Signup' },
    { name:'-5day', text: '5 day After Signup' },
  ];
  // $scope.cols = [
  //   // {label: 'กลุ่มสถานที่', map: 'c_group', type:'number', disabled:true },
  //   {label: 'Template Name', map: 'name' },
  // ];

  $scope.total_user_stat = "...";

  $scope.sliderR_option = {
    min: 0,
    max: 0
  };

  $scope.sliderF_option = {
    min: 0,
    max: 0
  };

  $scope.sliderM_option = {
    min: 0,
    max: 0
  };

  $scope.sliderR = {
    min: 0,
    max: 0
  };

  $scope.sliderF = {
    min: 0,
    max: 0
  };

  $scope.sliderM = {
    min: 0,
    max: 0
  };

  $scope.getData = function() {
    return abAPI.get('msg//'+ APPconf.appId);
  }

  $scope.targetChanged = function() {
    var tmp;
    // if ($scope.row.e_target =='ACTIVE-LIST') {
    //   tmp =$filter('filter')($scope.lists,{'id':$scope.row.target_id});
    //   if (!tmp.length) $scope.row.target_id = $scope.lists[0].id;
    // }
    // else if ($scope.row.e_target =='APP-USER') {
    //   tmp =$filter('filter')($scope.myApps,{'id':$scope.row.target_id});
    //   if (!tmp.length) $scope.row.target_id = $scope.myApps[0].id;
    // }

    var conf = {
      'ACTIVE-LIST': 'msg',
      'APP-USER': 'myApps'
    }
    tmp = $filter('filter')($scope[conf[$scope.row.e_target]],{'id':$scope.row.target_id});
    if (!tmp.length) $scope.row.target_id = $scope[conf[$scope.row.e_target]][0].id;
  }

  $scope.formOptions.beforePostDataFn = function () {
    abAPI.get('media',{}).then(function(data) {
      $scope.attached_img = data.data;
      console.log(data);
    });

    return true;
  }
  $scope.formOptions.afterGetDataFn = function (row) {
    console.log('in afterGetDataFn');
    console.log(row);

    return true;
  }

  // steps
  $scope.addStep = function () {
    $scope.row.c_message.steps.push(
      { 'step':$scope.row.c_message.steps.length+1,
        'qType':$scope.questionTypeList[0].value,
        "choices":[],
        "msgType":"text",
        'active':'active'
    });
  }
  $scope.delStep = function (step) {
    var i = iAPI.arrayObjectIndexOfbyKey($scope.row.c_message.steps,step,'step');
    if (i !=-1) $scope.row.c_message.steps.splice(i,1);
  }

  $scope.addChoice = function (step) {    
    //var tmp = {id: ++$scope.questionChoiceCount, value: "Choice "+$scope.questionChoiceCount+" Value" ,text: "Choice "+$scope.questionChoiceCount+" Txt"};
    var count = $scope.row.c_message.steps[step].choices.length+1;
    $scope.row.c_message.steps[step].choices.push({
                id: count, 
                text: "Choice "+count+" Txt"
              });
  }
  $scope.removeChoice = function (step, choice) {
    var i = iAPI.arrayObjectIndexOfbyKey($scope.row.c_message.steps[step].choices,choice,'id');
    if (i !=-1) $scope.row.c_message.steps[step].choices.splice(i,1);
  }
  $scope.add_img =function(im) {
    $scope.row._lib_img.push({'url': "http://www.9hosts.com/alpo/user-data/"+im.c_url});
    $scope.row._curLibImg[$scope.row._lib_img.length-1] = false;
  }
  $scope.remove_img =function(im) {
    console.log('del:'+url);
    //let ngearb do it. I know you can    
  }
  $scope.view_img =function(im) {
    //let ngearb do it. I know you can     
  }
  $scope.showMedia = function () {
    $("#media-modal1").modal();
  }


  $scope.getJson = function(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
    return str;
  }
  $scope.findIndexById = function(obj, id) {
    var index = -1;
    $(obj).each(function(i, e) {
        if (e.id && e.id == id) {
            index = i;
            return false;
        }
    });
    return index;
  }
  $scope.getUserStat = function() {
    if(angular.isDefined($scope.user_stat)) {
      $scope.user_stat.result = "...";
      rgAdmAPI.get('user_stat/'+($scope.sliderR.min*-1)+'/'+($scope.sliderR.max*-1)+'/'+$scope.sliderF.min+'/'+$scope.sliderF.max+'/'+$scope.sliderM.min+'/'+$scope.sliderM.max,{}).then(function(data) {
        $scope.user_stat = data.data;
        console.log("user_stat 2");
        console.log(data);
      });
    }
  }
  $scope.setDefaultUserStat = function() {
    $scope.sliderR = angular.copy($scope.sliderR_option);
    $scope.sliderF = angular.copy($scope.sliderF_option);
    $scope.sliderM = angular.copy($scope.sliderM_option);
  }
  $scope.getRow1 = function () {
    /*abAPI.get('media',{}).then(function(data) {
      $scope.attached_img = data.data;
      console.log(data);
    });*/

    rgAdmAPI.get('user_stat',{}).then(function(data) {
      $scope.user_stat = data.data;
      $scope.total_user_stat = $scope.user_stat.result;

      $scope.sliderR_option.min = angular.copy($scope.user_stat.config.last_seen.min)*-1;
      $scope.sliderR_option.max = angular.copy($scope.user_stat.config.last_seen.max)*-1;

      $scope.sliderF_option = angular.copy($scope.user_stat.config.seen_count);
      $scope.sliderM_option = angular.copy($scope.user_stat.config.spend);

      $scope.setDefaultUserStat();
      $scope.getUserStat();

      console.log("user_stat1");
      console.log(data);
    });

    $scope.get_list_group();

    /*rgAdmAPI.get('list_group').success(function(data){
      console.log(data);
      $scope.lists = data;
    });*/

    return abAPI.get('msg//'+ APPconf.appId);
  }
  $scope.updRow1 = function (r) {
    var tmp;
    r = r || {};
    q = $q.defer();
    $scope.row = angular.copy(r);
    $scope.row._lib_img = [];
    $scope.row._curImg = [];
    $scope.row._curLibImg = [];

    $scope.setDefaultUserStat();

    if (angular.isDefined(r.id) && $scope.row.c_message != "") {  
      $scope.row.c_message = $scope.getJson($scope.row.c_message);

      if ($scope.row.img_url !='') {
        $scope.row._img_url = angular.fromJson($scope.row.img_url);
        for (var i=0; i<$scope.row._img_url.length;i++)
          $scope.row._curImg[i] = false;
      }

      $scope.row.msg = {};
      if ($scope.row.c_type =='SCHEDULE-SEND') {
        console.log($scope.row.c_setting);
        $scope.row.msg.d_date =moment($scope.row.c_setting).format("YYYY-MM-DD");
        $scope.row.msg.c_time =moment($scope.row.c_setting).format("HH:mm");
        console.log($scope.row.msg);
      }

      if ($scope.row.target_filter != "") {
        var tmp_tf = $scope.getJson($scope.row.target_filter);
        $scope.sliderR.min = (angular.isDefined(tmp_tf.last_seen))?tmp_tf.last_seen.max*-1:$scope.sliderR_option.min;
        $scope.sliderR.max = (angular.isDefined(tmp_tf.last_seen))?tmp_tf.last_seen.min*-1:$scope.sliderR_option.max;
        $scope.sliderF = (angular.isDefined(tmp_tf.seen_count))?tmp_tf.seen_count:$scope.sliderF_option;
        $scope.sliderM = (angular.isDefined(tmp_tf.spend))?tmp_tf.spend:$scope.sliderM_option;
        $scope.getUserStat();
      }
    }
    else {
      $scope.row.c_message = {steps:[]};
      $scope.row.c_type = 'SCHEDULE-SEND';
      $scope.row.e_target = 'ACTIVE-LIST';
      if(angular.isDefined($scope.lists) && $scope.lists.length > 0) {
        $scope.row.target_id = $scope.lists[0].id;
      }
      else {
        $scope.row.target_id = "";
      }
      $scope.addStep();
    }

    $scope.obj.flowObj.files.length = 0;
    $scope.modalOptions1.title = $scope.row.c_subject || 'New Notification';
    $("#edit-modal1").modal();
    return q.promise;
  }
  $scope.postData1 = function (cb) {    
    var tmp = [];
    
    $scope.row.c_message = angular.toJson($scope.row.c_message);
    if ($scope.row.id) {
      url = 'msg/' + $scope.row.id;
      for (var i =0;i <$scope.row._curImg.length;i++) {
        if (!$scope.row._curImg[i]) tmp.push($scope.row._img_url[i]);
      }
    }
    else url ='msg';
    $scope.row.c_app_id = APPconf.appId;

    for (var i =0;i <$scope.row._curLibImg.length;i++) {
      if (!$scope.row._curLibImg[i]) tmp.push($scope.row._lib_img[i]);
    }

    if ($scope.obj.flowObj.files.length >0) {
      angular.forEach($scope.obj.flowObj.files, function(f) {
        tmp.push({'url': iAPI.fullImgUrl(f.name)});
      })
    }
    $scope.row.img_url = angular.toJson(tmp);

    var tmp_tf = angular.copy($scope.user_stat.query);
    var tmp_r_min = tmp_tf.last_seen.min;
    tmp_tf.last_seen.min = tmp_tf.last_seen.max;
    tmp_tf.last_seen.max = tmp_r_min;
    $scope.row.target_filter = angular.toJson(tmp_tf);

    if ($scope.row.c_type =='SCHEDULE-SEND' && $scope.row.e_status == 'active') {
      if(angular.isDefined($scope.row.msg) && angular.isDefined($scope.row.msg.d_date) && angular.isDefined($scope.row.msg.c_time)) {
        $scope.row.c_setting = $scope.row.msg.d_date + " " + $scope.row.msg.c_time;
      }
    }
    console.log($scope.row);
    abAPI.post(url,$scope.row).then(function(res) {
      if(cb) cb(res.data.id);
      q.resolve(res);
    });
  }
  $scope.delRow1 = function (r) {
    url = "msg/" + r.id;
    return abAPI.delete(url, {c_app_id: APPconf.appId});
  }

  $scope.tableOptions1 = {
    allowOp: 'view,update,delete,add',
    modalFns: {
      getData: $scope.getRow1,
      updRow: $scope.updRow1,
      delRow: $scope.delRow1
    },
    itemPerPpage: 20,
  }

  $scope.sendNow = function(to_all) {
    $scope.postData1(function(id){

      var send_data = {msg_id: id};

      if(to_all) {
        send_data['to_all'] = "to_all";
      }

      console.log(send_data);
      abAPI.post('msg.send_now',send_data,function(resp){
        console.log(resp);
        iAPI.toaster.pop('success', "Sent:", resp, null, 'trustedHtml');
      });
    });
  }  

  $scope.ListOptions = {
    id:'list-modal1',
    title:'Import List data',
    titleBgColor:'bg-light-blue',
    modalSize: 'lg',
    allowEdit:false,
    saveFn:$scope.importList
  };

  $scope.row2 = {};
  $scope.listLoading = false;

  $scope.get_list_group = function() {
    rgAdmAPI.get('list_group').success(function(data){
      console.log("get list");
      console.log(data);
      $scope.lists = data;
    });
  };

  $scope.addList = function() {
    $scope.row2.c_name = "";
    $scope.row2.csvFile = "";
    $("#list-modal1").modal();
  };
  $scope.delList = function() {
    if(confirm("Are you sure to delete this list?")) { 
      console.log("del list" + $scope.row.target_id);
      var group = {};
      group['id'] = $scope.row.target_id;

      rgAdmAPI.post('list_group.delete', group)
      .success(function(data) {
        $scope.get_list_group();
      });
    }
  };

  $scope.fileChanged = function() {
    var reader = new FileReader();

    // A handler for the load event (just defining it, not executing it right now)
    reader.onload = function(e) {
      $scope.$apply(function() {
          $scope.row2.csvFile = reader.result;
      });
    };

    // get <input> element and the selected file
    var csvFileInput = document.getElementById('fileInput');
    var csvFile = csvFileInput.files[0];
    // use reader to read the selected file
    // when read operation is successfully finished the load event is triggered
    // and handled by our reader.onload function
    reader.readAsText(csvFile);
  };

  $scope.importList = function () {
    $scope.listLoading = true;
console.log("add group");
    rgAdmAPI.post('list_group',{'c_name': $scope.row2.c_name}).success(function(data) {
console.log("added group");
      rgAdmAPI.post('list_group.import/'+data.id,$scope.row2)
      .success(function(data2) {
console.log("import data");
        $scope.row2.importResult = data2;
        $scope.get_list_group();
        $("#list-modal1").modal("hide");
        $scope.listLoading = false;
      });

    });
  }

  $scope.modalOptions1 = {
    id:'edit-modal1',
    // title:'Mail template',
    titleBgColor:'bg-light-blue',
    modalSize: 'lg',
    allowEdit:true,
    saveFn:$scope.postData1
  };
/*
  $scope.tableOptions = {
    allowOp: 'view,update,delete,add',
    itemPerPpage: 20,
    getDataFn: $scope.getData,
  }*/
  $scope.cols = [
    {label: 'Date', map: 'd_create' },
    {label: 'Subject', map: 'c_subject' },
    {label: 'Send type', map: 'c_type' },
    {label: 'Setting', map: 'c_setting' },
    {label: 'Send on', map: 'd_send' },
    {label: 'Sent', map: 'i_send' },
    {label: 'Read', map: 'i_read' },
  ];

/*  $scope.tinymceOptions = {
      theme: "modern",
      menubar: false,
      statusbar : false,
      relative_urls: false,
      toolbar_items_size: 'small',
      plugins: [
          //"advlist autolink lists link image charmap print preview hr anchor pagebreak",
          //"searchreplace wordcount visualblocks visualchars code fullscreen",
          //"insertdatetime media nonbreaking save table contextmenu directionality",
          //"emoticons template paste textcolor colorpicker textpattern jbimages"
          "media paste textpattern preview textcolor link media code"
      ],
      toolbar1: "undo redo | bold italic underline | link media | code preview ",
      image_advtab: false,
      setup: function(ed) {
        ed.addButton('username', {
           title: '{c_fname} : Add User Name Parameter',
           image: 'img/tinymce_buttons/username_i.png',
           onclick: function() {
              ed.insertContent('{c_fname}');
           }
        });
     }
  };

  $(document).on('focusin', function(e) {
      if ($(e.target).closest(".mce-window").length) {
          e.stopImmediatePropagation();
      }
  });*/
}]);