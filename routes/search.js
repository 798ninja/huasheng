var express = require('express');
var router = express.Router();
SphinxClient = require ("sphinxapi");
var sequelize =require('../models/ModelHeader')();

/* GET home page. */
router.get('/goods', function(req, res, next) {
	console.log('访问goods');
  //res.locals.loginbean = req.session.loginbean;
  keywords = req.query.keywords;
  kwArr = keywords.split(' ');
  len = kwArr.length;
  keyword = '';
  for(i=0;i<len;i++){
  	if(kwArr[i]!=''){
  		keyword += kwArr[i]+'|';
  	}
  }
  var cl = new SphinxClient();
  cl.SetServer('localhost', 9312);
  cl.SetMatchMode(SphinxClient.SPH_MATCH_ANY);		//或运算
  cl.Query(keyword,'goods',function(err, result) {
	        if(err){
	        	console.log(err);
	        	console.log('-------有错-----------');
	        	res.send(err);
	        	return;
	        }
	        sql = 'select s.id, s.shopname, s.lng, s.lat, g.goodsname, g.goodsimg, g.goodsintro, g.goodsprice, g.praise from goods g, shop s where g.id= ? and g.shopid = s.id';
          rsGoods=[];
          ii=0;
	        for(var key in result['matches']){
          goodsid = result['matches'][key].id;
          sequelize.query(sql,{replacements:[goodsid],type:
          sequelize.Querytypes.QUERY}).then(function
          (rs){
            rsGoods.push(rs[0]);
              ii++;
              if(ii>=total){
                
              }
          })

			}
			 res.render('searchGoods',{rsGoods:rsGoods});
   });
  //res.render('index', {});
});


module.exports = router;
