var request = require('supertest');
var should = require('should');
var app = require('../app');

var url = 'https://order-transaction-api.herokuapp.com';
var product_id = '57dbaeaadcba0f0cb705101c';
var coupon_code = 'DC10K';
var proof_path = 'test\\4b7aa632d1fdf3c1872a7370a9f74bc2';
var shipping_id = 'BDO-CGK';

var cookies;
var order_id;

describe('Customer Endpoint', function() {
  describe('GET /cart', function() {
    it('should get empty guest cart', function(done) {
      request(url)
        .get('/cart')
        .expect(204)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            cookies = res.headers['set-cookie'].pop().split(';')[0];

            done();
          }
        });
    });
  });

  describe('POST /cart', function() {
    it('should not add product to cart', function(done) {
      var req = request(url).post('/cart');
      req.cookies = cookies;
      req.send({
          product_id: 'wrong_product_id',
          product_quantity: 1
        })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should not add product to cart', function(done) {
      var req = request(url).post('/cart');
      req.cookies = cookies;
      req.send({
          product_id: product_id,
          product_quantity: -1
        })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should not add product to cart', function(done) {
      var req = request(url).post('/cart');
      req.cookies = cookies;
      req.send({
          product_id: product_id
        })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should not add product to cart', function(done) {
      var req = request(url).post('/cart');
      req.cookies = cookies;
      req.send({
          product_quantity: -1
        })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should not add product to cart', function(done) {
      var req = request(url).post('/cart');
      req.cookies = cookies;
      req.expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('POST /cart/coupon', function() {
    it('should not add coupon', function(done) {
      var req = request(url).post('/cart/coupon');
      req.cookies = cookies;
      req.send({
          coupon_code: 'DC100K'
        }).expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should not add coupon', function(done) {
      var req = request(url).post('/cart/coupon');
      req.cookies = cookies;
      req.expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('POST /order', function() {
    it('should not order', function(done) {
      request(url)
        .post('/order')
        .send({
          name: 'Christ',
          email: 'christ@gmail.com',
          phone: '08123456789',
          address: 'Bandung'
        }).expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should add product to cart', function(done) {
      request(url)
        .get('/cart')
        .expect(204)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            cookies = res.headers['set-cookie'].pop().split(';')[0];

            var req = request(url).post('/cart');
            req.cookies = cookies;
            req.send({
                product_id: product_id,
                product_quantity: 1
              })
              .expect(201)
              .end(function(err, res) {
                if (err) {
                  done(err);
                } else {
                  done();
                }
              });
          }
        });
    });

    it('should not order', function(done) {
      request(url)
        .post('/order')
        .send({
          name: 'Christ',
          email: 'christ@gmail.com',
          phone: '08123456789',
        }).expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should not order', function(done) {
      request(url)
        .post('/order')
        .send({
          name: 'Christ',
          email: 'christ@gmail.com',
          address: 'Bandung'
        }).expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should not order', function(done) {
      request(url)
        .post('/order')
        .send({
          name: 'Christ',
          phone: '08123456789',
          address: 'Bandung'
        }).expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should not order', function(done) {
      request(url)
        .post('/order')
        .send({
          email: 'christ@gmail.com',
          phone: '08123456789',
          address: 'Bandung'
        }).expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should not order', function(done) {
      request(url)
        .post('/order')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('POST /order/pay', function() {
    it('should not pay', function(done) {
      request(url)
        .post('/order/pay')
        .field('order_id', 'wrong_order_id')
        .attach('proof', proof_path)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should not pay', function(done) {
      request(url)
        .post('/order/pay')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('GET /order/:order_id', function() {
    it('should not get order status', function(done) {
      request(url)
        .get('/order/wrong_order_id')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('GET /shipping/:shipping_id', function() {
    it('should not get shipping status', function(done) {
      request(url)
        .get('/order/wrong_shipping_id')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('Integration', function() {
    it('should get empty guest cart', function(done) {
      request(url)
        .get('/cart')
        .expect(204)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            cookies = res.headers['set-cookie'].pop().split(';')[0];

            done();
          }
        });
    });

    it('should add product to cart', function(done) {
      var req = request(url).post('/cart');
      req.cookies = cookies;
      req.send({
          product_id: product_id,
          product_quantity: 1
        })
        .expect(201)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should get guest cart with product', function(done) {
      var req = request(url).get('/cart');
      req.cookies = cookies;
      req.expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.cart.items[0].product._id.should.equal(product_id);
            res.body.cart.items[0].quantity.should.equal(1);

            done();
          }
        });
    });

    it('should increase quantity product to cart', function(done) {
      var req = request(url).post('/cart');
      req.cookies = cookies;
      req.send({
          product_id: product_id,
          product_quantity: 1
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should get guest cart with increased quantity of product', function(done) {
      var req = request(url).get('/cart');
      req.cookies = cookies;
      req.expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.cart.items[0].product._id.should.equal(product_id);
            res.body.cart.items[0].quantity.should.equal(2);

            done();
          }
        });
    });

    it('should add coupon', function(done) {
      var req = request(url).post('/cart/coupon');
      req.cookies = cookies;
      req.send({
          coupon_code: 'DC10K'
        }).expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should get guest cart with product and coupon', function(done) {
      var req = request(url).get('/cart');
      req.cookies = cookies;
      req.expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.cart.items[0].product._id.should.equal(product_id);
            res.body.cart.items[0].quantity.should.equal(2);
            res.body.cart.coupon.code.should.equal('DC10K');

            done();
          }
        });
    });

    it('should order', function(done) {
      var req = request(url).post('/order');
      req.cookies = cookies;
      req.send({
          name: 'Christ',
          email: 'christ@gmail.com',
          phone: '08123456789',
          address: 'Bandung'
        }).expect(201)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body._id.should.have.length(24);
            res.body.items.should.have.length(1);
            res.body.coupon.code.should.equal(coupon_code);
            order_id = res.body._id;

            done();
          }
        });
    });

    it('should get empty guest cart', function(done) {
      var req = request(url).get('/cart');
      req.cookies = cookies;
      req.expect(204)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should get order status', function(done) {
      request(url)
        .get('/order/' + order_id)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.status.should.equal('pending');

            done();
          }
        });
    });

    it('should pay', function(done) {
      request(url)
        .post('/order/pay')
        .field('order_id', order_id)
        .attach('proof', proof_path)
        .expect(201)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should get order status', function(done) {
      request(url)
        .get('/order/' + order_id)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.status.should.equal('paid');

            done();
          }
        });
    });

    it('should verify order', function(done) {
      request(url)
        .post('/admin/order/update')
        .send({
          scenario: 'verify',
          order_id: order_id
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should get order status', function(done) {
      request(url)
        .get('/order/' + order_id)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.status.should.equal('verified');

            done();
          }
        });
    });

    it('should ship order', function(done) {
      request(url)
        .post('/admin/order/ship')
        .send({
          shipping_id: shipping_id,
          order_id: order_id
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should get order status', function(done) {
      request(url)
        .get('/order/' + order_id)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.status.should.equal('shipped');

            done();
          }
        });
    });

    it('should get shipping status', function(done) {
      request(url)
        .get('/shipping/' + shipping_id)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.status.should.equal('pending');

            done();
          }
        });
    });
  });
});
