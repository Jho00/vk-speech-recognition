if(typeof jQuery == 'undefined'){
  console.log("no jquery");
}
var oldInterval = null;
if(window.location.href.match(new RegExp('.*vk\.com\/im.*'))){
  if(oldInterval!=null) clearInterval(oldInterval);
  var f = function(){
    var ds = $('div[id^="audiomsgpl_"]');
    //chrome.tabs.create({url:"hello.html"});
    //console.log(ds);
    ds.each(function() {
      var btn = $(this).children("button");
      //console.log(btn);
      if($(this).children(".txtBtn").length == 0){
        var txtBtn = $("<div class='txtBtn' style='margin-left: 2px;width: 24px;height: 24px;display: inline;float: left;border-radius: 50%;background-color: #5779a1;color: white;line-height: 24px;text-align: center;font-weight: bold;background-size: 24px;background-position: center;'></div>");
        txtBtn.insertAfter(btn);
        txtBtn.css("background-image","url('"+chrome.extension.getURL("images/msg.png")+"')");
        btn.parent().parent().parent().unbind();
        txtBtn.on("click",function(event){
          event.stopPropagation();
          var l = $(this);
          $.ajax({
            url: 'https://95.213.170.76/?url='+encodeURIComponent($(this).parent().attr("data-mp3")),
            context: document.body
          }).done(function(msg) {
            //console.log("done");
            $("<div>"+msg+"</div>").insertAfter(l.parent());
          });
          //openInNewTab();
          //console.log($(this));
        });
      }
    });
  }
  f();
  oldInterval = setInterval(f,5000);
}

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

var downloadAud = function(){
  var ds = $('.im-mess--text.wall_module._im_log_body');
  //chrome.tabs.create({url:"hello.html"});
  //console.log(ds);
  var link = document.createElement('a');
  link.setAttribute('download', null);
  link.style.display = 'none';
  var arrs = new Array();
  var tex = "";
  var saver = "";
  var i = 0;
  ds.each(function() {
    var msg = $(this).find('div[id^="audiomsgpl_"]');
    console.log($(this));
    if(msg.length==0){
      tex = $(this).text();
    }else if(tex!=""){
      var btn = $(this).find("button");
      var url = btn.parent().attr("data-mp3");
      link.setAttribute('href', url);
      link.setAttribute('download', url.replace(/^.*[\\\/]/, ''));
      link.click();
      arrs.push({
        txt:tex,
        file:url.replace(/^.*[\\\/]/, '')
      });
      saver += url.replace(/^.*[\\\/]/, '')+",<size>,"+tex+"\n";
      i++;
    }
  });
  var file = new Blob([saver], {type: 'text/plain'});
  //link.href = URL.createObjectURL(file);
  //link.name = "data.csv";
  window.open(URL.createObjectURL(file));
  //alert(saver);
  //document.body.removeChild(link);
};
$(document).ready(function(){
  //downloadAud();
}
);