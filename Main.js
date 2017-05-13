var hasUnlock = true;

(function(window,document){
    var currentPosition = 0; //记录当前页面位置
    var currentPoint = -1;   //记录当前点的位置
    var pageNow = 1;   //当前页码
    var points = null; //页码数
    

    var app = {
      init:function(){
       if(/(windows)/i.test(navigator.userAgent)){
         location.href = 'views/pc.html';
       }
       document.addEventListener('DOMContentLoaded',function(){
         points = document.querySelectorAll('.pagenumber div') ;
               app.bindTouchEvent(); //绑定触摸事件
               app.bindBtnClick();   //绑定按钮点击事件
               app.setPageNow();     //设置初始页码
             }.bind(app),false);
     }(),

     bindBtnClick:function(){
      var button = document.querySelector('#testbtn');
      if (button)
      { 
        button.addEventListener('touchstart',function(){
          console.log('touch')
        })
      }
    },


        //页面平移
        transform:function(translate){
         this.style.webkitTransform = "translate3d("+translate+"px,0,0)";
         currentPosition = translate;

       },

        /**
         * 设置当前页码
         */
         setPageNow:function(){
          if (currentPoint != -1){
            points[currentPoint].className = '';
          }
          currentPoint = pageNow - 1;
          points[currentPoint].className = 'now';
          if (pageNow == 2)
          {
            app.removeGesture();
          }
        },

        /**
         * 绑定触摸事件
         */
         bindTouchEvent:function(){
           var viewport =  document.querySelector('#viewport');
           var pageWidth = window.innerWidth; //页面宽度
           var maxWidth = - pageWidth * (points.length-1); //页面滑动最后一页的位置
           var startX,startY;
           var initialPos = 0;  // 手指按下的屏幕位置
           var moveLength = 0;  // 手指当前滑动的距离
           var direction = "left"; //滑动的方向
           var isMove = false; //是否发生左右滑动
           var startT = 0; //记录手指按下去的时间

           /*手指放在屏幕上*/
           document.addEventListener("touchstart",function(e){
               // e.preventDefault();
               if (hasUnlock)
               {
                return;
              }
              var touch = e.touches[0];
              startX = touch.pageX;
              startY = touch.pageY;
               initialPos = currentPosition;   //本次滑动前的初始位置
               viewport.style.webkitTransition = ""; //取消动画效果
               startT = new Date().getTime(); //记录手指按下的开始时间
               isMove = false; //是否产生滑动
             }.bind(this),false);

           /*手指在屏幕上滑动，页面跟随手指移动*/
           document.addEventListener("touchmove",function(e){
               // e.preventDefault();
               if (hasUnlock)
               {
                return;
              }
              var touch = e.touches[0];
              var deltaX = touch.pageX - startX;
              var deltaY = touch.pageY - startY;
               //如果X方向上的位移大于Y方向，则认为是左右滑动
               if (Math.abs(deltaX) > Math.abs(deltaY)){
                 moveLength = deltaX;
                   var translate = initialPos + deltaX; //当前需要移动到的位置
                   //如果translate>0 或 < maxWidth,则表示页面超出边界
                   if (translate <=0 && translate >= maxWidth){
                     this.transform.call(viewport,translate);
                     isMove = true;
                   }
                   direction = deltaX>0?"right":"left"; //判断手指滑动的方向
                 }
               }.bind(this),false);

           /*手指离开屏幕时，计算最终需要停留在哪一页*/
           document.addEventListener("touchend",function(e){
               // e.preventDefault();
               if (hasUnlock)
               {
                return;
              }
              var translate = 0;
               //计算手指在屏幕上停留的时间
               var deltaT = new Date().getTime() - startT;
               if (isMove){ //发生了左右滑动
                    //使用动画过渡让页面滑动到最终的位置
                    viewport.style.webkitTransition = "0.3s ease -webkit-transform";
                    if(deltaT < 300){ //如果停留时间小于300ms,则认为是快速滑动，无论滑动距离是多少，都停留到下一页
                      translate = direction == 'left'?
                      currentPosition-(pageWidth+moveLength):currentPosition+pageWidth-moveLength;
                        //如果最终位置超过边界位置，则停留在边界位置
                        translate = translate > 0 ? 0 : translate; //左边界
                        translate = translate < maxWidth ? maxWidth : translate; //右边界
                      }else {
                        //如果滑动距离小于屏幕的50%，则退回到上一页
                        if (Math.abs(moveLength)/pageWidth < 0.5){
                          translate = currentPosition-moveLength;
                        }else{
                            //如果滑动距离大于屏幕的50%，则滑动到下一页
                            translate = direction == 'left'?
                            currentPosition-(pageWidth+moveLength):currentPosition+pageWidth-moveLength;
                            translate = translate > 0 ? 0 : translate;
                            translate = translate < maxWidth ? maxWidth : translate;
                          }
                        }
                    //执行滑动，让页面完整的显示到屏幕上
                    this.transform.call(viewport,translate);
                    //计算当前的页码
                    pageNow = Math.round(Math.abs(translate) / pageWidth) + 1;
                    setTimeout(function(){
                        //设置页码，DOM操作需要放到子线程中，否则会出现卡顿
                        this.setPageNow();
                      }.bind(this),100);
                  }
                }.bind(this),false);
         },

         removeGesture:function(){
          console.log("removeBegin");
          var fn = function(){ console.log("remove"); };
          hasUnlock = true;
        // document.removeEventListener("touchstart", fn.bind(this), true);
        // document.removeEventListener("touchmove", fn.bind(this), false);
        // document.removeEventListener("touchend", fn.bind(this), false);
        // document.bind('touchmove', false);
      }
    }
  })(window,document);




  function preloadSth() 
  {
    console.log("preload");
    var myVideo = document.getElementById("myVideo");
    myVideo.muted = true;
    myVideo.play();

    var audio4 = document.getElementById('unlock');
    audio4.src = "audio/unlock.mp3";
    audio4.muted = true;
    audio4.currentTime = 0;
    audio4.play();
    audioAutoPlay(audio4);

    // audioAutoPlay();
    // audio2.play();

    
    // audio3.play();
    // audioAutoPlay(audio3);

    for (var i = 1; i <= 5; i++)
    {
      for (var j = 1; j <= 4; j++)
      {
        var str = 'r'+i+'l'+j;
        var curAudio = document.getElementById(str);
        if (curAudio)
        {
          curAudio.muted = true;
          curAudio.currentTime = 0;
          curAudio.play();
        }
      }
    }
    
  }



  var clickCount = 0;
  var hasShowMessage = false;
  function play(icon)
  {
   clickCount++;

   if (clickCount >= 5)
   {
    if (!hasShowMessage)
    {
     showMessage();
     hasShowMessage = true;
   }

   return;
 }
 var audio;
 var iconId = icon.id;
 var audioId = iconId.substr(8,4);
 console.log(audioId);
 audio = document.getElementById(audioId);
 playAudio(audio);
}

