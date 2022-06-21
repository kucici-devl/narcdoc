const { pbkdf2 } = require('crypto');
var express = require('express');
var router = express.Router();
var moji = require('moji');

function h2z(str){
  return moji(str).convert('HE','ZE').convert('HS','ZS').convert('HK','ZK').toString();
}
function z2h(str){
  return moji(str).convert('ZE','HE').convert('ZS','HS').convert('ZK','HK').toString();
}

async function drawpdflib(pdf,pos){
  const {PDFDocument} = require("pdf-lib");
  const pdfDoc = await PDFDocument.load(pdf);
  const pages = pdfDoc.getPages();
  if(pos <4){
    for(var i=0;i<2;i++){
      pages[i].drawLine({
        start:{x:100,y:302-pos*24 -pos*2 },
        end:{x:742,y:198},
        thickness:1
      });
    }
  }
  const pdfBytes = await pdfDoc.save();
  pdf = pdfBytes;
/*  const pdfDoc = await PDFDocument.load(pdf);
  const pages = pdfDoc.getPages();
  pages[0].drawLine({
    start: { x: 25, y: 75 },
    end: { x: 125, y: 175 },
    thickness: 2,
    color: rgb(0.75, 0.2, 0.2),
    opacity: 0.75,
  });
  const pdfBytes = await pdfDoc.save()
  pdf = pdfBytes;
*/
  return pdf;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'データ入力' });
});

router.post('/topdf',function(req,res,next){
//year,month,day,myname,myaddress,yourname,youraddres,send_or_receive,
//itemname1,itemcapacity1,itemnumber1,itemquantity1,itemmemo1 1-4
//  console.log(req.body);

  let inputval = Object();
  inputval.year1 = req.body.year;
  inputval.month1 = req.body.month;
  inputval.day1 = req.body.day;
  if(req.body.send_or_receive == "send"){
    inputval.fromname1 = req.body.myname;
    inputval.fromaddress1 = req.body.myaddress;
    inputval.toname1 = req.body.yourname;
    inputval.toaddress1 = req.body.youraddress;
  }else{
    inputval.fromname1 = req.body.yourname;
    inputval.fromaddress1 = req.body.youraddress;
    inputval.toname1 = req.body.myname;
    inputval.toaddress1 = req.body.myaddress;
  }
  inputval.itemname1_1= req.body.itemname1;
  inputval.itemname2_1= req.body.itemname2;
  inputval.itemname3_1= req.body.itemname3;
  inputval.itemname4_1= req.body.itemname4;

  inputval.itemcapacity1_1= req.body.itemcapacity1;
  inputval.itemcapacity2_1= req.body.itemcapacity2;
  inputval.itemcapacity3_1= req.body.itemcapacity3;
  inputval.itemcapacity4_1= req.body.itemcapacity4;

  inputval.itemnumber1_1= req.body.itemnumber1;
  inputval.itemnumber2_1= req.body.itemnumber2;
  inputval.itemnumber3_1= req.body.itemnumber3;
  inputval.itemnumber4_1= req.body.itemnumber4;

  inputval.itemquantity1_1= req.body.itemquantity1;
  inputval.itemquantity2_1= req.body.itemquantity2;
  inputval.itemquantity3_1= req.body.itemquantity3;
  inputval.itemquantity4_1= req.body.itemquantity4;

  inputval.itemmemo1_1= req.body.itemtokurei1 +" "+req.body.itemmemo1;
  inputval.itemmemo2_1= req.body.itemtokurei2 +" "+req.body.itemmemo2;
  inputval.itemmemo3_1= req.body.itemtokurei3 +" "+req.body.itemmemo3;
  inputval.itemmemo4_1= req.body.itemtokurei4 +" "+req.body.itemmemo4;

  console.log(JSON.stringify(inputval));
  //pdfme

  // node.js 14の場合、atobをグローバルに設定
  if (!global.atob) {
      global.atob = require('atob');
  }
  const fs = require('fs');
  const { generate, BLANK_PDF } = require('@pdfme/generator');
  const appdir = process.cwd()+"/";
  const font = {
      TanukiMagic:{
          data:fs.readFileSync(appdir+'TanukiMagic.ttf'),
          fallback:false,
      },
      ipaexg:{
          data:fs.readFileSync(appdir+'ipaexg.ttf'),
          fallback:true,
      },
  }
  // テンプレート読み込み
  const file = fs.readFileSync(appdir+'templateformat.json');
  const template = JSON.parse(file);
  //const template = jsonic(file);
  // 設定値
//  const inputs = [{"year1":"2025","month1":"12","day1":"12","fromaddress1":"住所","toaddress1":"text","fromname1":"text","toname1":"text","itemname1_1":"text","itemname2_1":"text","itemname3_1":"text","itemname4_1":"text","itemcapacity1_1":"text","itemcapacity2_1":"text","itemcapacity3_1":"text","itemcapacity4_1":"text","itemnumber1_1":"text","itemnumber2_1":"text","itemnumber3_1":"text","itemnumber4_1":"text","itemquantity1_1":"text","itemquantity2_1":"text","itemquantity3_1":"text","itemquantity4_1":"text","itemmemo1_1":"text","itemmemo2_1":"text","itemmemo3_1":"text","itemmemo4_1":"text","year2":"2022"}];
  const inputs = [inputval];
  generate({ template, inputs,options:{font} }).then((pdf) => {
      // 生成したpdfを出力
/*      fs.writeFileSync(appdir+'test.pdf', pdf);
var file2 = fs.createReadStream(appdir+'test.pdf');
var stat = fs.statSync(appdir+'test.pdf');
res.setHeader('Content-Length', stat.size);
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'inline; filename=mayakukakunin.pdf');
file2.pipe(res);
*/
    let items=0;
    if(inputval.itemname4_1 != ""){
      items=4;
    }else if(inputval.itemname3_1 != ""){
      items=3;
    }else if(inputval.itemname2_1 != ""){
      items=2;
    }else if(inputval.itemname1_1 != ""){
      items=1;
    }
   promise_data = drawpdflib(pdf,items);
   promise_data.then(function(data){
    // const {PDFDocument,rgb} = require("pdf-lib");
    // PDFDocument.load(pdf).then((pdfDoc)=>{
    //   const pages = pdfDoc.getPages();
    //   if(items <4){
    //     for(var i=0;i<2;i++){
    //       pages[i].drawLine({
    //         start:{x:100,y:302-items*24 -items*2 },
    //         end:{x:742,y:198},
    //         thickness:1
    //       });
    //     }
    //   }
      // pdfDoc.save().then((data)=>{
        /////////////
        //pdfをfileに出力せず、直接ブラウザへ送る
        // Send binary response from UInt8Array in Express.js https://stackoverflow.com/a/62657989
        const stream = require("stream");
        const readStream = new stream.PassThrough();
        // Pass your output.docx buffer to this
        readStream.end(data);
        res.set("Content-disposition", 'inline; filename=' + "mayakukakunin.pdf");
        res.set("Content-Type", "application/pdf");
        readStream.pipe(res);
        /////////////

      });
    // });
  });

});

module.exports = router;
