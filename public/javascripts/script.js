var setmydata= function(){
  var myname = document.getElementById("myname").value;
  var myaddress = document.getElementById("myaddress").value;
  Cookies.set('myname',myname);
  Cookies.set('myaddress',myaddress);
}

var getmydata= function(){
  let myname= Cookies.get('myname');
  if (myname==null){myname="";}
  let myaddress = Cookies.get('myaddress');
  if (myaddress==null){myaddress="";}
  document.getElementById('myname').value=myname;
  document.getElementById('myaddress').value=myaddress;
}

document.getElementById("makepdf").addEventListener('click',function(){
  setmydata();
});

document.addEventListener('DOMContentLoaded',function(){
  getmydata();
});

document.getElementById("today").addEventListener('click',function(){
  let today = new Date();
  document.getElementById('year').value= today.getFullYear();
  document.getElementById('month').value= today.getMonth()+1;
  document.getElementById('day').value= today.getDate();
  return false;
});