function playAudio(audio) 
{
  stopAll();
  audio.currentTime = 0;
  audio.muted = false;
  audio.play(); 
}

function stopAll()
{
  var audios = document.getElementsByName("audio");
  for (var i = audios.length - 1; i >= 0; i--) 
  {
    audios[i].pause();
  }

  var myVideo = document.getElementById("myVideo");
  if (myVideo)
  {
    myVideo.pause();
  }
}

function showMessage() 
{
  var messageTips = document.getElementById("messageTips");
  messageTips.className="messageTips";
  messageTips.style.height = "104px";
  var msgImg1 = document.getElementById("messageImg1");
  msgImg1.src = "resource/Message1.png";
  msgImg1.style.height = "100%";
  console.log(msgImg1);

  var audio2 = document.getElementById('messageAudio2');
  audio2.muted = true;
  audio2.play();

  var audio1 = document.getElementById('messageAudio1');
  playAudio(audio1);

  setTimeout(function(){
    showPrintPage();
    // var audio3 = document.getElementById('messageAudio3');
    // playAudio(audio3);
  }, 5200);
}

function hideMessage() 
{
  var messageTips = document.getElementById("messageTips");
  messageTips.style.width = 0;
  messageTips.style.height = 0;
}

function showMessage2() 
{
  var messageTips2 = document.getElementById("messageTips2");
  messageTips2.className="messageTips";
  messageTips2.style.height = "104px";
  var msgImg2 = document.getElementById("messageImg2");
  msgImg2.src = "resource/Message2.png";
  msgImg2.style.height = "100%";

  var audio2 = document.getElementById('messageAudio2');
  playAudio(audio2);
}

