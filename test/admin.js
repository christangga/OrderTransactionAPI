var request = require('supertest');
var should = require('should');
var app = require('../app');

var url = 'http://localhost:3000';
var product_id = '57dbaeaadcba0f0cb705101c';
var coupon_code = 'DC10K';
var proof_path = 'test\\4b7aa632d1fdf3c1872a7370a9f74bc2';
var shipping_id = 'BDO-CGK';

var cookies;
var order_id;

describe('Admin Endpoint', function() {
  describe('GET /admin/order', function() {
    it('should not get customer order', function(done) {
      request(url)
        .get('/admin/order?status=wrong_status')
        .expect(204)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('GET /admin/order/:order_id', function() {
    it('should not get customer specific order', function(done) {
      request(url)
        .get('/admin/order/wrong_order_id')
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

  describe('POST /admin/order/update', function() {
    it('should not verify order', function(done) {
      request(url)
        .post('/admin/order/update')
        .send({
          scenario: 'verify',
          order_id: 'wrong_order_id'
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

    it('should not cancel order', function(done) {
      request(url)
        .post('/admin/order/update')
        .send({
          scenario: 'cancel',
          order_id: 'wrong_order_id'
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

    it('should not update order', function(done) {
      request(url)
        .post('/admin/order/update')
        .send({
          scenario: 'wrong_scenario',
          order_id: order_id
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

    it('should not update order', function(done) {
      request(url)
        .post('/admin/order/update')
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

  describe('POST /admin/order/ship', function() {
    it('should not ship order', function(done) {
      request(url)
        .post('/admin/order/ship')
        .send({
          shipping_id: shipping_id,
          order_id: 'wrong_order_id'
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

    it('should not ship order', function(done) {
      request(url)
        .post('/admin/order/ship')
        .send({
          shipping_id: 'wrong_shipping_id',
          order_id: order_id
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

    it('should not ship order', function(done) {
      request(url)
        .post('/admin/order/ship')
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
    it('should order', function(done) {
      this.timeout(5000);

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
                        res.body.order_id.should.have.length(24);
                        order_id = res.body.order_id;

                        done();
                      }
                    });
                }
              });
          }
        });
    });

    it('should get customer order', function(done) {
      request(url)
        .get('/admin/order?status=pending')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.orders.should.be.an.Array();

            done();
          }
        });
    });

    it('should get customer specific order', function(done) {
      request(url)
        .get('/admin/order/' + order_id)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body._id.should.equal(order_id);

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

    it('should order', function(done) {
      this.timeout(5000);

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
                        res.body.order_id.should.have.length(24);
                        order_id = res.body.order_id;

                        done();
                      }
                    });
                }
              });
          }
        });
    });

    it('should cancel order', function(done) {
      request(url)
        .post('/admin/order/update')
        .send({
          scenario: 'cancel',
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
  });
});
