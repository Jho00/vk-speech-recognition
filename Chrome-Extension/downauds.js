
var downloadAud = function(){
  var ds = $('.im-mess--text.wall_module._im_log_body');
  //chrome.tabs.create({url:"hello.html"});
  //console.log(ds);
  var link = document.createElement('a');
  link.setAttribute('download', null);
  link.style.display = 'none';
  var arrs = new Array();
  var tex = "";
  var i = 0;
  ds.each(function() {
    var msg = $(this).find('div[id^="audiomsgpl_"]');
    if(msg.length==0){
      tex = $(this).text();
    }else if(tex!=""){
      var btn = $(this).find("button");
      if(i==0) console.log(btn.parent().attr("data-mp3"));
      var url = btn.parent().attr("data-mp3");
      link.setAttribute('href', url);
      link.setAttribute('download', url.replace(/^.*[\\\/]/, ''));
      link.click();
      arrs.push({
        txt:tex,
        file:url.replace(/^.*[\\\/]/, '')
      });
      i++;
    }
  });
  
  document.body.removeChild(link);
};
//downloadAud();