function hideMessage2() 
{
  var messageTips2 = document.getElementById("messageTips2");
  messageTips2.style.width = 0;
  messageTips2.style.height = 0;
}

var didPlayEnd = false;

function playVideo() 
{
  stopAll();
  var viewport = document.getElementById("viewport");
  viewport.style.display = "none";

  var VideoPage = document.getElementById("VideoPage");
  VideoPage.className="VideoPage";

  var myVideo = document.getElementById("myVideo");
  myVideo.muted = false;
  myVideo.play();
  console.log(myVideo.className);

  myVideo.addEventListener('ended',function(){didPlayEnd=true},false);
}

function showEndPage()
{
  if (!didPlayEnd)
  {
    var myVideo = document.getElementById("myVideo");
    myVideo.play();
    return;
  }
  stopAll();
  $("#VideoPage").children().hide();
  // $("#VideoPage").hide();
  var VideoPage = document.getElementById("VideoPage");
  // console.log(VideoPage.className);
  VideoPage.style.width = "0";
  VideoPage.style.height = "0";

  var endPage = document.getElementById("endPage");
  endPage.className="endPage";
}

function showSharePage()
{
  console.log("showSharePage");
}


function showPrintPage()
{
  hideMessage();
  var printPage = document.getElementById("printPage");
  printPage.className="printPage";
  var msg="哥们，听别人说速度与激情8今天上映<br>";
  var msg2 = "这部电影我已经等了2年了<br>";
  var msg3 = "可是自从去年那场意外之后<br>";
  var msg4 = "我就再也没看过电影了<br><br>";
  var msg5 = "而我，从来都没看过电影。。。<br>";
  beginPrint(msg+msg2+msg3+msg4+msg5);
  // beginPrint(msg5);
}

var i=1;
var isBrace = false;
function write(msg)  
{  
  var id=document.getElementById("printWord");  
  var len=msg.length;  
  console.log(i, len);
  var msg1=msg.substring(0,i);  
  if (msg1.slice(-1) == '<')
  {
   isBrace = true;
 }
 else if (msg1.slice(-1) == '>')
 {
  isBrace = false;
  return;
}
if (isBrace)
{
  return;
}
id.innerHTML=msg1;  
}  
function beginPrint(msg)  
{
  var t=setInterval(function(){
    write(msg); 
    if(i>=msg.length)
    {
      console.log("hehe")
      clearInterval(t);
      setTimeout(function(){
        var printPage = document.getElementById("printPage");
        printPage.style.width = "0";
        printPage.style.height = "0";
        write("");

        setTimeout(function(){
         showMessage2();
       },1000);
      }, 2000);
    }  
    else  
    {
      i++;  
    }
  }, 300);  
}  

function hideBtn()
{
  var btn = document.getElementById("btn");
  btn.style.width = 0;
  btn.style.height = 0;

  var audio = document.getElementById("unlock");
  playAudio(audio);
  hasUnlock = false;
}


function autoPlayAudio1(myAudio)
{
  wx.config({
    // 配置信息, 即使不正确也能使用 wx.ready
    debug: false,
    appId: '',
    timestamp: 1,
    nonceStr: '',
    signature: '',
    jsApiList: []
  });

  wx.ready(function() {
    myAudio.play();
  });
}


function audioAutoPlay(){
  var audio2 = document.getElementById('messageAudio2');
    audio2.src = "audio/msg4s.mp3";
    audio2.muted = true;
    audio2.currentTime = 0;
    audio2.play();

    // var audio3 = document.getElementById('messageAudio3');
    // audio3.src = "audio/msg3s.mp3";
    // audio3.muted = true;
    // audio3.currentTime = 0;
    // audio3.play();

    document.addEventListener("WeixinJSBridgeReady", function () {
            var audio2 = document.getElementById('messageAudio2');
            audio2.src = "audio/msg4s.mp3";
            audio2.muted = true;
            audio2.currentTime = 0;
            audio2.play();

            // var audio3 = document.getElementById('messageAudio3');
            // audio3.src = "audio/msg3s.mp3";
            // audio3.muted = true;
            // audio3.currentTime = 0;
            // audio3.play();
    }, false);
}
