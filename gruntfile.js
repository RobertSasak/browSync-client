'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        yeoman: yeomanConfig,
        watch: {
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        // not enabled since usemin task does concat and uglify
        // check index.html to edit your build targets
        // enable this task if you prefer defining your build targets here
        /*uglify: {
            dist: {}
        },*/
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.app %>/index.html'
        },
        usemin: {
            options: {
                dirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            // dist: {
            //     files: {
            //         '<%= yeoman.dist %>/styles/main.css': [
            //             '.tmp/styles/{,*/}*.css',
            //             '<%= yeoman.app %>/styles/{,*/}*.css'
            //         ]
            //     }
            // }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/*',
                        'bower_components/chocolatechip-ui/chui/chui.android-3.0.3.min.css',
                        'bower_components/chocolatechip-ui/chui/chui.win-3.0.3.min.css',
                        'bower_components/chocolatechip-ui/chui/chui.ios-3.0.3.min.css',
                        'res/**/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: [
                        'generated/*'
                    ]
                }]
            }
        },
        concurrent: {
            server: [
                //'compass',
                //'coffee:dist'
            ],
            dist: [
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },
        'phonegap-build': {
            debug: {
                options: {
                    archive: 'release/browSync-<%= pkg.version %>.zip',
                    'appId': '424274',
                    'user': {
                        'token': 'yok8pziDhmLsaVin9vrm'
                    },
                    timeout: 2000000,
                    keys: {
                        android: {
                            'key_pw': 'browsync',
                            'keystore_pw': 'browsync'
                        }
                    }
                }
            },
            release: {
                options: {
                    archive: 'release/browSync-<%= pkg.version %>.zip',
                    'appId': '424274',
                    'user': {
                        'token': 'yok8pziDhmLsaVin9vrm'
                    },
                    timeout: 2000000,
                    download: {
                        ios: 'release/browSync-<%= pkg.version %>.ipa',
                        android: 'release/browSync-<%= pkg.version %>.apk',
                        winphone: 'release/browSync-<%= pkg.version %>.xap'
                    },
                    keys: {
                        android: {
                            'key_pw': 'browsync',
                            'keystore_pw': 'browsync'
                        },
                        ios: {
                            'password': '2zelenekapre'
                        }
                    }
                }
            },
            free: {
                options: {
                    archive: 'release/browSync-<%= pkg.version %>.zip',
                    'appId': '424274',
                    'user': {
                        'token': 'yok8pziDhmLsaVin9vrm'
                    },
                    timeout: 2000000,
                    download: {
                        android: 'release/browSync-<%= pkg.version %>-free.apk'
                    },
                    keys: {
                        android: {
                            'key_pw': 'browsync',
                            'keystore_pw': 'browsync'
                        },
                        ios: {
                            'password': '2zelenekapre'
                        }
                    }
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'release/browSync-<%= pkg.version %>.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: './',
                    filter: 'isFile'
                }]
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: ['pkg', 'component'],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'upstream',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        },
        htmlbuild: {
            phonegapConfigFree: {
                src: 'app/config.xml',
                dest: 'dist/',
                options: {
                    beautify: false,
                    data: {
                        appName: 'BrowSync Free',
                        appId: 'net.browsync',
                        version: '<%= pkg.version %>'
                    }
                }
            },
            phonegapConfigRelease: {
                src: 'app/config.xml',
                dest: 'dist/',
                options: {
                    beautify: false,
                    data: {
                        appName: 'BrowSync',
                        appId: 'net.browsync.client',
                        version: '<%= pkg.version %>'
                    }
                }
            },
            phonegapConfigDebug: {
                src: 'app/config.xml',
                dest: 'dist/',
                options: {
                    beautify: false,
                    data: {
                        appName: 'BrowSync Debug',
                        appId: 'net.browsync.client.debug',
                        version: '<%= pkg.version %>-debug'
                    }
                }
            }
        },
        'ftp-deploy': {
            allspark: {
                auth: {
                    host: 'allspark.info',
                    port: 21,
                    authKey: 'allspark'
                },
                src: 'dist',
                dest: 'public/www/client'
            }
        },
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('debug', [
        'default',
        'bump-only',
        'htmlbuild:phonegapConfigDebug',
        'compress',
        'phonegap-build:debug'
    ]);

    grunt.registerTask('release', [
        'default',
        'bump-only',
        'htmlbuild:phonegapConfigRelease',
        'compress',
        'phonegap-build:release',
        'htmlbuild:phonegapConfigFree',
        'compress',
        'phonegap-build:free'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('ftpDeploy', [
        'build',
        'ftp-deploy'
    ]);
};