/**
 Express two-factor module
 in express server file do:

 var express = require('express');
 var app_https = express();
 require('express-twofactor').set(app_https);

 var port = process.env.NODE_ENV == 'development' || process.env.NODE_ENV == undefined ? globs.PORT_LISTEN_DEV : globs.PORT_LISTEN_DIST;

 var server = https.createServer({
        key: privateKey,
        cert: certificate,
        ca: [c1, c2]
    }, app_https).listen(port, globs.IPLISTEN);

 Database Postgresql table: token_two_factor

 field: token_id:serial (prim key)
 field: busienss_id:number
 field: enabled:boolean
 field: otpauth_url:char(256)
 field: hex:char(256)
 field: hex:char(256)
 field: ascii:char(256) 
 field: created:timestamp(0)
 field: secret32:char(512)
 **/

module.exports.set = function (app) {

    var co = require('co'),
        pgconn = require('pgconn').create(),
        cors = require('cors'),
        base64 = require('base64'),
        qr = require('qr-image'),
        speakeasy = require('speakeasy');

    /**
     twoFactorCheck
     @method twoFactorCheck
     **/
    app.all('/twoFactorCheck/:user/:pass', cors({origin: '*'}), function (req, res) {
        co(function* twoFactorCheck() {
            try {
                var user = req.params.user;
                var pass = req.params.pass;
                var statement;
                statement = `SELECT enabled FROM token_two_factor WHERE business_id = ${businessId}`;
                var result = yield pgconn.coquery('dynawebs', pg, statement);
                if (result.rows[0] == undefined || result.rows["0"].enabled != true) {
                    res.send({
                        businessId: businessId,
                        enabled: false
                    });
                    return;
                }
                res.send({
                    businessId: businessId,
                    enabled: true
                });
            } catch (err) {
                console.log('twoFactorCheck error 0: ', err, err.stack);
            }
        }).then(function () {
        }, function (err) {
            console.log('twoFactorCheck error 1: ', err, err.stack);
        });
    });

    app.all('/twoFactor/:user/:pass/:token/:enable', cors({origin: '*'}), function (req, res) {
        co(function* twoFactorCheck() {
            try {
                var user = req.params.user;
                var pass = req.params.pass;
                var token = req.params.token;
                var enable = req.params.enable;

                var statement = `SELECT secret32 FROM token_two_factor WHERE business_id = ${businessId}`;
                var result = yield pgconn.coquery('exampledb', pg, statement);
                if (result.rows[0] == undefined)
                    return res.send({});

                var secret32 = result.rows[0].secret32;
                var result = speakeasy.totp.verify({
                    secret: secret32,
                    encoding: 'base32',
                    token: token,
                    window: 70
                });
                if (!result)
                    return res.send({result: false});

                if (!enable)
                    return res.send({result: true});

                var statement = `UPDATE token_two_factor SET enabled = true WHERE business_id = ${businessId}`;
                var result = yield pgconn.coquery('dynawebs', pg, statement);
                return res.send({result: true});

            } catch (err) {
                console.log('twoFactorCheck error 2: ', err, err.stack);
            }
        }).then(function () {
        }, function (err) {
            console.log('twoFactorCheck error 3: ', err, err.stack);
        });
    })

    app.all('/twoFactorGenQr/:user/:pass/', cors({origin: '*'}), function (req, res) {
        co(function* twoFactorCheck() {
            try {
                var user = req.params.user;
                var pass = req.params.pass;
                var statement;

                statement = `DELETE FROM token_two_factor WHERE business_id = ${businessId}`;
                var result = yield pgconn.coquery('dynawebs', pg, statement);

                var secret = speakeasy.generateSecret();
                var svg_string = qr.imageSync(secret.otpauth_url, {type: 'svg'});

                statement = `INSERT INTO token_two_factor (business_id, enabled, otpauth_url, hex, ascii, secret32) 
                        VALUES (${businessId}, false, '${secret.otpauth_url}', '${secret.hex}', '${secret.ascii}', '${secret.base32}')`;
                var result = yield pgconn.coquery('dynawebs', pg, statement);
                return res.send(svg_string);

            } catch (err) {
                console.log('twoFactorCheck error 2: ', err, err.stack);
            }
        }).then(function () {
        }, function (err) {
            console.log('twoFactorCheck error 3: ', err, err.stack);
        });
    })
};

