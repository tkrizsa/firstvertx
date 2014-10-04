var vertx = require('vertx');
var xld = require('xld.js');

xld.log('XLD AUTH started ...');
xld.moduleRegister('auth');

var Actor = require('./model/actor.js');
(new Actor()).publish();

var CredentEmail = require('./model/credent.email.js');
(new CredentEmail()).publish();

var Actor_x_CredentEmail = require('./model/actor._x_.credent.email.js');
(new Actor_x_CredentEmail()).publish();

