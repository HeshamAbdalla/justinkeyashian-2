/*jshint node:true*/

// Generated on 2015-12-15 using
// generator-webapp-heroku 0.0.5
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  //Heroku Settings
  var pkg = grunt.file.readJSON('package.json');
  var herokuAppName = pkg.name.replace(/[^a-z0-9]/gi, '');

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    //Heroku Settings
    'file-creator': {
        heroku: {
            files: [{
                //Create Procfile required by Heroku
                file: 'heroku/Procfile',
                method: function(fs, fd, done) {
                    fs.writeSync(fd, 'web: node server.js');
                    done();
                }
            }, {
                //Create package.json for Heroku for adding dependencies (ExpressJS)
                file: 'heroku/package.json',
                method: function(fs, fd, done) {
                    var min = grunt.option('min');
                    fs.writeSync(fd, '{\n');
                    fs.writeSync(fd, '  "name": ' + (pkg.name ? '"' + pkg.name + '"' : '""') + ',\n');
                    fs.writeSync(fd, '  "version": ' + (pkg.version ? '"' + pkg.version + '"' : '""') + ',\n');
                    fs.writeSync(fd, '  "description": ' + (pkg.description ? '"' + pkg.description + '"' : '""') + ',\n');
                    fs.writeSync(fd, '  "main": "server.js",\n');
                    fs.writeSync(fd, '  "dependencies": {\n');
                    fs.writeSync(fd, '    "express": "3.*"');
                    if (min) {
                        fs.writeSync(fd, '\n');
                    } else {
                        fs.writeSync(fd, ',\n    "bower": "^1.3"\n');
                    }
                    fs.writeSync(fd, '  },\n');
                    fs.writeSync(fd, '  "scripts": {\n');
                    fs.writeSync(fd, '    "start": "node server.js"');
                    if (min) {
                        fs.writeSync(fd, '\n');
                    } else {
                        fs.writeSync(fd, ',\n    "postinstall": "bower install"\n');
                    }
                    fs.writeSync(fd, '  },\n');
                    fs.writeSync(fd, '  "author": ' + (pkg.author ? '"' + pkg.author + '"' : '""') + ',\n');
                    fs.writeSync(fd, '  "license": ' + (pkg.license ? '"' + pkg.license + '"' : '""') + '\n');
                    fs.writeSync(fd, '}');
                    done();
                }
            }, {
                //Create server.js used by ExpressJS within Heroku
                file: 'heroku/server.js',
                method: function(fs, fd, done) {
                    var useAuth = false;
                    fs.writeSync(fd, 'var express = require("express");\n');
                    fs.writeSync(fd, 'var app = express();\n');
                    if (useAuth) {
                        var userName = 'test';
                        var password = 'password1';
                        fs.writeSync(fd, 'app.use(express.basicAuth("' + userName + '", "' + password + '"));\n');
                    }
                    fs.writeSync(fd, 'app.use(express.static(__dirname));\n');
                    fs.writeSync(fd, 'app.get("/", function(req, res){\n');
                    fs.writeSync(fd, '  res.sendfile("/index.html");\n');
                    fs.writeSync(fd, '});\n');
                    fs.writeSync(fd, 'var port = process.env.PORT || 9000;\n');
                    fs.writeSync(fd, 'app.listen(port, function() {\n');
                    fs.writeSync(fd, '    console.log("Listening on port " + port);\n');
                    fs.writeSync(fd, '});');
                    done();
                }
            }, {
                //Add .gitignore to ensure node_modules folder doesn't get uploaded
                file: 'heroku/.gitignore',
                method: function(fs, fd, done) {
                    fs.writeSync(fd, 'node_modules');
                    done();
                }
            }]
        }
    },
    //Heroku Settings
    shell: {
        'heroku-create': {
            command: [
                'cd heroku',
                'heroku create ' + herokuAppName,
                'heroku config:set PORT=80 --app ' + herokuAppName
            ].join('&&')
        },
        'heroku-dyno': {
            command: [
                'cd heroku',
                'heroku ps:scale web=1 --app ' + herokuAppName
            ].join('&&')
        },
        'heroku-git-init': {
            command: [
                'cd heroku',
                'git init',
                'git remote add ' + herokuAppName + ' git@heroku.com:' + herokuAppName + '.git',
            ].join('&&')
        },
        'heroku-git-push': {
            command: [
                'cd heroku',
                'git add -A',
                'git commit -m "' + (grunt.option('gitm') ? grunt.option('gitm') : 'updated') + '"',
                'START /WAIT git push ' + herokuAppName + ' master',
                'heroku open --app ' + herokuAppName
            ].join('&&')
        }
    }, 

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      test: {
        options: {
          open: false,
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'          
          ]
        }]
      },
      //Heroku Settings
      heroku: {
          files: [{
              dot: true,
              src: [
                  'heroku/*',
                  '!heroku/.git*',
                  '!heroku/.gitignore',
                  '!heroku/.server.js',
                  '!heroku/.Procfile'
              ]
          }]
      },      
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
        }
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        loadPath: 'bower_components'
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
        map: {
          prev: '.tmp/styles/'
        }
        
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ['<%= config.app %>/index.html'],
        exclude: ['bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js']
      },
      sass: {
        src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/scripts/{,*/}*.js',
            '<%= config.dist %>/styles/{,*/}*.css',
            '<%= config.dist %>/images/{,*/}*.*',
            '<%= config.dist %>/styles/fonts/{,*/}*.*',
            '<%= config.dist %>/*.{ico,png}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '<%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/images',
          '<%= config.dist %>/styles'
        ]
      },
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          // true would impact styles with attribute selectors
          removeRedundantAttributes: false,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= config.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/scripts/scripts.js': [
    //         '<%= config.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      //Heroku Settings
      heroku: {
          files: [{
              dest: 'heroku/bower.json',
              src: 'bower.json'
          }, {
              expand: true,
              dot: true,
              cwd: '<%= config.app %>',
              dest: 'heroku',
              src: [
                  '**'
              ]
          }]
      },
      herokumin: {
          files: [{
              expand: true,
              dot: true,
              cwd: '<%= config.dist %>',
              dest: 'heroku',
              src: [
                  '**'
              ]
          }]
      },      
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '.',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // Generates a custom Modernizr build that includes only the tests you
    // reference in your app
    modernizr: {
      dist: {
        devFile: 'bower_components/modernizr/modernizr.js',
        outputFile: '<%= config.dist %>/scripts/vendor/modernizr.js',
        files: {
          src: [
            '<%= config.dist %>/scripts/{,*/}*.js',
            '<%= config.dist %>/styles/{,*/}*.css',
            '!<%= config.dist %>/scripts/vendor/*'
          ]
        },
        uglify: true
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'sass:server'
      ],
      test: [
      ],
      dist: [
        'sass',
        'imagemin',
        'svgmin'
      ]
    }
  });


  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', function (target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'autoprefixer'
      ]);
    }

    grunt.task.run([
      'connect:test',
      'mocha'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'modernizr',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  //Heroku Settings
  grunt.registerTask('heroku', function(method) {
      if (typeof grunt.option('min') === 'undefined') {
          grunt.option('min', true);
      }
      if (grunt.option('min')) {
          grunt.option('cwd', 'dist');
      } else {
          grunt.option('cwd', 'app');
      }
      grunt.task.run([
          'clean:heroku',
          'file-creator:heroku'
      ]);
      if (grunt.option('min')) {
          grunt.task.run([
              'copy:herokumin'
          ]);
      } else {
          grunt.task.run([
              'copy:heroku'
          ]);
      }
      switch (method) {
          case 'init':
              grunt.task.run([
                  'shell:heroku-create',
                  'shell:heroku-git-init',
                  'shell:heroku-git-push',
                  'shell:heroku-dyno',
              ]);
              break;
          case 'push':
              grunt.task.run([
                  'shell:heroku-git-push'
              ]);
              break;
          default:
              console.log('heroku:' + method + ' is not a valid target.');
              break;
      }
  });
};