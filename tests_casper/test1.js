const baseHost = 'http://localhost:8080';

casper.test.begin('Visual Recognition', 10, function suite(test) {
    casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36(KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36');

    // casper.on('remote.message', function(message) {
    //     this.echo('remote message caught: ' + message);
    // });

    // casper.on("page.error", function(msg, trace) {
    //      this.echo(JSON.stringify(msg), 'ERROR');
    // });

    casper.start(baseHost, function() {
        casper.test.comment('Clearing localStorage');
        this.evaluate(function() {
            localStorage.clear()
        })
    })
    .viewport(1900,1000)
    .thenOpen(baseHost, function(result) {
        casper.test.comment('Starting Testing');
        casper.waitForSelector('#landing-page', function() {
            this.test.pass('load page');
        });
    })

    // -- CHECK BLUEMIX LINK

    .then(function check_invalid_key() {
        this.sendKeys('input#input--landing-page--api-key', '0000', { reset: true, keepFocus: true });
        this.waitForSelector('button#button--landing-page--api-key', function() {
            this.mouse.click('button#button--landing-page--api-key');
            this.waitForSelector('#error--landing-page--api-key', function() {
                this.test.pass('check invalid key');
            });
        });
    })

    .then(function check_real_key() {
        this.sendKeys('input#input--landing-page--api-key', '2d7f02e6708f3562a043ebf31159ff849d94d123', { reset: true, keepFocus: true });
        this.waitForSelector('button#button--landing-page--api-key', function() {
            this.mouse.click('button#button--landing-page--api-key');
            this.waitWhileSelector('#landing-page', function() {
                this.test.pass('check real key');
            });
        });
    })

    .then(function check_dropdown() {
        this.waitForSelector('.dropdown--classifier-detail:first-child', function() {
            this.mouse.click('.dropdown--classifier-detail:first-child');
            this.test.pass('check dropdown');
        });
    })

    .then(function check_5mb_dropzone() {
        this.page.uploadFile('.dropzone--classifier-detail:first-child input', require('fs').absolute('test_files/large.png'));
        this.waitForSelector('#error--classifier-detail', function() {
            this.test.pass('check 5mb dropzone');
        });
    })

    // Do this test in the middle to clear out the error
    .then(function check_dropzone() {
        this.page.uploadFile('.dropzone--classifier-detail:first-child input', require('fs').absolute('test_files/small.jpg'));
        this.waitForSelector('button#button--results--clear', function() {
            this.mouse.click('button#button--results--clear')
            this.test.pass('check dropzone');
        });
    })

    .then(function check_wrong_format_dropzone() {
        this.page.uploadFile('.dropzone--classifier-detail:first-child input', require('fs').absolute('test_files/vader.zip'));
        this.waitForSelector('#error--classifier-detail', function() {
            this.test.pass('check wrong format dropzone');
        });
    })

    // -- CHECK API LINK

    // -- TEST UPDATE
    // Test over 100mb
    // Test over 250mb
    // Test less than 10 pics
    // Test over 10k pics
    // Test no class name
    // Test illegal characters
    // Test no files
    // Test less than 1 class
    // Test wrong file type
    // Test a successful update

    // -- TEST DELETE

    // -- TEST CREATE
    // Test over 100mb
    // Test over 250mb
    // Test less than 10 pics
    // Test over 10k pics
    // Test no classifer name
    // Test no class name
    // Test illegal characters
    // Test no files
    // Test less than 2 classes
    // Test wrong file type
    // Test a successful classifier

    .then(function check_update_fake_key() {
        this.mouse.click('button#button--base--update-api-key');
        this.waitForSelector('#exampleModal', function() {
            this.wait(500, function() {
                this.sendKeys('input#input--api-key-modal--api-key', '0000', { reset: true, keepFocus: true });
                this.mouse.click('button#button--api-key-modal--submit')
                this.waitForSelector('#error--api-key-modal--api-key', function() {
                    this.test.pass('check update fake key');
                });
            });
        });
    })

    .then(function check_update_real_key() {
        this.sendKeys('input#input--api-key-modal--api-key', '2d7f02e6708f3562a043ebf31159ff849d94d123', { reset: true, keepFocus: true });
        this.mouse.click('button#button--api-key-modal--submit');
        this.waitWhileSelector('#exampleModal', function() {
            this.test.pass('check update real key');
        });
    })

    .then(function check_logout() {
        this.mouse.click('button#button--base--update-api-key')
        this.waitForSelector('#exampleModal', function() {
            this.wait(500, function() {
                this.mouse.click('button#button--api-key-modal--logout')
                this.waitForSelector('#landing-page', function() {
                    this.test.pass('check logout');
                });
            });
        });
    })

    .run(function () {
        test.done();
    })
});
